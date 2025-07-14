import { useState } from "react";
import { useGroupStore } from "../store/useGroupStore";
import CreateGroup from "./CreateGroup";
import GroupModal from "./GroupModal";
import JoinRequestModal from "../components/JoinRequestModal";
import { useAuthStore } from "../store/useAuthStore";

const GroupList = ({ groups }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { createGroup } = useGroupStore();

  const { sendJoiningRequest } = useAuthStore();

  const [selectedGroup, setSelectedGroup] = useState(null);

  const [selectedGroupForJoin, setSelectedGroupForJoin] = useState(null);

  const handleViewGroup = (group) => {
    console.log(group);
    setSelectedGroup(group);
  };

  const handleCreateGroup = async (data) => {
    await createGroup(data);
  };

  const handleOpenJoinModal = (group) => {
    console.log(group);
    setSelectedGroupForJoin(group);
  };

  const handleCloseJoinModal = () => {
    setSelectedGroupForJoin(null);
  };

  const handleSendJoinRequest = async (groupId, reason) => {
    // Replace with API call
    await sendJoiningRequest(groupId, reason);
  };

  return (
    <div className="space-y-5  min-w-full h-[80vh]">
      <button
        className="btn btn-primary justify-end"
        onClick={() => setIsCreateModalOpen(true)}
      >
        Creat Group
      </button>
      <div className="h-[80vh] bg-base-200 px-2 py-2 overflow-auto">
        {/* Card */}
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">Group List</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group) => (
              <div
                key={group.id}
                className="card bg-base-100 shadow-md border border-base-200 "
              >
                <div className="card-body ">
                  <h3 className="card-title text-lg font-semibold">
                    {group.group_name}
                  </h3>
                  <p className="text-sm text-gray-600">{group.group_desc}</p>
                  <div className="text-sm mt-2 space-y-2">
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
                      onClick={() => handleOpenJoinModal(group)}
                      className="btn btn-success btn-sm"
                    >
                      Send Join Request
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <JoinRequestModal
            group={selectedGroupForJoin}
            onClose={handleCloseJoinModal}
            onSend={handleSendJoinRequest}
          />
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
