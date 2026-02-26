import { Router } from "express";
import { db } from "../db/index.ts";
import { projects, projectMembers, users } from "../db/schema.ts";
import { eq, and } from "drizzle-orm";

export const projectsRouter = Router();

// Get user's projects
projectsRouter.get("/", async (req, res) => {
    const userId = req.query.userId as string;
    if (!userId) return res.status(400).json({ error: "User ID required" });

    try {
        const userProjects = await db.query.projectMembers.findMany({
            where: eq(projectMembers.userId, userId),
            with: {
                project: true
            }
        });
        res.json(userProjects.map(up => up.project));
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// Create project
projectsRouter.post("/", async (req, res) => {
    const { name, description, ownerId, managerId } = req.body;
    try {
        const [project] = await db.insert(projects).values({
            name,
            description,
            ownerId,
            managerId,
        }).returning();

        // Auto-add owner as member
        await db.insert(projectMembers).values({
            projectId: project.id,
            userId: ownerId,
        });

        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// Add member to project
projectsRouter.post("/:id/members", async (req, res) => {
    const { id: projectId } = req.params;
    const { emailOrUserId } = req.body;

    try {
        // Find user first
        let user = await db.query.users.findFirst({
            where: eq(users.id, emailOrUserId)
        });

        if (!user) {
            user = await db.query.users.findFirst({
                where: eq(users.email, emailOrUserId)
            });
        }

        if (!user) return res.status(404).json({ error: "User not found" });

        await db.insert(projectMembers).values({
            projectId,
            userId: user.id,
        }).onConflictDoNothing();

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
