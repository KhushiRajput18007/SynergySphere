import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from "react";
function makeId() {
  return (
    Date.now().toString(36) +
    Math.random().toString(36).slice(2, 8) +
    crypto.getRandomValues(new Uint32Array(1))[0].toString(36)
  );
}

export type ID = string;

export type User = {
  id: ID;
  name: string;
  email: string;
  password: string; // Demo only; do not use in production
  createdAt: number;
  role?: string;
  department?: string;
  avatarDataUrl?: string | null;
};

export type TaskStatus = "todo" | "inprogress" | "done";

export type Task = {
  id: ID;
  projectId: ID;
  title: string;
  description: string;
  assigneeId: ID | null;
  dueDate: string | null; // ISO date string
  status: TaskStatus;
  createdAt: number;
  updatedAt: number;
  tags?: string[];
  priority?: "low" | "medium" | "high";
  imageDataUrl?: string | null;
};

export type Comment = {
  id: ID;
  projectId: ID;
  taskId: ID | null; // null for project-level threads
  authorId: ID;
  content: string;
  createdAt: number;
  parentId: ID | null; // for threaded replies
};

export type Project = {
  id: ID;
  name: string;
  description?: string;
  ownerId: ID;
  memberIds: ID[];
  createdAt: number;
  tags?: string[];
  managerId?: ID | null;
  startDate?: string | null;
  endDate?: string | null;
  priority?: "low" | "medium" | "high";
  imageDataUrl?: string | null;
};

export type Notification = {
  id: ID;
  userId: ID;
  message: string;
  createdAt: number;
  read: boolean;
  category?: "tasks" | "messages" | "team";
  projectId?: ID | null;
};

export type State = {
  users: Record<ID, User>;
  projects: Record<ID, Project>;
  tasks: Record<ID, Task>;
  comments: Record<ID, Comment>;
  notifications: Record<ID, Notification>;
  currentUserId: ID | null;
};

const LS_KEY = "synergySphere.state.v1";

const initialState: State = {
  users: {},
  projects: {},
  tasks: {},
  comments: {},
  notifications: {},
  currentUserId: null,
};

type Action =
  | { type: "hydrate"; payload: State }
  | { type: "register"; payload: { name: string; email: string; password: string } }
  | { type: "login"; payload: { email: string; password: string } }
  | { type: "logout" }
  | { type: "createUser"; payload: { name: string; email: string; password?: string } }
  | { type: "updateUser"; payload: { id: ID; patch: Partial<Omit<User, "id" | "createdAt" | "password">> & { password?: string } } }
  | { type: "createProject"; payload: { name: string; description?: string; tags?: string[]; managerId?: ID | null; startDate?: string | null; endDate?: string | null; priority?: "low" | "medium" | "high"; imageDataUrl?: string | null } }
  | { type: "addMember"; payload: { projectId: ID; emailOrUserId: string } }
  | { type: "createTask"; payload: Omit<Task, "id" | "createdAt" | "updatedAt"> }
  | { type: "updateTask"; payload: { id: ID; patch: Partial<Task> } }
  | { type: "addComment"; payload: Omit<Comment, "id" | "createdAt"> }
  | { type: "markNotification"; payload: { id: ID; read: boolean } }
  | { type: "addNotification"; payload: Omit<Notification, "id" | "createdAt" | "read"> & { read?: boolean } }
  | { type: "deleteNotification"; payload: { id: ID } }
  | { type: "clearNotificationsForUser"; payload: { userId: ID } };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "hydrate": {
      return { ...state, ...action.payload };
    }
    case "register": {
      const exists = Object.values(state.users).some(
        (u) => u.email.toLowerCase() === action.payload.email.toLowerCase(),
      );
      if (exists) return state;
      const id = makeId();
      const user: User = {
        id,
        name: action.payload.name || action.payload.email.split("@")[0],
        email: action.payload.email,
        password: action.payload.password,
        createdAt: Date.now(),
      };
      return { ...state, users: { ...state.users, [id]: user }, currentUserId: id };
    }
    case "login": {
      const user = Object.values(state.users).find(
        (u) => u.email.toLowerCase() === action.payload.email.toLowerCase() && u.password === action.payload.password,
      );
      if (!user) return state;
      return { ...state, currentUserId: user.id };
    }
    case "logout": {
      return { ...state, currentUserId: null };
    }
    case "createUser": {
      const exists = Object.values(state.users).some((u) => u.email.toLowerCase() === action.payload.email.toLowerCase());
      if (exists) return state;
      const id = makeId();
      const user: User = {
        id,
        name: action.payload.name || action.payload.email.split("@")[0],
        email: action.payload.email,
        password: action.payload.password || makeId(),
        createdAt: Date.now(),
      };
      return { ...state, users: { ...state.users, [id]: user } };
    }
    case "updateUser": {
      const u = state.users[action.payload.id];
      if (!u) return state;
      const patch = action.payload.patch;
      return { ...state, users: { ...state.users, [u.id]: { ...u, ...patch } } };
    }
    case "createProject": {
      if (!state.currentUserId) return state;
      const id = makeId();
      const createdAt = Date.now();
      const memberIds = Array.from(new Set([state.currentUserId, ...(action.payload.managerId ? [action.payload.managerId] : [])]));
      const project: Project = {
        id,
        name: action.payload.name,
        description: action.payload.description,
        ownerId: state.currentUserId,
        memberIds,
        createdAt,
        tags: action.payload.tags,
        managerId: action.payload.managerId ?? state.currentUserId,
        startDate: action.payload.startDate ?? null,
        endDate: action.payload.endDate ?? null,
        priority: action.payload.priority,
        imageDataUrl: action.payload.imageDataUrl ?? null,
      };
      return { ...state, projects: { ...state.projects, [id]: project } };
    }
    case "addMember": {
      const { projectId, emailOrUserId } = action.payload;
      const project = state.projects[projectId];
      if (!project) return state;
      let user = state.users[emailOrUserId as ID];
      if (!user) {
        user = Object.values(state.users).find((u) => u.email.toLowerCase() === emailOrUserId.toLowerCase());
      }
      if (!user) return state;
      if (project.memberIds.includes(user.id)) return state;
      return {
        ...state,
        projects: {
          ...state.projects,
          [projectId]: { ...project, memberIds: [...project.memberIds, user.id] },
        },
      };
    }
    case "createTask": {
      const id = makeId();
      const now = Date.now();
      const task: Task = { id, createdAt: now, updatedAt: now, ...action.payload };
      return { ...state, tasks: { ...state.tasks, [id]: task } };
    }
    case "updateTask": {
      const t = state.tasks[action.payload.id];
      if (!t) return state;
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [t.id]: { ...t, ...action.payload.patch, updatedAt: Date.now() },
        },
      };
    }
    case "addComment": {
      const id = makeId();
      const c: Comment = { id, createdAt: Date.now(), ...action.payload };
      return { ...state, comments: { ...state.comments, [id]: c } };
    }
    case "addNotification": {
      const id = makeId();
      const n: Notification = { id, createdAt: Date.now(), read: action.payload.read ?? false, ...action.payload } as Notification;
      return { ...state, notifications: { ...state.notifications, [id]: n } };
    }
    case "deleteNotification": {
      const n = { ...state.notifications };
      delete n[action.payload.id];
      return { ...state, notifications: n };
    }
    case "clearNotificationsForUser": {
      const entries = Object.entries(state.notifications).filter(([, v]) => v.userId !== action.payload.userId);
      return { ...state, notifications: Object.fromEntries(entries) };
    }
    case "markNotification": {
      const n = state.notifications[action.payload.id];
      if (!n) return state;
      return {
        ...state,
        notifications: { ...state.notifications, [n.id]: { ...n, read: action.payload.read } },
      };
    }
    default:
      return state;
  }
}

const StoreContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
  selectors: ReturnType<typeof createSelectors>;
} | null>(null);

function createSelectors(getState: () => State) {
  return {
    currentUser: () => {
      const s = getState();
      return s.currentUserId ? s.users[s.currentUserId] ?? null : null;
    },
    userProjects: (userId: ID) => Object.values(getState().projects).filter((p) => p.memberIds.includes(userId)),
    projectById: (id: ID) => getState().projects[id] ?? null,
    projectMembers: (projectId: ID) => {
      const p = getState().projects[projectId];
      if (!p) return [] as User[];
      return p.memberIds.map((id) => getState().users[id]).filter(Boolean) as User[];
    },
    tasksByProject: (projectId: ID) => Object.values(getState().tasks).filter((t) => t.projectId === projectId),
    commentsFor: (projectId: ID, taskId: ID | null) =>
      Object.values(getState().comments)
        .filter((c) => c.projectId === projectId && c.taskId === taskId)
        .sort((a, b) => a.createdAt - b.createdAt),
    notificationsForUser: (userId: ID) =>
      Object.values(getState().notifications)
        .filter((n) => n.userId === userId)
        .sort((a, b) => b.createdAt - a.createdAt),
    unreadCount: (userId: ID, category?: "tasks" | "messages" | "team") =>
      Object.values(getState().notifications).filter((n) => n.userId === userId && !n.read && (!category || n.category === category)).length,
  };
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as State;
        dispatch({ type: "hydrate", payload: parsed });
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  }, [state]);

  const selectors = useMemo(() => createSelectors(() => state), [state]);
  const value = useMemo(() => ({ state, dispatch, selectors }), [state, selectors]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

export function useAuth() {
  const { selectors, dispatch } = useStore();
  const user = selectors.currentUser();
  const login = useCallback((email: string, password: string) => dispatch({ type: "login", payload: { email, password } }), [dispatch]);
  const register = useCallback(
    (name: string, email: string, password: string) => dispatch({ type: "register", payload: { name, email, password } }),
    [dispatch],
  );
  const logout = useCallback(() => dispatch({ type: "logout" }), [dispatch]);
  return { user, login, register, logout };
}

export function idToInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  const initials = (parts[0]?.[0] || "") + (parts[1]?.[0] || "");
  return initials.toUpperCase() || name.slice(0, 2).toUpperCase();
}
