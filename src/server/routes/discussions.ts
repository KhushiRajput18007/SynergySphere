import { Router } from "express";
import { z } from "zod";
import { db } from "../db";
import { discussions, projectMembers, users, projects } from "../db/schema";
import { eq, and, desc } from "drizzle-orm";
import { authenticateToken } from "../middleware/auth";
import { AuthenticatedRequest } from "../types";

const router = Router();

// Validation schemas
const sendMessageSchema = z.object({
  projectId: z.string().uuid(),
  content: z.string().min(1),
});

// Get messages for a project
router.get("/:projectId", authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const projectId = req.params.projectId as string;

    // Check if user is member of project
    const membership = await db.query.projectMembers.findFirst({
      where: and(
        eq(projectMembers.projectId, projectId),
        eq(projectMembers.userId, req.user!.id)
      ),
    });

    if (!membership) {
      return res.status(403).json({
        success: false,
        error: "Access denied",
      });
    }

    const messages = await db
      .select({
        id: discussions.id,
        content: discussions.content,
        createdAt: discussions.createdAt,
        user: {
          id: users.id,
          name: users.name,
          avatarUrl: users.avatarUrl,
        },
      })
      .from(discussions)
      .innerJoin(users, eq(discussions.userId, users.id))
      .where(eq(discussions.projectId, projectId))
      .orderBy(desc(discussions.createdAt));

    res.json({
      success: true,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
});

// Send message
router.post("/", authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { projectId, content } = sendMessageSchema.parse(req.body);

    // Check if user is member of project
    const membership = await db.query.projectMembers.findFirst({
      where: and(
        eq(projectMembers.projectId, projectId),
        eq(projectMembers.userId, req.user!.id)
      ),
    });

    if (!membership) {
      return res.status(403).json({
        success: false,
        error: "Access denied",
      });
    }

    const [message] = await db
      .insert(discussions)
      .values({
        projectId,
        userId: req.user!.id,
        content,
      })
      .returning();

    // Get user info for response
    const user = await db.query.users.findFirst({
      where: eq(users.id, req.user!.id),
      columns: {
        id: true,
        name: true,
        avatarUrl: true,
      },
    });

    res.status(201).json({
      success: true,
      data: {
        ...message,
        user,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Delete message
router.delete("/:id", authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const messageId = req.params.id as string;

    const message = await db.query.discussions.findFirst({
      where: eq(discussions.id, messageId),
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        error: "Message not found",
      });
    }

    // Check if user is the sender
    if (message.userId !== req.user!.id) {
      return res.status(403).json({
        success: false,
        error: "You can only delete your own messages",
      });
    }

    await db.delete(discussions).where(eq(discussions.id, messageId));

    res.json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
