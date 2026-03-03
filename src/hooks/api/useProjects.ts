import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, Project } from "@/lib/api";

interface CreateProjectInput {
  name: string;
  description?: string;
  priority?: "low" | "medium" | "high";
  dueDate?: string;
}

interface UpdateProjectInput {
  name?: string;
  description?: string;
  priority?: "low" | "medium" | "high";
  status?: "active" | "completed" | "archived";
  dueDate?: string | null;
}

// Get all projects
export const useProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data } = await api.get("/projects");
      return data.data as Project[];
    },
  });
};

// Get project by ID
export const useProject = (id: string) => {
  return useQuery({
    queryKey: ["projects", id],
    queryFn: async () => {
      const { data } = await api.get(`/projects/${id}`);
      return data.data as Project;
    },
    enabled: !!id,
  });
};

// Create project
export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateProjectInput) => {
      const { data } = await api.post("/projects", input);
      return data.data as Project;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "stats"] });
    },
  });
};

// Update project
export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: UpdateProjectInput }) => {
      const { data } = await api.put(`/projects/${id}`, updates);
      return data.data as Project;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["projects", variables.id] });
    },
  });
};

// Delete project
export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/projects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "stats"] });
    },
  });
};
