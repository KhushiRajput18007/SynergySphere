import { Router } from "express";
import { z } from "zod";
import { db } from "../db";
import { projects, projectMembers, tasks, users } from "../db/schema";
import { eq, and, desc } from "drizzle-orm";
import { authenticateToken } from "../middleware/auth";
import { AuthenticatedRequest } from "../types";

const router = Router();

// Validation schemas
const createProjectSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  dueDate: z.string().datetime().optional(),
});

const updateProjectSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  status: z.enum(["active", "completed", "archived"]).optional(),
  dueDate: z.string().datetime().optional().nullable(),
});

// Get all projects for current user
router.get("/", authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userProjects = await db
      .select({
        project: projects,
        memberCount: db.$count(
          projectMembers,
          eq(projectMembers.projectId, projects.id)
        ),
        taskCount: db.$count(tasks, eq(tasks.projectId, projects.id)),
        completedTaskCount: db.$count(
          tasks,
          and(eq(tasks.projectId, projects.id), eq(tasks.status, "done"))
        ),
      })
      .from(projects)
      .innerJoin(
        projectMembers,
        eq(projects.id, projectMembers.projectId)
      )
      .where(eq(projectMembers.userId, req.user!.id));

    const formattedProjects = userProjects.map((p) => ({
      ...p.project,
      members: p.memberCount,
      tasks: {
        total: p.taskCount,
        done: p.completedTaskCount,
      },
    }));

    res.json({
      success: true,
      data: formattedProjects,
    });
  } catch (error) {
    next(error);
  }
});

// Create project
router.post("/", authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const data = createProjectSchema.parse(req.body);

    const [project] = await db
      .insert(projects)
      .values({
        name: data.name,
        description: data.description,
        priority: data.priority,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        createdBy: req.user!.id,
      })
      .returning();

    // Add creator as manager
    await db.insert(projectMembers).values({
      projectId: project.id,
      userId: req.user!.id,
      role: "manager",
    });

    res.status(201).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
});

// Get project by ID
router.get("/:id", authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const projectId = req.params.id as string;

    // Check if user is member
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

    const project = await db.query.projects.findFirst({
      where: eq(projects.id, projectId),
      with: {
        members: {
          with: {
            user: {
              columns: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
              },
            },
          },
        },
        tasks: {
          with: {
            assignee: {
              columns: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        error: "Project not found",
      });
    }

    res.json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
});

// Update project
router.put("/:id", authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const projectId = req.params.id as string;
    const data = updateProjectSchema.parse(req.body);

    // Check if user is manager
    const membership = await db.query.projectMembers.findFirst({
      where: and(
        eq(projectMembers.projectId, projectId),
        eq(projectMembers.userId, req.user!.id)
      ),
    });

    if (!membership || membership.role !== "manager") {
      return res.status(403).json({
        success: false,
        error: "Only managers can update projects",
      });
    }

    const [project] = await db
      .update(projects)
      .set({
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        updatedAt: new Date(),
      })
      .where(eq(projects.id, projectId))
      .returning();

    res.json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
});

// Delete project
router.delete("/:id", authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const projectId = req.params.id as string;

    // Check if user is manager
    const membership = await db.query.projectMembers.findFirst({
      where: and(
        eq(projectMembers.projectId, projectId),
        eq(projectMembers.userId, req.user!.id)
      ),
    });

    if (!membership || membership.role !== "manager") {
      return res.status(403).json({
        success: false,
        error: "Only managers can delete projects",
      });
    }

    await db.delete(projects).where(eq(projects.id, projectId));

    res.json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
