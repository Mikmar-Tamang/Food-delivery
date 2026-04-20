import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  useEffect(() => {
    const token: string | null = params.get("token");

    const verifyEmail = async (): Promise<void> => {
      try {
        if (!token) {
          console.log("No token found");
          return;
        }

        await axios.get(
          `${import.meta.env.VITE_API_URL}/api/auth/user/verify-email?token=${token}`
        );

        navigate("/");
      } catch (error) {
        console.log("Verification failed", error);
      }
    };

    verifyEmail();
  }, [navigate, params]);

  return (
    <div className="flex items-center justify-center h-screen">
      <h2 className="text-xl font-semibold">
        Verifying your email...
      </h2>
    </div>
  );
};

export default VerifyEmail;