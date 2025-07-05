import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut } from "lucide-react";
import LogoutButton from "./LogoutButton";
import { useAdminAuthStore } from "../store/useAdminAuthStore";

const Navbar = () => {
  const { authUser, userRole } = useAuthStore();
  const { adminLogin, adminRole } = useAdminAuthStore();

  if (authUser || adminLogin) {
    return (
      <div className="navbar bg-base-300 shadow-md">
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost normal-case text-xl">
            MyApp
          </Link>
        </div>

        <div className="flex-none space-x-2">
          <LogoutButton
            role={adminRole || userRole}
            className="hover:bg-primary hover:text-white"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </LogoutButton>
        </div>
      </div>
    );
  }

  return (
    <div className="navbar bg-base-300 shadow-md">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost normal-case text-xl">
          MyApp
        </Link>
      </div>
      <div className="flex-none space-x-2">
        <Link to="/login" className="btn btn-md btn-outline">
          LOGIN
        </Link>
        <Link to="/signup" className="btn btn-md btn-primary">
          SIGN UP
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
