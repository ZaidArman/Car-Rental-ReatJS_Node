import React, { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import car2 from "../assets/car2.png";
import axios from "axios";
import { AuthContext, useAuth } from "../context/auth/auth.provider";
import { base_url } from "../config/config";
import { LoadingContext } from "../context/loading/loading.provider";

const Uploadvehicle = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState();

  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    seats: "",
    manual: "",
    rent: "",
    location: "",
    licensePlate: "",
    image: null,
  });
  const [uploadImageStatus, setUploadImageStatus] = useState(null);
  const [uploadVehicleStatus, setUploadVehicleStatus] = useState(null);
  const [uploadVehicleError, setUploadVehicleError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const { user } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      image: e.target.files[0],
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.brand) errors.brand = "Car brand is required.";
    if (!formData.model) errors.model = "Car model is required.";
    if (!formData.seats) errors.seats = "Number of seats is required.";
    if (!formData.manual) errors.manual = "Transmission type is required.";
    if (!formData.rent) errors.rent = "Rent is required.";
    if (!formData.location) errors.location = "Location is required.";
    if (!formData.licensePlate)
      errors.licensePlate = "License plate number is required.";
    if (!formData.image) errors.image = "Car image is required.";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setUploadVehicleStatus(null);
    setUploadVehicleError(null);

    const formDataToSend = new FormData();
    formDataToSend.append("carBrand", formData.brand);
    formDataToSend.append("carModel", formData.model);
    formDataToSend.append("noOfSeats", formData.seats);
    formDataToSend.append("transmission", formData.manual);
    formDataToSend.append("rentPerDay", formData.rent);
    formDataToSend.append("address", formData.location);
    formDataToSend.append("licensePlate", formData.licensePlate);
    formDataToSend.append("images", formData.image);
    formDataToSend.append("rentalId", user?._id);

    try {
      const { data } = await axios.post(
        `${base_url}/vehicle/rental/uploadvehicle`,
        formDataToSend
      );
      setVehicles([...vehicles, data?.NewVehicle]);
      setUploadVehicleStatus("success");
    } catch (error) {
      console.error("Error uploading vehicle:", error.message);
      setUploadVehicleStatus("error");
      setUploadVehicleError("Failed to upload vehicle");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          `${base_url}/vehicle/rental/getvehicle`,
          { rentalId: user?._id }
        );

        setVehicles(response.data?.vehicles);
      } catch (error) {
        console.error("Error fetching vehicles:", error.message);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchVehicles();
    }
  }, [user]);

  const [bookingRequests, setBookingRequests] = useState([]);
  const [error, setError] = useState(null);

  const fetchBookingRequests = async () => {
    try {
      const { data } = await axios.post(`${base_url}/booking/bookings`, {
        rentalId: user?._id,
      });
      const { declineVehicles, pendingVehicles, rentedVehicles } = data;
      setBookingRequests(pendingVehicles);
    } catch (error) {
      setError("Failed to fetch booking requests");
    }
  };

  useEffect(() => {
    fetchBookingRequests();
  }, [user]);

  const determineStatus = (rentalResponse) => {
    if (rentalResponse === "approved") {
      return "Approved";
    } else if (rentalResponse === "declined") {
      return "Declined";
    } else {
      return "Pending";
    }
  };

  const handleAccept = async (bookingId) => {
    try {
      const response = await axios.put(
        `${base_url}/booking/updateStatus/${bookingId}/accept`
      );
      if (response.status === 200) {
        const updatedBookingRequests = bookingRequests.filter(
          (booking) => booking._id !== bookingId
        );
        setBookingRequests(updatedBookingRequests);
        console.log(bookingRequests, "booking requests");
      }
    } catch (error) {
      setError("Failed to accept booking request");
    }
  };

  const handleDecline = async (bookingId) => {
    try {
      const response = await axios.put(
        `${base_url}/booking/updateStatus/${bookingId}/decline`
      );
      if (response.status === 200) {
        const updatedBookingRequests = bookingRequests.filter(
          (booking) => booking._id !== bookingId
        );
        setBookingRequests(updatedBookingRequests);
      }
    } catch (error) {
      setError("Failed to decline booking request");
    }
  };

  const handleRemove = async (id) => {
    try {
      const response = await axios.put(`${base_url}/vehicle/status/${id}`);
      if (response.status === 200) {
        console.log("Vehicle status updated to not available");
        const updatedVehicles = vehicles.map((vehicle) => {
          if (vehicle._id === id) {
            return { ...vehicle, status: "disable" };
          }
          return vehicle;
        });
        setVehicles(updatedVehicles);
      }
    } catch (error) {
      console.error("Error updating vehicle status:", error.message);
    }
  };

  
    const toggleStatus = async (vehicleId, currentStatus) => {
      try {
        const response = await axios.put(`${base_url}/vehicle/updateStatus/${vehicleId}/${currentStatus}` );

        if (response.status==200) {
          const updatedVehicle = response.data.item;
          setVehicles((prevVehicles) =>
            prevVehicles.map((vehicle) =>
              vehicle._id === updatedVehicle._id ? updatedVehicle : vehicle
            )
          );
        } else {
          console.error("Failed to update status");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
  

  return (
    <div>
      <Header />

      <div className="flex items-center justify-center min-h-screen bg-gray-200 p-4">
        <div className="bg-gray-300 p-8 rounded-lg shadow-lg max-w-4xl w-full flex flex-col md:flex-row items-center">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-4">UPLOAD VEHICLE</h2>

            <p className="mb-6">Upload information about your vehicle.</p>
            <form>
              <div className="mb-4">
                <input
                  type="text"
                  name="brand"
                  placeholder="Car Brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                />
                {validationErrors.brand && (
                  <div className="text-red-600">{validationErrors.brand}</div>
                )}
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="model"
                  placeholder="Car Model"
                  value={formData.model}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                />
                {validationErrors.model && (
                  <div className="text-red-600">{validationErrors.model}</div>
                )}
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="seats"
                  placeholder="How many seats?"
                  value={formData.seats}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                />
                {validationErrors.seats && (
                  <div className="text-red-600">{validationErrors.seats}</div>
                )}
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="manual"
                  placeholder="Manual/Auto"
                  value={formData.manual}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                />
                {validationErrors.manual && (
                  <div className="text-red-600">{validationErrors.manual}</div>
                )}
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="rent"
                  placeholder="Rent Per Day"
                  value={formData.rent}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                />
                {validationErrors.rent && (
                  <div className="text-red-600">{validationErrors.rent}</div>
                )}
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="location"
                  placeholder="Location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                />
                {validationErrors.location && (
                  <div className="text-red-600">
                    {validationErrors.location}
                  </div>
                )}
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="licensePlate"
                  placeholder="License Plate Number"
                  value={formData.licensePlate}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                />
                {validationErrors.licensePlate && (
                  <div className="text-red-600">
                    {validationErrors.licensePlate}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full p-2 bg-gray-500 text-white rounded-lg"
                disabled={loading}
              >
                {loading ? "Uploading..." : "Upload"}
              </button>
              {uploadVehicleStatus === "success" && (
                <div className="text-green-600 mt-4">
                  Vehicle uploaded successfully!
                </div>
              )}
              {uploadVehicleStatus === "error" && (
                <div className="text-red-600 mt-4">{uploadVehicleError}</div>
              )}
            </form>
          </div>
          <div className="flex-1 flex justify-center">
            <div
              className="bg-red-500 rounded-full w-32 h-32 flex items-center justify-center relative cursor-pointer"
              onClick={() => document.getElementById("fileInput").click()}
              style={{
                backgroundImage: `url(${
                  formData.image ? URL.createObjectURL(formData.image) : ""
                })`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <input
                id="fileInput"
                type="file"
                name="image"
                onChange={handleImageChange}
                className="hidden"
              />
              <p className="text-white mt-2">Add Image</p>
            </div>
            {validationErrors.image && (
              <div className="text-red-600">{validationErrors.image}</div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center min-h-screen bg-gray-200 p-4">
        <div className="bg-gray-300 p-8 rounded-lg shadow-lg max-w-4xl w-full">
          <h2 className="text-2xl font-bold mb-4">YOUR VEHICLES</h2>
          <p className="mb-6">Your vehicles that you uploaded on site.</p>

          {!loading ? (
            vehicles?.length > 0 &&
            vehicles.map((item) => (
              <div
                key={item?._id}
                className="flex items-center bg-red-500 text-white p-4 rounded-lg mb-4"
              >
                <img
                  src={item?.avatar}
                  alt="Car"
                  className="w-32 h-auto rounded-lg mr-4"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-bold">{item?.carBrand}</h3>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold">{item?.carModel}</h3>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold">{item?.noOfSeats}</h3>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold">{item?.transmission}</h3>
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-bold">{item?.address}</h3>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold">{item?.licensePlate}</h3>
                </div>

                <div className="text-right">
                  <p className="text-xl font-bold">
                    Per Day Rs/- {item?.rentPerDay}
                  </p>

                  {/* <span className="bg-white text-red-500 px-2 py-1 rounded-full mt-2 inline-block">
                    {item?.status === "disable"
                      ? "Not Available"
                      : item?.status
                        }       
                  </span> */}

                  <span
                    className="bg-white text-red-500 px-2 py-1 rounded-full mt-2 inline-block cursor-pointer"
                    onClick={() => toggleStatus(item._id, item.status)}>
                    {item.status === "disable" ? "Not Available" : item.status}
                  </span>
                </div>

                <span onClick={() => handleRemove(item._id)}>
                  <svg
                    className="w-6 h-6 text-gray-800 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
                    />
                  </svg>
                </span>
              </div>
            ))
          ) : (
            <div>loading...</div>
          )}
        </div>
      </div>

      {/* booking requests */}
      <div className="flex items-center justify-center min-h-screen bg-gray-200 p-4">
        <div className="bg-gray-300 p-8 rounded-lg shadow-lg max-w-4xl w-full">
          <h2 className="text-2xl font-bold mb-4">BOOKING REQUESTS</h2>
          {bookingRequests?.length > 0 &&
            bookingRequests.map((booking) => (
              <div className="flex-row items-center bg-blue-500 text-white p-4 rounded-lg mb-4">
                <div key={booking._id} className="flex items-center">
                  <img
                    src={booking?.vehicleId?.avatar}
                    alt={booking?.vehicleId?.model}
                    className="w-32 h-auto rounded-lg mr-4"
                  />
                  <div className="flex-grow">
                    <p className="text-xl font-bold">
                      {`${booking?.vehicleId?.carBrand} ${booking?.vehicleId?.carModel} ${booking?.vehicleId?.noOfSeats}  ${booking?.vehicleId?.address}  ${booking?.vehicleId?.licensePlate}  ${booking?.vehicleId?.transmission}`}
                    </p>
                    <p className="text-xl font-bold">
                      Per Day Rs/- {booking?.vehicleId?.rentPerDay}
                    </p>
                    <p className="text-lg">
                      Customer Email: {`${booking?.customerId?.email}`}
                    </p>
                  </div>
                  <div className="flex-shrink-0 flex space-x-2">
                    <button
                      className="bg-red-500 px-2 py-1 rounded-full"
                      onClick={() => handleDecline(booking?._id)}
                    >
                      Decline
                    </button>
                    <button
                      className="bg-green-500 px-2 py-1 rounded-full"
                      onClick={() => handleAccept(booking._id)}
                    >
                      Accept
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};
export default Uploadvehicle;
