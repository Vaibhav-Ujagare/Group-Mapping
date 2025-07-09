import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useGroupStore = create((set) => ({
  allGroups: [],
  allGroupMembers: [],
  groupProfile: null,
  groupHistory: [],
  removeMember: null,
  leavingMember: null,
  isMemberLeaving: false,
  isGroupCreating: false,
  isGroupDeleting: false,
  isFetchingGroups: false,
  isFetchingMembers: false,
  isRemovingMember: false,
  group: [],

  groupList: async () => {
    set({ isFetchingGroups: true });
    try {
      const res = await axiosInstance.get("/group/all-groups");
      toast.success(res.data.message);
      set({ allGroups: res.data.data });
    } catch (error) {
      console.log("❌ Error while getting group list:", error);
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
      console.log("❌ Error while creating a group:", error);
      set({ group: [] });
    } finally {
      set({ isGroupCreating: false });
    }
  },

  getAllGroupMembers: async (groupId) => {
    set({ isFetchingGroups: true });
    try {
      const res = await axiosInstance.get(`/group/${groupId}/group-members`);
      console.log(res.data);
      set({ allGroupMembers: res.data });
    } catch (error) {
      console.log("❌ Error While fetching group members:", error);
      set({ allGroupMembers: [] });
    } finally {
      set({ isFetchingMembers: false });
    }
  },

  getGroupProfile: async (groupId) => {
    set({ isFetchingGroups: true });
    try {
      const res = await axiosInstance.get(`/group/${groupId}`);
      console.log(res.data);
      set({ groupProfile: res.data });
    } catch (error) {
      console.log("❌ Error While fetching group profile:", error);
      set({ groupProfile: null });
    } finally {
      set({ isFetchingMembers: false });
    }
  },

  getGroupHistory: async (groupId) => {
    set({ isFetchingGroups: true });
    try {
      const res = await axiosInstance.get(`/group/${groupId}/group-history`);
      console.log(res.data);
      set({ groupHistory: res.data });
    } catch (error) {
      console.log("❌ Error While fetching group History:", error);
      set({ groupHistory: [] });
    } finally {
      set({ isFetchingMembers: false });
    }
  },

  removeGroupMember: async (data) => {
    set({ isRemovingMember: true });
    try {
      const res = await axiosInstance.post(`/group/remove-member`, data);
      console.log(res.data);
      set({ removeMember: res.data });
    } catch (error) {
      console.log("❌ Error While Rmoving Group Member:", error);
      set({ removeMember: null });
    } finally {
      set({ isRemovingMember: false });
    }
  },

  leavingGroupMember: async (data) => {
    set({ isMemberLeaving: true });
    try {
      const res = await axiosInstance.post(`/group/leave`, data);
      console.log(res.data);
      set({ leavingMember: res.data });
    } catch (error) {
      console.log("❌ Error While Leaving Group Member:", error);
      set({ leavingMember: null });
    } finally {
      set({ isMemberLeaving: false });
    }
  },

  deletGroup: async (data) => {
    set({ isGroupDeleting: true });
    try {
      const res = await axiosInstance.post(`/group/delete-group`, data);
      console.log(res.data);
      set({ group: res.data });
    } catch (error) {
      console.log("❌ Error While Leaving Group Member:", error);
      set({ group: [] });
    } finally {
      set({ isGroupDeleting: false });
    }
  },
}));
