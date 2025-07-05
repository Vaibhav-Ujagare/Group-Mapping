import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAdminAuthStore = create((set) => ({
  adminUser: null,
  isAdminLoggingIn: false,
  isUploadingCSV: false,
  isDataLoading: false,
  isCSVUploadSuccessfully: false,
  csvData: [],
  isCheckingAdmin: false,
  adminRole: null,

  checkAdmin: async () => {
    set({ isCheckingAdmin: true });
    try {
      const res = await axiosInstance.get("/admin/check");
      console.log("checkauth response", res.data);
      set({ adminUser: res.data.user, adminRole: "ADMIN" });
    } catch (error) {
      console.log("❌ Error checking auth:", error);
      set({ adminUser: null });
    } finally {
      set({ isCheckingAdmin: false });
    }
  },

  adminLogin: async (data) => {
    console.log(data);
    set({ isAdminLoggingIn: true });
    try {
      const res = await axiosInstance.post("/admin/login", data);

      set({ adminUser: res.data.user, adminRole: "ADMIN" });

      toast.success(res.data.message);
    } catch (error) {
      console.log("Error logging in", error);
      toast.error("Error logging in");
    } finally {
      set({ isAdminLoggingIn: false });
    }
  },

  uploadCSV: async (file) => {
    set({ isUploadingCSV: true, isCSVUploadSuccessfully: false });

    const formData = new FormData();
    formData.append("cohort_data", file);

    try {
      const res = await axiosInstance.post("/admin/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(res.data.message || "CSV uploaded successfully");
      set({ isCSVUploadSuccessfully: true });
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
      const res = await axiosInstance.get("/admin/student-data");
      console.log(res.data);
      set({ csvData: res.data.data });
      toast.success("CSV Data Load successfully");
    } catch (error) {
      console.log("Error while loading CSV data", error);
      toast.error("Error logging out");
      set({ csvData: [] });
    } finally {
      set({ isDataLoading: false });
    }
  },

  adminLogout: async () => {
    try {
      await axiosInstance.post("/admin/logout");
      set({ adminUser: null });
      toast.success("Logout successful");
    } catch (error) {
      console.log("Error logging out", error);
      toast.error("Error logging out");
    }
  },
}));
