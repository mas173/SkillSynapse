import { Navigate } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";
import LoadingScreen from "./Loader";
import Navbar from "../layouts/Navbar";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuthStore();

  if (loading) {
    return (
      <LoadingScreen
        title="Checking session..."
        subtitle="Please wait while we verify your account"
      />
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Navbar />
      <div className="pt-16">{children}</div>
    </>
  );
}
