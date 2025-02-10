import React, { useState, useEffect } from "react";
import axios from "axios";
import { base_url } from "../config/config";
import { Link, useLocation } from "react-router-dom";

const Contract = () => {
  const [additionalData, setAdditionalData] = useState(null);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  console.log(additionalData, 'additionalData')

  const searchParams = new URLSearchParams(location.search);

  // Accessing the query parameters
  const bookingId = searchParams.get("bookingId");

  console.log(bookingId, 'BOOKing ID')

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${base_url}/booking/booking/${bookingId}`,  // ✅ Correct API path
          {
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log("Booking Data:", response.data);
        setAdditionalData(response.data); // ✅ Store booking details
      } catch (error) {
        console.error("Error fetching booking details:", error.message);
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) fetchBookingDetails();
  }, [bookingId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200 p-4">
      <div className="bg-gray-300 p-8 rounded-lg shadow-md w-full max-w-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">CONTRACT</h1>
        <span className="text-center mb-4 mx-auto block">
          By using our website, you agree to the contract.
        </span>

        <div className="text-center space-y-2">
          <p>
            Car model:{" "}
            <span className="font-semibold">{additionalData?.car_details?.car_model || "N/A"}</span>
          </p>
          <p>
            Brand:{" "}
            <span className="font-semibold">{additionalData?.car_details?.car_brand?.brand_name || "N/A"}</span>
          </p>
          <p>
            No of Seats:{" "}
            <span className="font-semibold">{additionalData?.car_details?.seats || "N/A"}</span>
          </p>

         <p> Auto/Manual: <span className="font-semibold">
            {additionalData?.car_details?.type === "M" ? "Manual" :
             additionalData?.car_details?.type === "A" ? "Auto" :
             additionalData?.car_details?.type === "H" ? "Hybrid" : "N/A"}
          </span></p>
          <p>Plate Number: <span className="font-semibold">{additionalData?.car_details?.licence_plate_no || "N/A"}</span></p>
          <p>Total Amount: <span className="font-semibold">{additionalData?.total_price || "N/A"}</span></p>


          <p className="mt-6 text-center">
            The customer is responsible for any kind of damage to the vehicle
            during the rental period. All repair costs will be charged to the
            customer. <br />
            The vehicle must be returned on the scheduled return date. Failure
            to do so will result in additional charges. <br />
            Late returns will incur a heavy fine. The fine amount will be
            calculated based on the number of days past the scheduled return
            date. <br />
            Full payment and real ID card of customer are required at the time
            of rental. ID carrd will be returned after safe return of the
            vehicle.
          </p>
          <p className="mt-2 text-center">
            By pressing the CONFIRM button, you agree to these terms and cannot
            deny afterwards!
          </p>

          <Link to="/Rentedvehicle">
            <div className="flex justify-center px-4 py-2 mt-6 font-bold text-white bg-gray-400  hover:bg-gray-500 rounded-lg">
              <button className="text-white">CONFIRM</button>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Contract;
