import { useAdminAuthStore } from "../store/useAdminAuthStore";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";

const LogoutButton = ({ role, children }) => {
  const { logout } = useAuthStore();
  const { adminLogout } = useAdminAuthStore();
  const navigate = useNavigate();

  const onLogout = async () => {
    try {
      if (role === "STUDENT") {
        await logout();
        navigate("/login", { replace: true });
      } else {
        await adminLogout();
        navigate("/login", { replace: true });
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <button className="btn btn-primary" onClick={onLogout}>
      {children}
    </button>
  );
};

export default LogoutButton;
