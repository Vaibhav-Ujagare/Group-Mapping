// File: src/components/JoinRequestModal.jsx

import React, { useState } from "react";

const JoinRequestModal = ({ group, onClose, onSend }) => {
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    onSend(group.id, reason); // Call parent handler
    setReason("");
    onClose(); // Close modal
  };

  if (!group) return null;

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-w-md">
        <h3 className="font-bold text-lg">Join Group: {group.group_name}</h3>
        <p className="mt-2">Why do you want to join this group?</p>
        <textarea
          className="textarea textarea-bordered w-full mt-4"
          placeholder="Enter your reason here..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        ></textarea>
        <div className="modal-action">
          <button className="btn btn-primary" onClick={handleSubmit}>
            Send
          </button>
          <button className="btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default JoinRequestModal;
