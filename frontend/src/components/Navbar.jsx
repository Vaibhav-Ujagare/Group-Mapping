import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, Bell } from "lucide-react";
import LogoutButton from "./LogoutButton";
import { useAdminAuthStore } from "../store/useAdminAuthStore";
import { useEffect, useState } from "react";

const Navbar = () => {
  const {
    authUser,
    userRole,
    getAllJoiningRequests,
    joiningRequests,
    isFetchingRequests,
    handleJoiningRequest,
  } = useAuthStore();
  const { adminLogin, adminRole } = useAdminAuthStore();
  const [showRequestModal, setShowRequestModal] = useState(false);

  const InitialAvatar = ({ firstName, lastName }) => {
    const initials = `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase();

    return (
      <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center place-content-center font-bold">
        {initials}
      </div>
    );
  };

  useEffect(() => {
    getAllJoiningRequests();
  }, [getAllJoiningRequests]);

  const handleRequest = async () => {
    await getAllJoiningRequests(); // fetch all requests
    setShowRequestModal(true); // or open a modal/panel
  };

  if (isFetchingRequests) {
    return <div className="p-4">Loading join requests...</div>;
  }

  const groupRequests = joiningRequests?.data?.groupRequests || [];

  const handleAccept = async (requestId, groupId, action) => {
    try {
      // Call your API or update logic
      console.log("Accepted request:", requestId);
      console.log(groupId);
      console.log(action);
      // Optionally refetch the list or update state

      await handleJoiningRequest(requestId, groupId, action);
    } catch (err) {
      console.error("Error accepting request", err);
    }
  };

  const handleReject = async (requestId, groupId, action) => {
    try {
      // Call your API or update logic
      console.log("Rejected request:", requestId);
      console.log(groupId);
      console.log(action);
      // Optionally refetch the list or update state
      await handleJoiningRequest(requestId, groupId, action);
    } catch (err) {
      console.error("Error rejecting request", err);
    }
  };

  if (authUser || adminLogin) {
    return (
      <div className="navbar bg-base-300 shadow-md space-x-2">
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost normal-case text-xl">
            FindYourGroup
          </Link>
        </div>

        <ul className="menu bg-base-200 lg:menu-horizontal rounded-box">
          <li>
            <a onClick={handleRequest}>
              <Bell />
              Request
              <span className="badge badge-sm bg-amber-200 text-black">
                {groupRequests.length || 0}
              </span>
            </a>
          </li>
        </ul>

        <div className="flex-none space-x-2">
          {/* Profile Dropdown */}
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar "
            >
              <InitialAvatar firstName="John" lastName="Doe" />
            </div>
            <ul
              tabIndex={0}
              className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-200 rounded-box w-52 space-y-2"
            >
              <li>
                {userRole == "STUDENT" ? (
                  <Link to="/profile" className="">
                    Profile
                  </Link>
                ) : (
                  <Link to="/admin/profile" className="">
                    Profile
                  </Link>
                )}
              </li>
              <li>
                <a>Settings</a>
              </li>
              <li>
                <LogoutButton
                  role={adminRole || userRole}
                  className="hover:bg-primary hover:text-white"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </LogoutButton>
              </li>
            </ul>
          </div>
        </div>

        {showRequestModal && (
          <dialog className="modal modal-open">
            <div className="modal-box max-w-2xl">
              <h3 className="font-bold text-lg mb-4">Join Requests</h3>

              {joiningRequests?.data?.groupRequests?.length > 0 ? (
                <div className="grid gap-4">
                  {joiningRequests.data.groupRequests.map((req) => (
                    <div
                      key={req.id}
                      className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md border"
                    >
                      <p className="mb-1">
                        <strong>User:</strong> {req.studentId}
                      </p>
                      <p className="mb-1">
                        <strong>Group:</strong> {req.groupId}
                      </p>
                      <p className="mb-1">
                        <strong>Reason:</strong> {req.request_note_by_student}
                      </p>
                      <p className="mb-3">
                        <strong>Status:</strong>{" "}
                        <span
                          className={`font-semibold ${
                            req.status === "REQUESTED"
                              ? "text-yellow-500"
                              : req.status === "accepted"
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {req.status}
                        </span>
                      </p>

                      <div className="flex gap-3">
                        <button
                          onClick={() =>
                            handleAccept(req.id, req.groupId, "ACCEPTED")
                          }
                          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                        >
                          Accept Request
                        </button>
                        <button
                          onClick={() =>
                            handleReject(req.id, req.groupId, "REJECTED")
                          }
                          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                        >
                          Reject Request
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No requests found.</p>
              )}

              <div className="modal-action">
                <button
                  className="btn"
                  onClick={() => setShowRequestModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </dialog>
        )}
      </div>
    );
  }
};

export default Navbar;
