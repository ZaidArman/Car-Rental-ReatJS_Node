import React from "react";
import Header from "../components/Header";
import Showroom from "../Pages/Showroom";
import Login from "../Pages/Login";
import Signup from "../Pages/Signup";
import Footer from "./Footer";
import car from "../assets/car.png";
import steeringWheel from "../assets/steeringwheel.png";
import { useContext } from "react";
import { useAuth } from "../context/auth/auth.provider";

const Profile = () => {
  const { user } = useAuth();

  const Links = [
    { to: "/Showroom", label: "Showroom" },
    user?.isRental && { to: "/Rental", label: "Rental" },

    { to: "/uploadVehicle", label: "Upload Vehicle" },

    user?.isCustomer && { to: "/Customer", label: "Customer" },

    { to: "/rentedVehicle", label: "Rented Vehicle" },
  ];

  return (
    <div className="flex flex-col ustify-center min-h-screen bg-gray-200 p-4">
      <Header links={Links} />

      <div className="grid grid-cols-2 h-screen mt-16">
        <div className="mb-10 mt-20 ml-10 flex h-full">
          <h1 className="text-8xl font-bold ml-4 mt-10">
            <span className="text-black px-2 py-1">RENT A RIDE</span>
            <br />
            <span className="text-red-500">BOOK A RIDE</span>
          </h1>
        </div>
        <div className="flex justify-center h-full">
          <div className="bg-red-500 rounded-full w-96 h-96 flex items-center  mr-0 ">
            <img src={car} alt="Car" className="my-4 w-90 h-auto z-10" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 h-screen pl-16">
        <div className="bg-red-500 rounded-full w-96 h-96 flex items-center justify-center ">
          {" "}
          {/* Added justify-center */}
          <img
            src={steeringWheel}
            alt="Steering Wheel"
            className="w-58 h-58 mb-4 md:mb-0 md:mr-1"
          />
        </div>

        <div className="md:flex-row items-center md:items-start  h-120 rounded-lg overflow-hidden">
          <div className="w-550 h-484 pr-10 bg-gray-300 p-6">
            <h2 className="text-4xl font-bold mb-2 text-gray-800">
              HOW DOES IT WORK?
            </h2>
            <p className="text-gray-700 text-xl font-bold">
              Rent a Ride website serves as a centralized platform for
              customers to easily browse and book rental vehicles from various
              providers. Also any user can upload their vehicle on platform to
              put them on rent. It offers a user-friendly interface with search
              filters for vehicle brand and model ensuring a seamless
              experience. Integrated with secure payment gateways making it the
              go-to solution for all car rental needs.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
