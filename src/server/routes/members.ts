import { Router } from "express";
import { z } from "zod";
import { db } from "../db";
import { projectMembers, users, projects, notifications } from "../db/schema";
import { eq, and, count } from "drizzle-orm";
import { authenticateToken } from "../middleware/auth";
import { AuthenticatedRequest } from "../types";

const router = Router();

// Validation schemas
const inviteSchema = z.object({
  projectId: z.string().uuid(),
  email: z.string().email(),
  role: z.enum(["manager", "member"]).default("member"),
});

const updateRoleSchema = z.object({
  role: z.enum(["manager", "member"]),
});

// Get all members across user's projects
router.get("/", authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const projectId = req.query.projectId as string | undefined;

    let query = db
      .select({
        member: projectMembers,
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
          avatarUrl: users.avatarUrl,
        },
        project: {
          id: projects.id,
          name: projects.name,
        },
      })
      .from(projectMembers)
      .innerJoin(users, eq(projectMembers.userId, users.id))
      .innerJoin(projects, eq(projectMembers.projectId, projects.id))
      .innerJoin(
        projectMembers as typeof projectMembers,
        and(
          eq(projectMembers.projectId, projects.id),
          eq(projectMembers.userId, req.user!.id)
        )
      );

    if (projectId) {
      query = query.where(eq(projectMembers.projectId, projectId)) as typeof query;
    }

    const members = await query;

    // Get task counts for each member
    const membersWithStats = await Promise.all(
      members.map(async (m) => {
        const taskCount = await db.$count(
          db.select().from(db.query.tasks as any),
          and(
            eq((db.query.tasks as any).projectId, m.project.id),
            eq((db.query.tasks as any).assigneeId, m.user.id)
          )
        );

        return {
          ...m.member,
          user: m.user,
          project: m.project,
          tasks: taskCount,
        };
      })
    );

    res.json({
      success: true,
      data: membersWithStats,
    });
  } catch (error) {
    next(error);
  }
});

// Invite member
router.post("/invite", authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { projectId, email, role } = inviteSchema.parse(req.body);

    // Check if user is manager of project
    const membership = await db.query.projectMembers.findFirst({
      where: and(
        eq(projectMembers.projectId, projectId),
        eq(projectMembers.userId, req.user!.id)
      ),
    });

    if (!membership || membership.role !== "manager") {
      return res.status(403).json({
        success: false,
        error: "Only managers can invite members",
      });
    }

    // Find user by email
    const userToInvite = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!userToInvite) {
      return res.status(404).json({
        success: false,
        error: "User not found with this email",
      });
    }

    // Check if already member
    const existingMember = await db.query.projectMembers.findFirst({
      where: and(
        eq(projectMembers.projectId, projectId),
        eq(projectMembers.userId, userToInvite.id)
      ),
    });

    if (existingMember) {
      return res.status(400).json({
        success: false,
        error: "User is already a member of this project",
      });
    }

    // Add member
    const [newMember] = await db
      .insert(projectMembers)
      .values({
        projectId,
        userId: userToInvite.id,
        role,
      })
      .returning();

    // Create notification for invited user
    const project = await db.query.projects.findFirst({
      where: eq(projects.id, projectId),
    });

    await db.insert(notifications).values({
      userId: userToInvite.id,
      type: "invite",
      title: "Project Invitation",
      description: `${req.user!.name} invited you to join "${project?.name}"`,
      actionable: true,
      relatedId: projectId,
    });

    res.status(201).json({
      success: true,
      data: newMember,
    });
  } catch (error) {
    next(error);
  }
});

// Update member role
router.put("/:id/role", authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const memberId = req.params.id as string;
    const { role } = updateRoleSchema.parse(req.body);

    const member = await db.query.projectMembers.findFirst({
      where: eq(projectMembers.id, memberId),
    });

    if (!member) {
      return res.status(404).json({
        success: false,
        error: "Member not found",
      });
    }

    // Check if user is manager of project
    const membership = await db.query.projectMembers.findFirst({
      where: and(
        eq(projectMembers.projectId, member.projectId),
        eq(projectMembers.userId, req.user!.id)
      ),
    });

    if (!membership || membership.role !== "manager") {
      return res.status(403).json({
        success: false,
        error: "Only managers can update roles",
      });
    }

    const [updatedMember] = await db
      .update(projectMembers)
      .set({ role })
      .where(eq(projectMembers.id, memberId))
      .returning();

    res.json({
      success: true,
      data: updatedMember,
    });
  } catch (error) {
    next(error);
  }
});

// Remove member
router.delete("/:id", authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const memberId = req.params.id as string;

    const member = await db.query.projectMembers.findFirst({
      where: eq(projectMembers.id, memberId),
    });

    if (!member) {
      return res.status(404).json({
        success: false,
        error: "Member not found",
      });
    }

    // Check if user is manager of project or removing themselves
    const membership = await db.query.projectMembers.findFirst({
      where: and(
        eq(projectMembers.projectId, member.projectId),
        eq(projectMembers.userId, req.user!.id)
      ),
    });

    if (!membership || (membership.role !== "manager" && member.userId !== req.user!.id)) {
      return res.status(403).json({
        success: false,
        error: "Access denied",
      });
    }

    await db.delete(projectMembers).where(eq(projectMembers.id, memberId));

    res.json({
      success: true,
      message: "Member removed successfully",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
