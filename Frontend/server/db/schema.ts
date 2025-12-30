import { pgTable, text, timestamp, boolean, integer, uuid, pgEnum, primaryKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const priorityEnum = pgEnum("priority", ["low", "medium", "high"]);
export const taskStatusEnum = pgEnum("status", ["todo", "inprogress", "done"]);
export const notificationCategoryEnum = pgEnum("category", ["tasks", "messages", "team"]);

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    role: text("role"),
    department: text("department"),
    avatarDataUrl: text("avatar_data_url"),
});

export const projects = pgTable("projects", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    description: text("description"),
    ownerId: uuid("owner_id").references(() => users.id).notNull(),
    managerId: uuid("manager_id").references(() => users.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    tags: text("tags").array(),
    startDate: timestamp("start_date"),
    endDate: timestamp("end_date"),
    priority: priorityEnum("priority"),
    imageDataUrl: text("image_data_url"),
});

export const projectMembers = pgTable("project_members", {
    projectId: uuid("project_id").references(() => projects.id).notNull(),
    userId: uuid("user_id").references(() => users.id).notNull(),
}, (t) => ({
    pk: primaryKey({ columns: [t.projectId, t.userId] }),
}));

export const tasks = pgTable("tasks", {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id").references(() => projects.id).notNull(),
    title: text("title").notNull(),
    description: text("description"),
    assigneeId: uuid("assignee_id").references(() => users.id),
    dueDate: timestamp("due_date"),
    status: taskStatusEnum("status").default("todo").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    tags: text("tags").array(),
    priority: priorityEnum("priority"),
    imageDataUrl: text("image_data_url"),
});

export const comments = pgTable("comments", {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id").references(() => projects.id).notNull(),
    taskId: uuid("task_id").references(() => tasks.id),
    authorId: uuid("author_id").references(() => users.id).notNull(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    parentId: uuid("parent_id"), // for threaded replies
});

export const notifications = pgTable("notifications", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id).notNull(),
    message: text("message").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    read: boolean("read").default(false).notNull(),
    category: notificationCategoryEnum("category"),
    projectId: uuid("project_id").references(() => projects.id),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
    projects: many(projects, { relationName: "owner" }),
    managedProjects: many(projects, { relationName: "manager" }),
    projectMembers: many(projectMembers),
    tasks: many(tasks),
    comments: many(comments),
    notifications: many(notifications),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
    owner: one(users, {
        fields: [projects.ownerId],
        references: [users.id],
        relationName: "owner",
    }),
    manager: one(users, {
        fields: [projects.managerId],
        references: [users.id],
        relationName: "manager",
    }),
    members: many(projectMembers),
    tasks: many(tasks),
    comments: many(comments),
}));

export const projectMembersRelations = relations(projectMembers, ({ one }) => ({
    project: one(projects, {
        fields: [projectMembers.projectId],
        references: [projects.id],
    }),
    user: one(users, {
        fields: [projectMembers.userId],
        references: [users.id],
    }),
}));

export const tasksRelations = relations(tasks, ({ one, many }) => ({
    project: one(projects, {
        fields: [tasks.projectId],
        references: [projects.id],
    }),
    assignee: one(users, {
        fields: [tasks.assigneeId],
        references: [users.id],
    }),
    comments: many(comments),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
    project: one(projects, {
        fields: [comments.projectId],
        references: [projects.id],
    }),
    task: one(tasks, {
        fields: [comments.taskId],
        references: [tasks.id],
    }),
    author: one(users, {
        fields: [comments.authorId],
        references: [users.id],
    }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
    user: one(users, {
        fields: [notifications.userId],
        references: [users.id],
    }),
    project: one(projects, {
        fields: [notifications.projectId],
        references: [projects.id],
    }),
}));
