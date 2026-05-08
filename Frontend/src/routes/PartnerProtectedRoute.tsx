// frontend/src/routes/PartnerProtectedRoute.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Outlet, Navigate } from "react-router-dom";

interface PartnerProfileResponse {
  success: boolean;
  foodPartner: {
    _id: string;
    name: string;
    email: string;
  };
}

function PartnerProtectedRoute() {
  const [loading, setLoading] = useState<boolean>(true);
  const [auth, setAuth] = useState<boolean>(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get<PartnerProfileResponse>(
          `${import.meta.env.VITE_API_URL}/api/food-partner/profile`,
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!auth) return <Navigate to="/food-partner-login" replace />;
  
  return <Outlet />;
}

export default PartnerProtectedRoute;