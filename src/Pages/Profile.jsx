import React, { useContext, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import { Link } from "react-router-dom";
import { base_url } from "../config/config";
import { AuthContext, useAuth } from "../context/auth/auth.provider";

const Profile = () => {
  const { user, setUser } = useAuth();

  const [formData, setFormData] = useState({
    firstName: user?.firstName,
    lastName: user?.lastName,
    contact: user?.contact,
    emailAddress: user?.email,
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    let formErrors = {};
    if (!formData.firstName) formErrors.firstName = "First name is required";
    if (!formData.lastName) formErrors.lastName = "Last name is required";
    if (!formData.contact) formErrors.contact = "Contact number is required";
    if (!formData.emailAddress) formErrors.emailAddress = "Email address is required";
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const res = await axios.put(
        `${base_url}/user/editProfile/${user._id}`,
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          contact: formData.contact,
          emailAddress: formData.emailAddress,
        }
      );
      console.log(res.data); // Handle success response as needed
      setUser(res?.data?.rest);
      alert("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      // Handle error response here
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
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="First Name"
                  className="w-full p-2 border rounded-lg"
                />
                {errors.firstName && (
                  <p className="text-red-500">{errors.firstName}</p>
                )}
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Last Name"
                  className="w-full p-2 border rounded-lg"
                />
                {errors.lastName && (
                  <p className="text-red-500">{errors.lastName}</p>
                )}
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  placeholder="Contact No"
                  className="w-full p-2 border rounded-lg"
                />
                {errors.contact && (
                  <p className="text-red-500">{errors.contact}</p>
                )}
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="emailAddress"
                  value={formData.emailAddress}
                  onChange={handleInputChange}
                  placeholder="Email Address"
                  className="w-full p-2 border rounded-lg"
                />
                {errors.emailAddress && (
                  <p className="text-red-500">{errors.emailAddress}</p>
                )}
              </div>
              <div className="mb-4">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <button
                type="submit"
                className="w-full p-3 mb-4 bg-gray-500 text-white rounded-lg"
              >
                Update Profile
              </button>
              <br />
            </form>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="bg-red-500 rounded-full w-32 h-32 flex items-center justify-center">
              <img
                src={user?.avatar}
                className="w-full h-full rounded-full"
                alt={user?.firstName}
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
