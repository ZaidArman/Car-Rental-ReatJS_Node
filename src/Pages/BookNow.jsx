import React, { useContext, useState } from "react";
import axios from "axios";
import { base_url } from "../config/config";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/auth/auth.provider";

const BookNow = () => {
  const location = useLocation();
  const navigation = useNavigate();
  const { user } = useContext(AuthContext);
  const [error, setError] = useState("");
  const searchParams = new URLSearchParams(location.search);
 
  const carId = searchParams.get("carId");
 
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    contactNo: "",
    email: "",
    cnic: "",
    customerId: user?._id,
    startDate: "",
    endDate: "",
    vehicleId: carId,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
console.log(user,"user data")  

const handleSubmit = async (e) => {
  e.preventDefault();

  if (formData.cnic.length !== 13) {
    setError("CNIC must be 13 characters long.");
    return;
  }
  if (formData.contactNo.length !== 11) {
    setError("Contact number must be 11 characters long.");
    return;
  }
  
  // Validate dates
  if (!isValidDateRange(formData.startDate, formData.endDate)) {
    setError("End date must be after start date and both must be in format 'YYYY-MM-DD'");
    return;
  }

  try {
    const res = await axios.post(
      `${base_url}/booking/customer/bookNow`,
      formData
    );
    console.log(res.data);

    // Construct the query string from the received parameters
    const queryParams = new URLSearchParams();
    queryParams.set("bookingId", res.data.newBooking._id);

    // Navigate to the new URL with the query parameters
    navigation(`/contract?${queryParams.toString()}`);
  } catch (error) {
    setError(error?.response?.data?.message || "An error occurred while booking.");
    console.error("Error adding new booking:", error?.message);
  }
};

// Date validation function
const isValidDateRange = (startDate, endDate) => {
  // Regular expression for 'YYYY-MM-DD' format
  const dateFormat = /^\d{4}-\d{2}-\d{2}$/;

  // Check if both startDate and endDate match the format
  if (!dateFormat.test(startDate) || !dateFormat.test(endDate)) {
    return false;
  }

  // Check if startDate is before endDate
  const start = new Date(startDate);
  const end = new Date(endDate);
  return start < end && !isNaN(start) && !isNaN(end);
};


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200">
      <div className="bg-gray-300 p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Book Now</h1>
        <p className="text-center mb-6">
          Enter your details to continue booking
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First Name"
              className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
              className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              name="contactNo"
              value={formData.contactNo}
              onChange={handleChange}
              minLength={11}
              placeholder="Contact No."
              className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              name="cnic"
              value={formData.cnic}
              minLength={13}
              onChange={handleChange}
              placeholder="CNIC"
              className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <span>From: </span>
            <input
              type="text"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              placeholder="(YYYY-MM-DD)"
              className="w-2/5 p-2 border rounded focus:outline-none focus:border-blue-500"
            />
            <span> To: </span>
            <input
              type="text"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              placeholder="(YYYY-MM-DD)"
              className="w-2/5 p-2 border rounded focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gray-500 text-black p-2 rounded hover:bg-gray-600"
          >
            Next
          </button>
        </form>
        <div>{error && <span> {error} </span>}</div>
      </div>
    </div>
  );
};

export default BookNow;

