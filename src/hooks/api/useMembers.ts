import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, Member } from "@/lib/api";

interface InviteMemberInput {
  projectId: string;
  email: string;
  role?: "manager" | "member";
}

interface UpdateRoleInput {
  role: "manager" | "member";
}

// Get all members
export const useMembers = (projectId?: string) => {
  return useQuery({
    queryKey: ["members", projectId],
    queryFn: async () => {
      const params = projectId ? { projectId } : {};
      const { data } = await api.get("/members", { params });
      return data.data as Member[];
    },
  });
};

// Invite member
export const useInviteMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: InviteMemberInput) => {
      const { data } = await api.post("/members/invite", input);
      return data.data as Member;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

// Update member role
export const useUpdateMemberRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, role }: { id: string; role: "manager" | "member" }) => {
      const { data } = await api.put(`/members/${id}/role`, { role });
      return data.data as Member;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
  });
};

// Remove member
export const useRemoveMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/members/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "stats"] });
    },
  });
};
