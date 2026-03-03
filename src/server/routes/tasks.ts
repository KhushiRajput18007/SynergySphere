import { Router } from "express";
import { z } from "zod";
import { db } from "../db";
import { tasks, projectMembers, projects, users, activities } from "../db/schema";
import { eq, and } from "drizzle-orm";
import { authenticateToken } from "../middleware/auth";
import { AuthenticatedRequest } from "../types";

const router = Router();

// Validation schemas
const createTaskSchema = z.object({
  projectId: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(["todo", "in-progress", "done"]).default("todo"),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  assigneeId: z.string().uuid().optional(),
});

const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.enum(["todo", "in-progress", "done"]).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  assigneeId: z.string().uuid().optional().nullable(),
});

// Get all tasks for current user
router.get("/", authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const projectId = req.query.projectId as string | undefined;

    let query = db
      .select({
        task: tasks,
        project: {
          id: projects.id,
          name: projects.name,
        },
        assignee: {
          id: users.id,
          name: users.name,
          avatarUrl: users.avatarUrl,
        },
      })
      .from(tasks)
      .innerJoin(projects, eq(tasks.projectId, projects.id))
      .leftJoin(users, eq(tasks.assigneeId, users.id))
      .innerJoin(
        projectMembers,
        and(
          eq(tasks.projectId, projectMembers.projectId),
          eq(projectMembers.userId, req.user!.id)
        )
      );

    if (projectId) {
      query = query.where(eq(tasks.projectId, projectId)) as typeof query;
    }

    const userTasks = await query;

    const formattedTasks = userTasks.map((t) => ({
      ...t.task,
      project: t.project,
      assignee: t.assignee,
    }));

    res.json({
      success: true,
      data: formattedTasks,
    });
  } catch (error) {
    next(error);
  }
});

// Create task
router.post("/", authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const data = createTaskSchema.parse(req.body);

    // Check if user is member of project
    const membership = await db.query.projectMembers.findFirst({
      where: and(
        eq(projectMembers.projectId, data.projectId),
        eq(projectMembers.userId, req.user!.id)
      ),
    });

    if (!membership) {
      return res.status(403).json({
        success: false,
        error: "Access denied",
      });
    }

    const [task] = await db
      .insert(tasks)
      .values({
        projectId: data.projectId,
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        assigneeId: data.assigneeId || null,
        createdBy: req.user!.id,
      })
      .returning();

    // Log activity
    await db.insert(activities).values({
      userId: req.user!.id,
      projectId: data.projectId,
      action: "created task",
      entityType: "task",
      entityId: task.id,
      metadata: JSON.stringify({ title: data.title }),
    });

    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
});

// Get task by ID
router.get("/:id", authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const taskId = req.params.id as string;

    const task = await db.query.tasks.findFirst({
      where: eq(tasks.id, taskId),
      with: {
        project: {
          columns: {
            id: true,
            name: true,
          },
        },
        assignee: {
          columns: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        creator: {
          columns: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        error: "Task not found",
      });
    }

    // Check if user is member of project
    const membership = await db.query.projectMembers.findFirst({
      where: and(
        eq(projectMembers.projectId, task.projectId),
        eq(projectMembers.userId, req.user!.id)
      ),
    });

    if (!membership) {
      return res.status(403).json({
        success: false,
        error: "Access denied",
      });
    }

    res.json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
});

// Update task
router.put("/:id", authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const taskId = req.params.id as string;
    const data = updateTaskSchema.parse(req.body);

    const existingTask = await db.query.tasks.findFirst({
      where: eq(tasks.id, taskId),
    });

    if (!existingTask) {
      return res.status(404).json({
        success: false,
        error: "Task not found",
      });
    }

    // Check if user is member of project
    const membership = await db.query.projectMembers.findFirst({
      where: and(
        eq(projectMembers.projectId, existingTask.projectId),
        eq(projectMembers.userId, req.user!.id)
      ),
    });

    if (!membership) {
      return res.status(403).json({
        success: false,
        error: "Access denied",
      });
    }

    const [task] = await db
      .update(tasks)
      .set({
        ...data,
        assigneeId: data.assigneeId === null ? null : data.assigneeId,
        updatedAt: new Date(),
      })
      .where(eq(tasks.id, taskId))
      .returning();

    // Log activity if status changed
    if (data.status && data.status !== existingTask.status) {
      await db.insert(activities).values({
        userId: req.user!.id,
        projectId: existingTask.projectId,
        action: `moved task to ${data.status}`,
        entityType: "task",
        entityId: task.id,
        metadata: JSON.stringify({ title: task.title, status: data.status }),
      });
    }

    res.json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
});

// Update task status (PATCH)
router.patch("/:id/status", authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const taskId = req.params.id as string;
    const { status } = z.object({
      status: z.enum(["todo", "in-progress", "done"]),
    }).parse(req.body);

    const existingTask = await db.query.tasks.findFirst({
      where: eq(tasks.id, taskId),
    });

    if (!existingTask) {
      return res.status(404).json({
        success: false,
        error: "Task not found",
      });
    }

    // Check if user is member of project
    const membership = await db.query.projectMembers.findFirst({
      where: and(
        eq(projectMembers.projectId, existingTask.projectId),
        eq(projectMembers.userId, req.user!.id)
      ),
    });

    if (!membership) {
      return res.status(403).json({
        success: false,
        error: "Access denied",
      });
    }

    const [task] = await db
      .update(tasks)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(eq(tasks.id, taskId))
      .returning();

    // Log activity
    await db.insert(activities).values({
      userId: req.user!.id,
      projectId: existingTask.projectId,
      action: `moved task to ${status}`,
      entityType: "task",
      entityId: task.id,
      metadata: JSON.stringify({ title: task.title, status }),
    });

    res.json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
});

// Delete task
router.delete("/:id", authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const taskId = req.params.id as string;

    const existingTask = await db.query.tasks.findFirst({
      where: eq(tasks.id, taskId),
    });

    if (!existingTask) {
      return res.status(404).json({
        success: false,
        error: "Task not found",
      });
    }

    // Check if user is member of project
    const membership = await db.query.projectMembers.findFirst({
      where: and(
        eq(projectMembers.projectId, existingTask.projectId),
        eq(projectMembers.userId, req.user!.id)
      ),
    });

    if (!membership) {
      return res.status(403).json({
        success: false,
        error: "Access denied",
      });
    }

    await db.delete(tasks).where(eq(tasks.id, taskId));

    res.json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
