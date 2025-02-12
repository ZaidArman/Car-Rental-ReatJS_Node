import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import { base_url } from "../config/config";
import { useAuth } from "../context/auth/auth.provider";
import { toast } from "react-toastify";

const Profile = () => {
  const { user, setUser, getProfile } = useAuth();

  const [formData, setFormData] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    phone_number: user?.phone_number || "",
    email: user?.email || "", // Display email but prevent editing
    address: user?.address || "",
  });

  // Fetch user data on component mount (if user data is missing)
  useEffect(() => {
    if (!user) {
      getProfile();
    }
  }, []);

  // Sync formData with user data when user state changes
  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        phone_number: user.phone_number || "",
        email: user.email || "",
        address: user.address || "",
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${base_url}/accounts/users/profile/`,
        {
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone_number: formData.phone_number,
          address: formData.address, // Allow address update
        },
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("Profile Updated:", res.data);
      setUser(res.data); // Update global user state
      toast.success("Profile updatede successfully! 🎉", { position: "top-right" });

      // alert("Profile updatede successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div>
      <Header />
      <div className="flex items-center justify-center min-h-screen bg-gray-200 p-4">
        <div className="bg-gray-300 p-8 rounded-lg shadow-lg max-w-4xl w-full flex flex-col md:flex-row items-center">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-4">EDIT PROFILE</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  placeholder="First Name"
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  placeholder="Last Name"
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  placeholder="Contact No"
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Address"
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              {/* Email is disabled */}
              <div className="mb-4">
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  disabled
                  className="w-full p-2 border rounded-lg bg-gray-200 cursor-not-allowed"
                />
              </div>
              <button
                type="submit"
                className="w-full p-3 mb-4 bg-gray-500 text-white rounded-lg"
              >
                Update Profile
              </button>
            </form>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="bg-red-500 rounded-full w-32 h-32 flex items-center justify-center">
              <img
                src={`${base_url}${user?.image}`}
                className="w-full h-full rounded-full"
                alt={user?.first_name}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
