import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/api";

// Fetch user profile
export const useUserProfile = (enabled = true) => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await api.get("/profile");
      return response.data;
    },
    enabled,
  });
};

// Fetch scan history
export const useScanHistory = (enabled = true) => {
  return useQuery({
    queryKey: ["history"],
    queryFn: async () => {
      const response = await api.get("/history");
      return response.data;
    },
    enabled,
  });
};

// Delete a scan from history
export const useDeleteScan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const response = await api.delete(`/history/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["history"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] }); // Profile also shows scan counts
    },
  });
};

// Analyze plant image mutation
export const useAnalyzePlant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData) => {
      const response = await api.post("/analyze", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["history"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};

// Download PDF Report mutation
export const useDownloadPDF = () => {
  return useMutation({
    mutationFn: async ({ result, image }) => {
      const response = await api.post(
        "/download",
        { result, image },
        { responseType: "blob" }
      );
      return response.data;
    },
  });
};
