import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAdminAuthStore = create((set) => ({
  isCreatingCohort: false,
  cohort: null,

  createCohort: async (data) => {
    set({ isCreatingCohort: true });
    try {
      const res = await axiosInstance.post("/cohort/create", data);
      console.log("checkauth response", res.data);
      set({ cohort: res.data.user });
      toast.success("Cohort Create successfully");
    } catch (error) {
      console.log("❌ Error checking auth:", error);
      set({ cohort: null });
    } finally {
      set({ isCreatingCohort: false });
    }
  },
}));
