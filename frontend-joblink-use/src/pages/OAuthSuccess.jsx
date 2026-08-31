import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api/axios";

const OAuthSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const completeOAuthLogin = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const accessToken = params.get("accessToken");

        if (!accessToken) {
          navigate("/login", {
            replace: true,
            state: {
              error: "OAuth login failed. Access token not found.",
            },
          });
          return;
        }

        // Store access token
        localStorage.setItem("accessToken", accessToken);

        // Get authenticated user
        const response = await API.get("/auth/get-me", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const user = response.data.user;

        // Store user
        localStorage.setItem("user", JSON.stringify(user));

        // Redirect according to role
        if (user.role === "admin") {
          navigate("/admin", { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }
      } catch (error) {
        console.error("OAuth login failed:", error);

        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");

        navigate("/login", {
          replace: true,
          state: {
            error:
              error.response?.data?.message ||
              "OAuth login failed. Please try again.",
          },
        });
      }
    };

    completeOAuthLogin();
  }, [location, navigate]);

  return (
    <div className="min-h-screen bg-[#030712] text-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />

        <h2 className="text-lg font-bold">
          Completing sign in...
        </h2>

        <p className="text-sm text-slate-400 mt-2">
          Please wait while we sign you in.
        </p>
      </div>
    </div>
  );
};

export default OAuthSuccess;