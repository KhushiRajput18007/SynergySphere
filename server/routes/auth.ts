import { Router } from "express";
import { db } from "../db/index.ts";
import { users } from "../db/schema.ts";
import { eq } from "drizzle-orm";

export const authRouter = Router();

// Normalize DB row (snake_case) to frontend User shape (camelCase)
function normalizeUser(user: any) {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
        createdAt: user.createdAt instanceof Date
            ? user.createdAt.getTime()
            : (user.created_at instanceof Date ? user.created_at.getTime() : Date.now()),
        role: user.role ?? undefined,
        department: user.department ?? undefined,
        avatarDataUrl: user.avatarDataUrl ?? user.avatar_data_url ?? null,
    };
}

authRouter.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: "Name, email and password are required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters" });
        }

        // Check if user exists
        const [existingUser] = await db.select().from(users).where(eq(users.email, email)).limit(1);
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        const [newUser] = await db.insert(users).values({
            name,
            email,
            password, // In a real app, hash this!
        }).returning();

        res.status(201).json(normalizeUser(newUser));
    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

authRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

        if (!user || user.password !== password) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        res.json(normalizeUser(user));
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
