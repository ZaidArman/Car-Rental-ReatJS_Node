import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext, useAuth } from "../context/auth/auth.provider";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [redirectPath, setRedirectPath] = useState(null); // Store redirect path
  const { login, setRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/Home");
    }
  }, [navigate]);

  // 🔹 Use useEffect to trigger navigation when redirectPath changes
  useEffect(() => {
    if (redirectPath) {
      navigate(redirectPath);
    }
  }, [redirectPath, navigate]);

  const handleLogin = async () => {
    const data = {
      email: email,
      password: password,
    };

    const onSuccess = (data) => {
      toast.success("Login successful! 🎉 Redirecting...", { position: "top-right" });

      if (data?.role === "Rental") {
        setRole("rental");
        localStorage.setItem("role", "rental");
        setRedirectPath("/Rental");
      } else if (data?.role === "Customer") {
        setRole("customer");
        localStorage.setItem("role", "customer");
        setRedirectPath("/Customer");
      }
    };

    const onFailure = (err) => {
      toast.error(err?.response?.data?.message || "Login failed! Please check your credentials.", { position: "top-right" });
      setError(err?.response?.data?.message || "An error occurred.");
    };

    await login(data, onSuccess, onFailure);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="bg-gray-300 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <p className="mb-6 text-center">
          Please enter your details below to continue
        </p>
        <input
          type="email"
          placeholder="Enter Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border rounded-lg"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 border rounded-lg"
        />
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          onClick={handleLogin}
          className="w-full p-3 mb-4 font-bold text-white bg-gray-400 hover:bg-gray-500 rounded-lg"
        >
          Login
        </button>
        <div className="text-center text-gray-600">
          <span>Don't have an account? </span>
          <Link to="/signup" className="text-black">
            Sign up
          </Link>
        </div>
        <div className="text-center text-gray-600">
          <Link to="/password/forget" className="text-black">
            Forgot password?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
