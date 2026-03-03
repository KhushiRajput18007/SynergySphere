import { Router } from "express";
import { z } from "zod";
import { db } from "../db";
import { notifications } from "../db/schema";
import { eq, desc } from "drizzle-orm";
import { authenticateToken } from "../middleware/auth";
import { AuthenticatedRequest } from "../types";

const router = Router();

// Get user notifications
router.get("/", authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userNotifications = await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, req.user!.id))
      .orderBy(desc(notifications.createdAt));

    res.json({
      success: true,
      data: userNotifications,
    });
  } catch (error) {
    next(error);
  }
});

// Mark as read
router.put("/:id/read", authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const notificationId = req.params.id as string;

    const notification = await db.query.notifications.findFirst({
      where: eq(notifications.id, notificationId),
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        error: "Notification not found",
      });
    }

    if (notification.userId !== req.user!.id) {
      return res.status(403).json({
        success: false,
        error: "Access denied",
      });
    }

    const [updated] = await db
      .update(notifications)
      .set({ read: true })
      .where(eq(notifications.id, notificationId))
      .returning();

    res.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
});

// Mark all as read
router.put("/read-all", authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    await db
      .update(notifications)
      .set({ read: true })
      .where(eq(notifications.userId, req.user!.id));

    res.json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    next(error);
  }
});

// Delete notification
router.delete("/:id", authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const notificationId = req.params.id as string;

    const notification = await db.query.notifications.findFirst({
      where: eq(notifications.id, notificationId),
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        error: "Notification not found",
      });
    }

    if (notification.userId !== req.user!.id) {
      return res.status(403).json({
        success: false,
        error: "Access denied",
      });
    }

    await db.delete(notifications).where(eq(notifications.id, notificationId));

    res.json({
      success: true,
      message: "Notification deleted",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
