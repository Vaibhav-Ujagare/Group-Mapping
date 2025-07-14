// File: src/components/StatsCard.jsx

import React from "react";

const StatsCard = ({ userCount, groupCount }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6">
      {/* User Count Card */}
      <div className="card bg-base-100 shadow-md border border-base-200">
        <div className="card-body text-center">
          <h2 className="text-xl font-bold">Total Users</h2>
          <p className="text-4xl font-semibold text-primary">{userCount}</p>
        </div>
      </div>

      {/* Group Count Card */}
      <div className="card bg-base-100 shadow-md border border-base-200">
        <div className="card-body text-center">
          <h2 className="text-xl font-bold">Total Groups</h2>
          <p className="text-4xl font-semibold text-secondary">{groupCount}</p>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
