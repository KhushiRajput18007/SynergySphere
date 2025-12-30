import { Router } from "express";
import { db } from "../db/index.ts";
import { tasks } from "../db/schema.ts";
import { eq } from "drizzle-orm";

export const tasksRouter = Router();

tasksRouter.get("/project/:projectId", async (req, res) => {
    const { projectId } = req.params;
    try {
        const projectTasks = await db.select().from(tasks).where(eq(tasks.projectId, projectId));
        res.json(projectTasks);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

tasksRouter.post("/", async (req, res) => {
    try {
        const [task] = await db.insert(tasks).values(req.body).returning();
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

tasksRouter.patch("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const [updatedTask] = await db.update(tasks).set({
            ...req.body,
            updatedAt: new Date()
        }).where(eq(tasks.id, id)).returning();
        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
