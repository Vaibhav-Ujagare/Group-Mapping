import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isRequesting: false,
  isFetchingRequests: false,
  isFetchingProfile: false,
  isSigninUp: false,
  isLoggingIn: false,
  isCheckingAuth: false,
  userRole: null,
  userProfile: [],
  joiningRequests: [],

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axiosInstance.get("/user/check");

      set({ authUser: res.data.user, userRole: "STUDENT" });
    } catch (error) {
      console.log("❌ Error checking auth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/user/login", data);

      set({ authUser: res.data.user, userRole: "STUDENT" });

      toast.success(res.data.message);
    } catch (error) {
      console.log("Error logging in", error);
      toast.error("Error logging in");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/user/logout");
      set({ authUser: null });

      toast.success("Logout successful");
    } catch (error) {
      console.log("Error logging out", error);
      toast.error("Error logging out");
    }
  },

  selectCohort: async (data) => {
    try {
      await axiosInstance.post("/user/select-cohort", data);
      toast.success("Cohort select successfully");
    } catch (error) {
      console.log("Error logging out", error);
      toast.error("Error logging out");
    }
  },

  sendJoiningRequest: async (groupId, data) => {
    set({ isRequesting: true });
    try {
      await axiosInstance.post(`/user/request/${groupId}`, data);
      toast.success("Joining request sent successfully");
    } catch (error) {
      console.error("❌ Error sending join request:", error);
      toast.error("Failed to send join request");
    } finally {
      set({ isRequesting: false });
    }
  },

  getAllJoiningRequests: async () => {
    set({ isFetchingRequests: true });
    try {
      await axiosInstance.get(`/user/getAllRequests`);
      toast.success("All Requests Fetched Successfully");
    } catch (error) {
      console.error("❌ Error sending join request:", error);
      toast.error("Failed to Fetch join request");
    } finally {
      set({ isFetchingRequests: false });
    }
  },

  getUserProfile: async () => {
    set({ isFetchingProfile: true });
    try {
      const res = await axiosInstance.get(`/user/profile`);

      // Check if user exists
      if (res.data?.data?.user) {
        set({ userProfile: res.data.data.user });
        toast.success("Profile fetched successfully");
      } else {
        toast.error("User profile not found");
        set({ userProfile: null });
      }
    } catch (error) {
      console.error("❌ Error fetching user profile:", error);
      toast.error("Failed to fetch user profile");
      set({ userProfile: null });
    } finally {
      set({ isFetchingProfile: false });
    }
  },
}));
