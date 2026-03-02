import "dotenv/config";
import express from "express";
import cors from "cors";
import { authRouter } from "./routes/auth.ts";
import { projectsRouter } from "./routes/projects.ts";
import { tasksRouter } from "./routes/tasks.ts";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000"],
    credentials: true,
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API routes
  app.use("/api/auth", authRouter);
  app.use("/api/projects", projectsRouter);
  app.use("/api/tasks", tasksRouter);
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "pong" });
  });

  return app;
}
