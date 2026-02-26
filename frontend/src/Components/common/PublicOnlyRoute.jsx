import { Navigate } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";
import LoadingScreen from "./Loader";

export default function PublicOnlyRoute({ children }) {
  const { isAuthenticated, loading } = useAuthStore();

  if (loading) {
    return <LoadingScreen title="Loading..." subtitle="Please wait a moment" />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
