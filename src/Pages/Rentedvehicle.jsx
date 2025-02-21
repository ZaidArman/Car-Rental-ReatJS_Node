import React, { useContext, useState, useEffect } from "react";
import Header from "../components/Header";
import Profile from "./Profile";
import Showroom from "./Showroom";
import car2 from "../assets/car2.png";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import axios from "axios";
import { base_url } from "../config/config";
import { AuthContext, useAuth } from "../context/auth/auth.provider";
import { toast } from "react-toastify";

const Rentedvehicle = () => {
  const Links = [
    { to: "/Profile", label: "Profile" },
  ];

  const [rentedVehicles, setRentedVehicles] = useState([]);
  const [pendingVehicles, setPendingVehicles] = useState([]);
  const [acceptedVehicles, setAcceptedVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useAuth();
  useEffect(() => {
    const fetchRentedVehicles = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${base_url}/booking/booking/`, {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`, // ✅ Ensure correct authentication
          },
        });

        console.log("Fetched Vehicles:", response.data);

        const rented = response.data.filter((vehicle) => vehicle.status === "S");
        const pending = response.data.filter((vehicle) => vehicle.status === "P" || vehicle.status === "A");
        

        setRentedVehicles(rented);
        setPendingVehicles(pending);
       

      } catch (error) {
        console.error("Error fetching rented vehicles:", error.message);
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchRentedVehicles();
    }
  }, [user]);


  const handlePayment = async (bookingId) => {
    try {
      const response = await axios.post(
        `${base_url}/payment/create-car-checkout-session/`,
        { booking_id: bookingId },  // Send booking_id in the request body
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",  // Ensure JSON request
          },
        }
      );
      window.location.href = response.data.url; // Redirect to Stripe checkout
    } catch (error) {
      console.error("Error creating Stripe checkout session:", error);
      toast.error("Payment failed. Please try again.");
    }
  };
  

  return (
    <div>
      <Header links={Links} />

      <div className="flex items-center justify-center min-h-screen bg-gray-200 p-4">
        <div className="p-8 rounded-lg shadow-lg max-w-4xl bg-gray-00 w-full">
          <h2 className="text-2xl font-bold mb-4">RENTED VEHICLES</h2>
          <p className="mb-6">Your vehicles which you rented from the site.</p>
          {rentedVehicles?.length > 0 &&
            rentedVehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="flex items-center bg-lime-400 text-black p-4 rounded-lg mb-4"
              >
                <img
                  src={vehicle.car_details?.image || ""}
                  alt={vehicle.car_details.model_name}
                  className="w-32 h-auto rounded-lg mr-4"
                />
                <div className="flex-1 font-bold text-xl">
                  <p>
                    {/* {vehicle.vehicleId.carBrand} {vehicle.vehicleId.carModel}{" "}
                    {vehicle.vehicleId.noOfSeats} {vehicle.vehicleId.address}{" "}
                    {vehicle.vehicleId.licensePlate}{" "}
                    {vehicle.vehicleId.transmission} */}
                    {vehicle.car_details.car_brand.brand_name} {vehicle.car_details.car_model}{" "}
                    {vehicle.car_details.seats}, {vehicle.car_details.licence_plate_no}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold">
                  Per Day Rs/- {vehicle?.car_details.price_per_day}
                  </p>
                  <span className="bg-white text-black px-2 py-1 rounded-full mt-2 inline-block">
                  <span className="bg-white text-black px-2 py-1 rounded-full mt-2 inline-block">
                  {vehicle.status === "P"
                    ? "Pending"
                    : vehicle.status === "S"
                    ? "Paid"
                    : vehicle.status === "A"
                    ? "Approved"
                    : vehicle.status === "C"
                    ? "Cancelled"
                    : "Unknown"}
                </span>
                  </span>
                </div>
              </div>
              
            ))}

          <div className="flex items-center justify-center min-h-screen bg-gray-200 p-4">
            <div className=" bg-gray-300 rounded-lg p-8 max-w-4xl w-full">
              <h2 className="text-2xl font-bold mb-4">PENDING REQUESTS</h2>

              {pendingVehicles?.length > 0 &&
                pendingVehicles.map((vehicle) => (
                  <div
                    key={vehicle._id} 
                    className="flex items-center bg-blue-500 text-white p-4 rounded-lg mb-4"
                  >
                    <img
                      src={vehicle?.car_details.image || ""}
                      alt={vehicle?.vehicleId?.model}
                      className="w-32 h-auto rounded-lg mr-4"
                    />
                    <div className="flex ">
                      <p className="text-xl font-bold">
                      {vehicle.car_details.car_brand.brand_name} {vehicle.car_details.car_model}{" "}
                      {vehicle.car_details.seats} seats, {vehicle.car_details.licence_plate_no}
                        </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold ">Per Day Rs/- {vehicle?.car_details.price_per_day}</p>
                      {vehicle.status != "A" ? (
                        <span className="bg-gray-300 px-2 py-1 rounded-full mt-2 inline-block cursor-not-allowed">
                          PAYMENT
                        </span>
                      ) : (
                        <button
                            onClick={() => handlePayment(vehicle.id)}
                            className="bg-green-500 px-2 py-1 rounded-full mt-2 inline-block"
                          >
                            PAYMENT
                          </button>

                      )}
                    </div>
                  </div>

                ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Rentedvehicle;


