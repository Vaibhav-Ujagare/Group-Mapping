// File: src/components/StatsCard.jsx

import React, { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useGroupStore } from "../store/useGroupStore";

const StatsCard = () => {
  const { getUserProfile, userProfile, userRole, allUsers, getAllUsers } =
    useAuthStore();
  const { allGroups, groupList } = useGroupStore();

  useEffect(() => {
    getAllUsers();
  }, []);

  useEffect(() => {
    groupList();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6">
      {/* User Count Card */}
      <div className="card bg-base-100 shadow-md border border-base-200">
        <div className="card-body text-center">
          <h2 className="text-xl font-bold">Total Users</h2>
          <p className="text-4xl font-semibold text-primary">
            {allUsers.length}
          </p>
        </div>
      </div>

      {/* Group Count Card */}
      <div className="card bg-base-100 shadow-md border border-base-200">
        <div className="card-body text-center">
          <h2 className="text-xl font-bold">Total Groups</h2>
          <p className="text-4xl font-semibold text-secondary">
            {allGroups.length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
