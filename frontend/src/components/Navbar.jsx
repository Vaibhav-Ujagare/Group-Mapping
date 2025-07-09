import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, Bell } from "lucide-react";
import LogoutButton from "./LogoutButton";
import { useAdminAuthStore } from "../store/useAdminAuthStore";

const Navbar = () => {
  const { authUser, userRole } = useAuthStore();
  const { adminLogin, adminRole } = useAdminAuthStore();

  const InitialAvatar = ({ firstName, lastName }) => {
    const initials = `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase();

    return (
      <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center place-content-center font-bold">
        {initials}
      </div>
    );
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
            <a>
              <Bell />
              Request
              <span className="badge badge-sm bg-amber-200 text-black">
                99+
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
                <Link to="/profile" className="">
                  Profile
                </Link>
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
      </div>
    );
  }
};

export default Navbar;
