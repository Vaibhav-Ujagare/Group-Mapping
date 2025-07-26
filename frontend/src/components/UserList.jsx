import { useEffect } from "react";
import { useAdminAuthStore } from "../store/useAdminAuthStore";

const UserList = () => {
  const { csvData, showCSVData } = useAdminAuthStore();

  useEffect(() => {
    showCSVData();
  }, [showCSVData]);

  return (
    <div>
      {csvData.length > 0 ? (
        <div className="collapse bg-white dark:bg-base-100 border border-base-300 mt-4 rounded-xl shadow-md overflow-hidden">
          <input type="checkbox" className="peer" defaultChecked />
          <div className="collapse-title font-semibold peer-checked:bg-gray-100 dark:peer-checked:bg-base-200 flex justify-between items-center px-4 py-3 text-lg">
            <h1 className="text-gray-800 dark:text-gray-100">
              📊 Cohort CSV Data
            </h1>
          </div>

          {/* Scrollable Content */}
          <div className="collapse-content mt-4 px-4 pb-6 overflow-auto space-y-4 ">
            {/* Search Bar */}
            <div className="w-full ">
              <label className="input input-bordered flex items-center gap-2 max-w-md mx-auto">
                <svg
                  className="w-5 h-5 opacity-60"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
                  />
                </svg>
                <input
                  type="search"
                  className="grow"
                  placeholder="Search users..."
                />
                <kbd className="kbd kbd-sm">⌘</kbd>
                <kbd className="kbd kbd-sm">K</kbd>
              </label>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {csvData.map((row, index) => (
                <div
                  key={row.id}
                  className="card border border-base-300 bg-base-100 dark:bg-gray-900 hover:shadow-lg transition duration-300 p-5 rounded-xl"
                >
                  <div className="mb-2">
                    <h3 className="font-semibold text-lg text-primary break-words">
                      {row.email}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Cohort:{" "}
                      <span className="font-medium">{row.cohort_name}</span>
                    </p>
                  </div>

                  <ul className="text-sm text-gray-700 dark:text-gray-300 mb-4 space-y-1">
                    <li>
                      <strong>Role:</strong> {row.role}
                    </li>
                    <li>
                      <strong>Can Create Group:</strong>{" "}
                      <span className="font-medium">
                        {row.canCreateGroup ? "Yes" : "No"}
                      </span>
                    </li>
                    <li>
                      <strong>Is Group Joined:</strong>{" "}
                      <span className="font-medium">
                        {row.isGroupJoined ? "Yes" : "No"}
                      </span>
                    </li>
                  </ul>

                  <div className="flex flex-wrap gap-2 mt-auto">
                    <button className="btn btn-outline btn-primary btn-sm w-full sm:w-auto">
                      View Profile
                    </button>
                    <button className="btn btn-primary btn-sm w-full sm:w-auto">
                      Send Request
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex w-full flex-col mt-5">
          <div className="card bg-base-200 text-gray-600 dark:text-gray-300 rounded-box grid h-20 place-items-center">
            NO DATA TO SHOW
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
