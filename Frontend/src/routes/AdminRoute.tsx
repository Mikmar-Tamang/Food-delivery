import { useEffect, useState } from "react";
import axios from "axios";
import { Outlet, Navigate } from "react-router-dom";

function AdminRoute() {
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get(
          import.meta.env.VITE_API_URL + "/api/auth/user/me",
          { withCredentials: true }
        );

        setAuth(true);
      } catch {
        setAuth(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return <p>Loading...</p>;

  if (!auth) return <Navigate to="/login" replace />;

  return <Outlet />;
}

export default AdminRoute;