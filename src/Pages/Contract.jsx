import React, { useState, useEffect } from "react";
import axios from "axios";
import { base_url } from "../config/config";
import { Link, useLocation } from "react-router-dom";

const Contract = () => {
  const [additionalData, setAdditionalData] = useState(null);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);

  // Accessing the query parameters
  const bookingId = searchParams.get("bookingId");

  useEffect(() => {
    const fetchAdditionalData = async () => {
      try {
        setLoading(true);
        // Example: Fetch additional data based on booking ID
        const response = await axios.get(
          `${base_url}/booking/contract/${bookingId}`
        );
        console.log(response.data, "data");
        setAdditionalData(response.data.contract);
      } catch (error) {
        console.error("Error fetching additional data:", error.message);
        // Handle the error, e.g., display an error message to the user
      } finally {
        setLoading(false);
      }
    };

    // Call the function if additional data fetching is required
    fetchAdditionalData();
  }, [bookingId]); // Dependency on bookingData ensures the effect is re-run when bookingData changes

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
            <span className="font-semibold">{additionalData?.carModel}</span>
          </p>
          <p>
            Brand:{" "}
            <span className="font-semibold">{additionalData?.carBrand}</span>
          </p>
          <p>
            No of Seats:{" "}
            <span className="font-semibold">{additionalData?.noOfSeats}</span>
          </p>
          <p>
            Auto/Manual:{" "}
            <span className="font-semibold">
              {additionalData?.transmission}
            </span>
          </p>
          <p>
            Plate Number:{" "}
            <span className="font-semibold">
              {additionalData?.licensePlate}
            </span>
          </p>
          <p>
            Total Amount:{" "}
            <span className="font-semibold">{additionalData?.totalRent}</span>
          </p>

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
