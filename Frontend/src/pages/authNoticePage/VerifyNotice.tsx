import axios from "axios";
import { useState } from "react";

const VerifyNotice = () => {

  const [loading, setLoading] = useState(false);
    
  const handleResend = async () => {
  try {
    setLoading(true);

    await axios.post(
      import.meta.env.VITE_API_URL + "/api/auth/user/resend-verification",
      { email: localStorage.getItem("email") },
      { withCredentials: true }
    );

    alert("Email sent successfully");
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center">

        <h2 className="text-2xl font-bold mb-2">
          📧 Check your Email
        </h2>

        <p className="text-gray-600">
          Verify your account to continue
        </p>
        <p className="text-sm text-gray-500 mt-4">
          If you haven't received the email, please check your spam folder or
          <br />
          <button onClick={handleResend} disabled={loading}>
         {loading ? "Sending..." : "Resend Verification Email"}
          </button>
        </p>

      </div>
    </div>
  );
};

export default VerifyNotice;