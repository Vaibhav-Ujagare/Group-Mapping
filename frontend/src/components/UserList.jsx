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
        <div className="collapse bg-base-100 border border-base-300 mt-4 rounded-lg max-h-[80vh] overflow-auto">
          <input type="checkbox" className="peer" defaultChecked />
          <div className="collapse-title font-semibold peer-checked:bg-base-200 flex justify-between items-center">
            <h1>Cohort CSV DATA</h1>
            <h1>Cohort CSV DATA</h1>
          </div>

          {/* Scrollable Section */}
          <div className="collapse-content mt-5 overflow-auto max-h-[80vh] pr-2 space-y-2.5">
            <label className="input">
              <svg
                className="h-[1em] opacity-50"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                  fill="none"
                  stroke="currentColor"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.3-4.3"></path>
                </g>
              </svg>
              <input type="search" className="grow" placeholder="Search" />
              <kbd className="kbd kbd-sm">⌘</kbd>
              <kbd className="kbd kbd-sm">K</kbd>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-auto">
              {csvData.map((row, index) => (
                <div
                  key={row.id}
                  className="card border border-base-300 bg-base-100 shadow-md p-4 rounded-lg"
                >
                  <div className="mb-2">
                    <h3 className="font-bold text-lg">{row.email}</h3>
                    <p className="text-sm text-gray-500">
                      Cohort: {row.cohort_name}
                    </p>
                  </div>
                  <ul className="text-sm mb-4 space-y-1">
                    <li>
                      <strong>Role:</strong> {row.role}
                    </li>
                    <li>
                      <strong>Can Create Group:</strong>{" "}
                      {row.canCreateGroup ? "Yes" : "No"}
                    </li>
                    <li>
                      <strong>Is Group Joined:</strong>{" "}
                      {row.isGroupJoined ? "Yes" : "No"}
                    </li>
                  </ul>
                  <div className="flex gap-2">
                    <button className="btn btn-outline btn-primary btn-sm">
                      View Profile
                    </button>
                    <button className="btn btn-primary btn-sm">
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
          <div className="card bg-base-300 rounded-box grid h-20 place-items-center">
            NO DATA TO SHOW
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
