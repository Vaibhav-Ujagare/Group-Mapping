import LoginPage from "./page/LoginPage";
import { Route, Navigate, Routes } from "react-router-dom";
import HomePage from "./page/HomePage";
import Footer from "./components/Footer";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import Layout from "./Layout/Layout";
import { Toaster } from "react-hot-toast";
import { useAdminAuthStore } from "./store/useAdminAuthStore";
import AdminHomePage from "./page/AdminHomePage";
import ProfilePage from "./page/ProfilePage";

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { checkAdmin, adminUser, isCheckingAdmin, adminLogin } =
    useAdminAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    checkAdmin();
  }, [checkAdmin]);

  if ((isCheckingAuth && !authUser) || (isCheckingAdmin && !adminLogin)) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={authUser ? <HomePage /> : <Navigate to={"/login"} />}
          />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        <Route path="/admin" element={<Layout />}>
          <Route
            index
            element={adminUser ? <AdminHomePage /> : <Navigate to={"/login"} />}
          />
        </Route>

        <Route
          path="/login"
          element={
            !authUser || !adminUser ? (
              <LoginPage />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
