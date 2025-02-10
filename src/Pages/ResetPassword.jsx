import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { base_url } from "../config/config";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract UUID and expiry from URL parameters
  const searchParams = new URLSearchParams(location.search);
  const uuid = searchParams.get("uuid");
  const expiry = searchParams.get("expiry");

  const [formData, setFormData] = useState({
    new_password: "",
    confirm_password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.new_password !== formData.confirm_password) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post(`${base_url}/accounts/password_reset/confirm/`, {
        new_password: formData.new_password,
        uuid,
        expiry,
      });

      toast.success("Password reset successful!");
      navigate("/login"); // Redirect to login page
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error(error.response?.data?.message || "Failed to reset password.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <h2 className="text-2xl font-bold text-center mb-4">Set New Password</h2>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            New Password
          </label>
          <input
            type="password"
            name="new_password"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter new password"
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirm_password"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Confirm new password"
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex items-center justify-center">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Reset Password
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
