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
    const fetchData = async () => {
      console.log(user, "data");

      try {
        const response = await axios.post(`${base_url}/booking/bookings`, {
          customerId: user?._id,
        });

        const { rentedVehicles, pendingVehicles } = response.data;
        setPendingVehicles(pendingVehicles);
        setRentedVehicles(rentedVehicles);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch data");
        setLoading(false);
      }
    };
    if (user) {
      fetchData();
    }
  }, [user]);

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
                  src={vehicle.vehicleId.avatar}
                  alt={vehicle.vehicleId.model}
                  className="w-32 h-auto rounded-lg mr-4"
                />
                <div className="flex-1 font-bold text-xl">
                  <p>
                    {vehicle.vehicleId.carBrand} {vehicle.vehicleId.carModel}{" "}
                    {vehicle.vehicleId.noOfSeats} {vehicle.vehicleId.address}{" "}
                    {vehicle.vehicleId.licensePlate}{" "}
                    {vehicle.vehicleId.transmission}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold">
                  Per Day Rs/- {vehicle.vehicleId.rentPerDay}
                  </p>
                  <span className="bg-white text-black px-2 py-1 rounded-full mt-2 inline-block">
                    {vehicle.status}
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
                      src={vehicle?.vehicleId?.avatar}
                      alt={vehicle?.vehicleId?.model}
                      className="w-32 h-auto rounded-lg mr-4"
                    />
                    <div className="flex ">
                      <p className="text-xl font-bold">{`${vehicle?.vehicleId?.carBrand} ${vehicle?.vehicleId?.carModel} ${vehicle?.vehicleId?.noOfSeats}  ${vehicle?.vehicleId?.address}  ${vehicle?.vehicleId?.licensePlate}  ${vehicle?.vehicleId?.transmission}`}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold ">Per Day Rs/- {vehicle?.vehicleId?.rentPerDay}</p>
                      {vehicle.status === "request" ? (
                        <span className="bg-gray-300 px-2 py-1 rounded-full mt-2 inline-block cursor-not-allowed">
                          PAYMENT
                        </span>
                      ) : (
                        <Link to={`/payment/${vehicle._id}/${vehicle.totalRent}`}>
                          <span className="bg-green-500 px-2 py-1 rounded-full mt-2 inline-block">
                            PAYMENT
                          </span>
                        </Link>
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


