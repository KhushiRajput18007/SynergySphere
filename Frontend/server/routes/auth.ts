import { Router } from "express";
import { db } from "../db/index.ts";
import { users } from "../db/schema.ts";
import { eq } from "drizzle-orm";

export const authRouter = Router();

authRouter.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user exists
        const [existingUser] = await db.select().from(users).where(eq(users.email, email)).limit(1);
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        const [newUser] = await db.insert(users).values({
            name,
            email,
            password, // In a real app, hash this!
        }).returning();

        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

authRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

        if (!user || user.password !== password) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
