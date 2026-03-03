import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, Discussion } from "@/lib/api";

interface SendMessageInput {
  projectId: string;
  content: string;
}

// Get discussions for a project
export const useDiscussions = (projectId: string) => {
  return useQuery({
    queryKey: ["discussions", projectId],
    queryFn: async () => {
      const { data } = await api.get(`/discussions/${projectId}`);
      return data.data as Discussion[];
    },
    enabled: !!projectId,
  });
};

// Send message
export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: SendMessageInput) => {
      const { data } = await api.post("/discussions", input);
      return data.data as Discussion;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["discussions", variables.projectId] });
    },
  });
};

// Delete message
export const useDeleteMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, projectId }: { id: string; projectId: string }) => {
      await api.delete(`/discussions/${id}`);
      return projectId;
    },
    onSuccess: (projectId) => {
      queryClient.invalidateQueries({ queryKey: ["discussions", projectId] });
    },
  });
};
