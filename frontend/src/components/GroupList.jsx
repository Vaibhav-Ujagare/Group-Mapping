import React, { useEffect, useState } from "react";
import { useGroupStore } from "../store/useGroupStore";
import CreateGroup from "./CreateGroup";
import GroupModal from "./GroupModal";

const GroupList = ({ groups }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { createGroup } = useGroupStore();

  const [selectedGroup, setSelectedGroup] = useState(null);

  const handleViewGroup = (group) => {
    setSelectedGroup(group);
  };

  const handleCreateGroup = async (data) => {
    await createGroup(data);
  };

  return (
    <div className="space-y-5  min-w-full">
      <button
        className="btn btn-primary justify-end"
        onClick={() => setIsCreateModalOpen(true)}
      >
        Creat Group
      </button>
      <div className="min-h-screen bg-base-200 px-2 py-2">
        {/* Card */}
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">Group List</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group) => (
              <div
                key={group.id}
                className="card bg-base-100 shadow-md border border-base-200"
              >
                <div className="card-body">
                  <h3 className="card-title text-lg font-semibold">
                    {group.group_name}
                  </h3>
                  <p className="text-sm text-gray-600">{group.group_desc}</p>
                  <div className="text-sm mt-2">
                    <p>
                      <strong>Created By:</strong> {group.createdBy?.id}
                    </p>
                    <p>
                      <strong>Created At:</strong>{" "}
                      {new Date(group.createdAt).toLocaleString()}
                    </p>
                    <p>
                      <strong>Published:</strong>{" "}
                      <span
                        className={`badge ${
                          group.isPublished ? "badge-success" : "badge-warning"
                        }`}
                      >
                        {group.isPublished ? "Yes" : "No"}
                      </span>
                    </p>
                  </div>
                  <div className="card-actions mt-4 justify-end">
                    <button
                      onClick={() => handleViewGroup(group)}
                      className="btn btn-info btn-sm"
                    >
                      View Group
                    </button>
                    <button
                      onClick={() => handleJoinRequest(group.id)}
                      className="btn btn-success btn-sm"
                    >
                      Send Join Request
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Show Modal if selected */}
        <GroupModal
          group={selectedGroup}
          onClose={() => setSelectedGroup(null)}
        />
      </div>
      <CreateGroup
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateGroup}
      />
    </div>
  );
};

export default GroupList;
