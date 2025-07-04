// File: src/components/GroupModal.jsx

import React from "react";

const GroupModal = ({ group, onClose }) => {
  if (!group) return null;

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-w-xl">
        <h3 className="font-bold text-xl mb-2">{group.group_name}</h3>
        <p className="mb-2 text-gray-700">{group.group_desc}</p>

        <p className="font-semibold mt-4">Group Members:</p>
        <ul className="list-disc list-inside">
          {group.members && group.members.length > 0 ? (
            group.members.map((member) => (
              <li key={member.id}>{member.name || member.id}</li>
            ))
          ) : (
            <li>No members in this group</li>
          )}
        </ul>

        <div className="modal-action">
          <button className="btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default GroupModal;
