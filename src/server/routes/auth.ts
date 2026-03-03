import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { authenticateToken } from "../middleware/auth";
import { upload, uploadToCloudinary } from "../middleware/upload";
import { AuthenticatedRequest } from "../types";

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "30d";

// Convert expiresIn to proper format
const getExpiresIn = (): number | undefined => {
  const value = JWT_EXPIRES_IN;
  if (value.endsWith("d")) {
    return parseInt(value) * 24 * 60 * 60; // Convert days to seconds
  }
  return undefined;
};

// Validation schemas
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Generate JWT token
const generateToken = (user: {
  id: string;
  email: string;
  name: string;
  role: string;
}) => {
  return jwt.sign(user, JWT_SECRET, { expiresIn: getExpiresIn() });
};

// Register
router.post("/register", async (req, res, next) => {
  try {
    const { email, password, name } = registerSchema.parse(req.body);

    // Check if user exists
    const existingUserResult = await db.select().from(users).where(eq(users.email, email)).limit(1);
    const existingUser = existingUserResult[0];

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "User already exists",
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        email,
        passwordHash,
        name,
      })
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
      });

    const token = generateToken(newUser);

    res.status(201).json({
      success: true,
      data: {
        user: newUser,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Login
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    // Find user
    const userResult = await db.select().from(users).where(eq(users.email, email)).limit(1);
    const user = userResult[0];

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.passwordHash);

    if (!isValid) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          avatarUrl: user.avatarUrl,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get current user
router.get("/me", authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userResult = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        avatarUrl: users.avatarUrl,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, req.user!.id))
      .limit(1);
    const user = userResult[0];

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

// Update profile
router.put("/profile", authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { name } = z.object({ name: z.string().min(2) }).parse(req.body);

    const [updatedUser] = await db
      .update(users)
      .set({ name, updatedAt: new Date() })
      .where(eq(users.id, req.user!.id))
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        avatarUrl: users.avatarUrl,
      });

    res.json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
});

// Upload avatar
router.post(
  "/avatar",
  authenticateToken,
  upload.single("avatar"),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: "No file uploaded",
        });
      }

      const avatarUrl = await uploadToCloudinary(req.file);

      const [updatedUser] = await db
        .update(users)
        .set({ avatarUrl, updatedAt: new Date() })
        .where(eq(users.id, req.user!.id))
        .returning({
          id: users.id,
          email: users.email,
          name: users.name,
          role: users.role,
          avatarUrl: users.avatarUrl,
        });

      res.json({
        success: true,
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
