import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, User } from "@/lib/api";
import { useNavigate } from "react-router-dom";

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

// Login
export const useLogin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const { data } = await api.post("/auth/login", credentials);
      return data.data as AuthResponse;
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      queryClient.setQueryData(["user"], data.user);
      navigate("/dashboard");
    },
  });
};

// Register
export const useRegister = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: RegisterCredentials) => {
      const { data } = await api.post("/auth/register", credentials);
      return data.data as AuthResponse;
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      queryClient.setQueryData(["user"], data.user);
      navigate("/dashboard");
    },
  });
};

// Get current user
export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data } = await api.get("/auth/me");
      return data.data as User;
    },
    enabled: !!localStorage.getItem("token"),
  });
};

// Update profile
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: { name: string }) => {
      const { data } = await api.put("/auth/profile", updates);
      return data.data as User;
    },
    onSuccess: (data) => {
      localStorage.setItem("user", JSON.stringify(data));
      queryClient.setQueryData(["user"], data);
    },
  });
};

// Upload avatar
export const useUploadAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("avatar", file);
      const { data } = await api.post("/auth/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return data.data as User;
    },
    onSuccess: (data) => {
      localStorage.setItem("user", JSON.stringify(data));
      queryClient.setQueryData(["user"], data);
    },
  });
};

// Logout
export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    queryClient.clear();
    navigate("/signin");
  };
};

// Get stored user
export const getStoredUser = (): User | null => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// Check if authenticated
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem("token");
};
