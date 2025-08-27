// src/components/ProtectedRoute.jsx
import { Navigate,useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();  // get the current route 

  if (loading) return <p>Loading...</p>; // wait until check-auth finishes

  if (!user) {
     // Redirect to login and remember the current page
    return <Navigate to="/login" replace state={{from: location}}/>;
  }

  return children;
}
