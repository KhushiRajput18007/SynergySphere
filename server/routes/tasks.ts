import { Router } from "express";
import { db } from "../db/index.ts";
import { tasks } from "../db/schema.ts";
import { eq } from "drizzle-orm";

export const tasksRouter = Router();

// Get tasks (supports ?projectId=... or all tasks)
tasksRouter.get("/", async (req, res) => {
    const projectId = req.query.projectId as string;
    try {
        let results;
        if (projectId) {
            results = await db.select().from(tasks).where(eq(tasks.projectId, projectId));
        } else {
            results = await db.select().from(tasks);
        }

        const mapped = results.map(t => ({
            ...t,
            createdAt: t.createdAt.getTime(),
            updatedAt: t.updatedAt.getTime(),
            dueDate: t.dueDate?.toISOString()
        }));
        res.json(mapped);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

tasksRouter.post("/", async (req, res) => {
    const { title, description, projectId, assigneeId, dueDate, status, tags, priority, imageDataUrl } = req.body;
    try {
        const [task] = await db.insert(tasks).values({
            title,
            description,
            projectId,
            assigneeId,
            dueDate: dueDate ? new Date(dueDate) : null,
            status: status || "todo",
            tags: tags || [],
            priority: priority || "medium",
            imageDataUrl,
            createdAt: new Date(),
            updatedAt: new Date(),
        }).returning();

        res.status(201).json({
            ...task,
            createdAt: task.createdAt.getTime(),
            updatedAt: task.updatedAt.getTime(),
            dueDate: task.dueDate?.toISOString()
        });
    } catch (error) {
        console.error("Create task error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

tasksRouter.patch("/:id", async (req, res) => {
    const { id } = req.params;
    const body = { ...req.body };
    if (body.dueDate) body.dueDate = new Date(body.dueDate);

    try {
        const [updatedTask] = await db.update(tasks).set({
            ...body,
            updatedAt: new Date()
        }).where(eq(tasks.id, id)).returning();

        res.json({
            ...updatedTask,
            createdAt: updatedTask.createdAt.getTime(),
            updatedAt: updatedTask.updatedAt.getTime(),
            dueDate: updatedTask.dueDate?.toISOString()
        });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
