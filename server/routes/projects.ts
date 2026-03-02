import { Router } from "express";
import { db } from "../db/index.ts";
import { projects, projectMembers, users, notifications } from "../db/schema.ts";
import { eq, and, ne } from "drizzle-orm";

export const projectsRouter = Router();

// Get user's projects (only accepted ones)
projectsRouter.get("/", async (req, res) => {
    const userId = req.query.userId as string;
    if (!userId) return res.status(400).json({ error: "User ID required" });

    try {
        const userProjects = await db.query.projectMembers.findMany({
            where: and(
                eq(projectMembers.userId, userId),
                eq(projectMembers.status, "accepted")
            ),
            with: {
                project: {
                    with: {
                        members: true
                    }
                }
            }
        });

        const mapped = userProjects.map(up => ({
            ...up.project,
            memberIds: up.project.members.filter(m => m.status === "accepted").map(m => m.userId),
            createdAt: up.project.createdAt.getTime(),
            startDate: up.project.startDate?.toISOString(),
            endDate: up.project.endDate?.toISOString(),
        }));

        res.json(mapped);
    } catch (error) {
        console.error("Fetch projects error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Create project
projectsRouter.post("/", async (req, res) => {
    const { name, description, ownerId, managerId, tags, priority, startDate, endDate } = req.body;
    try {
        const [project] = await db.insert(projects).values({
            name,
            description,
            ownerId,
            managerId,
            tags: tags || [],
            priority: priority || "medium",
            startDate: startDate ? new Date(startDate) : null,
            endDate: endDate ? new Date(endDate) : null,
        }).returning();

        // Auto-add owner as accepted member
        await db.insert(projectMembers).values({
            projectId: project.id,
            userId: ownerId,
            status: "accepted"
        });

        res.status(201).json({
            ...project,
            memberIds: [ownerId],
            createdAt: project.createdAt.getTime()
        });
    } catch (error) {
        console.error("Create project error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Add member (Invite)
projectsRouter.post("/:id/members", async (req, res) => {
    const { id: projectId } = req.params;
    const { emailOrUserId } = req.body;

    if (!emailOrUserId) return res.status(400).json({ error: "Email or User ID required" });

    try {
        const project = await db.query.projects.findFirst({ where: eq(projects.id, projectId) });
        if (!project) return res.status(404).json({ error: "Project not found" });

        let user;
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (uuidRegex.test(emailOrUserId)) {
            user = await db.query.users.findFirst({ where: eq(users.id, emailOrUserId) });
        }
        if (!user) {
            user = await db.query.users.findFirst({ where: eq(users.email, emailOrUserId.toLowerCase()) });
        }
        if (!user) return res.status(404).json({ error: "User not found" });

        await db.insert(projectMembers).values({
            projectId,
            userId: user.id,
            status: "pending",
        }).onConflictDoNothing();

        // Send Notification
        await db.insert(notifications).values({
            userId: user.id,
            projectId,
            category: "invitation",
            message: `You have been invited to join the project: ${project.name}`,
        });

        res.json({ success: true });
    } catch (error) {
        console.error("Add member error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Respond to invitation
projectsRouter.post("/:id/invitation", async (req, res) => {
    const { id: projectId } = req.params;
    const { userId, action } = req.body; // action: 'accepted' or 'declined'

    if (!['accepted', 'declined'].includes(action)) {
        return res.status(400).json({ error: "Invalid action" });
    }

    try {
        if (action === 'accepted') {
            await db.update(projectMembers)
                .set({ status: 'accepted' })
                .where(and(eq(projectMembers.projectId, projectId), eq(projectMembers.userId, userId)));
        } else {
            await db.delete(projectMembers)
                .where(and(eq(projectMembers.projectId, projectId), eq(projectMembers.userId, userId)));
        }
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
