import { useEffect } from "react";
import { useGroupStore } from "../store/useGroupStore";

const GroupModal = ({ group, onClose }) => {
  if (!group) return null;
  const { getAllGroupMembers, allGroupMembers } = useGroupStore();

  useEffect(() => {
    getAllGroupMembers(group.id);
  }, [getAllGroupMembers]);

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-w-xl">
        {/* Group Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-[40%_60%] border border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden shadow-sm">
          <div className="bg-gray-100 dark:bg-gray-800 px-5 py-4 font-semibold text-lg md:text-xl border-b md:border-b-0 md:border-r border-gray-300 dark:border-gray-600">
            Group Name
          </div>
          <div className="px-5 py-4 text-base md:text-lg bg-white dark:bg-gray-900 border-b md:border-b-0 border-gray-300 dark:border-gray-600">
            {group.group_name}
          </div>

          <div className="bg-gray-100 dark:bg-gray-800 px-5 py-4 font-semibold text-lg md:text-xl md:border-r border-gray-300 dark:border-gray-600">
            Description
          </div>
          <div className="px-5 py-4 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900">
            {group.group_desc}
          </div>
        </div>

        {/* Group Members Table */}
        <h3 className="font-semibold text-lg md:text-xl mt-6 mb-3">
          Group Members
        </h3>

        {allGroupMembers?.groupMembers?.length > 0 ? (
          <div className="overflow-x-auto rounded-xl shadow-sm border border-gray-300 dark:border-gray-600">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Member Name / ID
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Joining Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {allGroupMembers.groupMembers.map((member, index) => (
                  <tr
                    key={member.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <td className="px-6 py-3 text-sm">{index + 1}</td>
                    <td className="px-6 py-3 text-sm">
                      {member.name || member.id}
                    </td>
                    <td className="px-6 py-3 text-sm">{member.joining_date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">
            No members in this group
          </p>
        )}

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
