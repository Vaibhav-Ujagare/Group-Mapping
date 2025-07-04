import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useGroupStore = create((set) => ({
  allGroups: [],
  isGroupCreating: false,
  isFetchingGroups: false,
  group: [],

  groupList: async () => {
    set({ isFetchingGroups: true });
    try {
      const res = await axiosInstance.get("/group/all-groups");
      console.log(" response", res.data);
      toast.success(res.data.message);
      set({ allGroups: res.data.data });
    } catch (error) {
      console.log("❌ Error checking auth:", error);
      set({ allGroups: [] });
    } finally {
      set({ isFetchingGroups: false });
    }
  },

  createGroup: async (data) => {
    set({ isGroupCreating: true });
    console.log(data);
    try {
      const res = await axiosInstance.post("/group/create", data);
      console.log("response", res.data);
      toast.success(res.data.message);
      set({ group: res.data });
    } catch (error) {
      console.log("❌ Error checking auth:", error);
      set({ group: null });
    } finally {
      set({ isGroupCreating: false });
    }
  },
}));
