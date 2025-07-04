import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAdminAuthStore = create((set) => ({
  adminUser: null,
  isLoggingIn: false,
  isUploadingCSV: false,
  isDataLoading: false,
  csvData: null,
  isCheckingAdmin: false,

  checkAdmin: async () => {
    set({ isCheckingAdmin: true });
    try {
      const res = await axiosInstance.get("/admin/check");
      console.log("checkauth response", res.data);

      set({ adminUser: res.data.user });
    } catch (error) {
      console.log("❌ Error checking auth:", error);
      set({ adminUser: null });
    } finally {
      set({ isCheckingAdmin: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/admin/login", data);

      set({ adminUser: res.data.user });

      toast.success(res.data.message);
    } catch (error) {
      console.log("Error logging in", error);
      toast.error("Error logging in");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  uploadCSV: async (file) => {
    set({ isUploadingCSV: true });

    const formData = new FormData();
    formData.append("cohort_data", file);

    try {
      const res = await axiosInstance.post("/admin/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(res.data.message || "CSV uploaded successfully");
    } catch (error) {
      console.error("❌ Error uploading cohort CSV:", error);
      toast.error(error?.response?.data?.message || "CSV upload failed");
    } finally {
      set({ isUploadingCSV: false });
    }
  },

  showCSVData: async () => {
    set({ isDataLoading: true });
    try {
      const res = await axiosInstance.get("/auth/student-data");
      console.log(res.data);
      set({ csvData: res.data });
      toast.success("CSV Data Load successfully");
    } catch (error) {
      console.log("Error while loading CSV data", error);
      toast.error("Error logging out");
      set({ csvData: null });
    } finally {
      set({ isDataLoading: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ adminUser: null });

      toast.success("Logout successful");
    } catch (error) {
      console.log("Error logging out", error);
      toast.error("Error logging out");
    }
  },
}));
