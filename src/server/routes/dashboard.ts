import { Router } from "express";
import { db } from "../db";
import { projects, tasks, projectMembers, activities, users } from "../db/schema";
import { eq, and, count, sql } from "drizzle-orm";
import { authenticateToken } from "../middleware/auth";
import { AuthenticatedRequest } from "../types";

const router = Router();

// Get dashboard statistics
router.get("/stats", authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.user!.id;

    // Get user's projects
    const userProjectIds = await db
      .select({ projectId: projectMembers.projectId })
      .from(projectMembers)
      .where(eq(projectMembers.userId, userId));

    const projectIds = userProjectIds.map((p) => p.projectId);

    if (projectIds.length === 0) {
      return res.json({
        success: true,
        data: {
          activeProjects: 0,
          tasksCompleted: 0,
          teamMembers: 0,
          productivity: 0,
        },
      });
    }

    // Active projects count
    const activeProjectsResult = await db
      .select({ count: count() })
      .from(projects)
      .where(
        and(
          eq(projects.status, "active"),
          sql`${projects.id} IN (${sql.join(projectIds, sql`, `)})`
        )
      );

    const activeProjects = activeProjectsResult[0]?.count || 0;

    // Tasks completed
    const completedTasksResult = await db
      .select({ count: count() })
      .from(tasks)
      .where(
        and(
          eq(tasks.status, "done"),
          sql`${tasks.projectId} IN (${sql.join(projectIds, sql`, `)})`
        )
      );

    const tasksCompleted = completedTasksResult[0]?.count || 0;

    // Team members (unique users across all projects)
    const teamMembersResult = await db
      .select({ count: count() })
      .from(projectMembers)
      .where(sql`${projectMembers.projectId} IN (${sql.join(projectIds, sql`, `)})`);

    const teamMembers = teamMembersResult[0]?.count || 0;

    // Calculate productivity (completed tasks / total tasks * 100)
    const totalTasksResult = await db
      .select({ count: count() })
      .from(tasks)
      .where(sql`${tasks.projectId} IN (${sql.join(projectIds, sql`, `)})`);

    const totalTasks = totalTasksResult[0]?.count || 0;
    const productivity = totalTasks > 0 ? Math.round((tasksCompleted / totalTasks) * 100) : 0;

    res.json({
      success: true,
      data: {
        activeProjects,
        tasksCompleted,
        teamMembers,
        productivity,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get recent activities
router.get("/activities", authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.user!.id;

    // Get user's projects
    const userProjectIds = await db
      .select({ projectId: projectMembers.projectId })
      .from(projectMembers)
      .where(eq(projectMembers.userId, userId));

    const projectIds = userProjectIds.map((p) => p.projectId);

    if (projectIds.length === 0) {
      return res.json({
        success: true,
        data: [],
      });
    }

    const recentActivities = await db
      .select({
        id: activities.id,
        action: activities.action,
        entityType: activities.entityType,
        metadata: activities.metadata,
        createdAt: activities.createdAt,
        user: {
          id: users.id,
          name: users.name,
        },
        project: {
          id: projects.id,
          name: projects.name,
        },
      })
      .from(activities)
      .innerJoin(users, eq(activities.userId, users.id))
      .innerJoin(projects, eq(activities.projectId, projects.id))
      .where(sql`${activities.projectId} IN (${sql.join(projectIds, sql`, `)})`)
      .orderBy(sql`${activities.createdAt} DESC`)
      .limit(20);

    // Parse metadata and format response
    const formattedActivities = recentActivities.map((activity) => {
      const metadata = activity.metadata ? JSON.parse(activity.metadata) : {};
      return {
        id: activity.id,
        user: activity.user.name,
        project: activity.project.name,
        action: activity.action,
        task: metadata.title || "",
        time: activity.createdAt,
      };
    });

    res.json({
      success: true,
      data: formattedActivities,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
