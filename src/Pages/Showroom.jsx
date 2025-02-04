import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { base_url } from "../config/config";

const Showroom = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          `${base_url}/vehicle/rental/getvehicle`,
          { all: "all" }
        );
        setVehicles(response.data?.vehicles);
      } catch (error) {
        console.error("Error fetching vehicles:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.carBrand.toLowerCase().includes(searchText.toLowerCase()) ||
      vehicle.carModel.toLowerCase().includes(searchText.toLowerCase()) ||
      vehicle.address.toLowerCase().includes(searchText.toLowerCase());
    const withinPriceRange =
      vehicle.rentPerDay >= priceRange[0] &&
      vehicle.rentPerDay <= priceRange[1];
    const matchesBrand =
      selectedBrand === "" || vehicle.carBrand === selectedBrand;
    const matchesStatus =
      selectedStatus === "" || vehicle.status === selectedStatus;
    return matchesSearch && withinPriceRange && matchesBrand && matchesStatus;
  });

  const carBrandSet = new Set();
  vehicles.forEach((item) => {
    carBrandSet.add(item.carBrand);
  });

  const carBrandOptions = Array.from(carBrandSet).map((carBrand) => {
    return { key: carBrand };
  });

  const statusOptions = ["active", "inactive"];

  return (
    <div>
      <Header />
      <div className="text-center bg-gray-200 pt-2">
        <h1 className="text-4xl font-bold">Right Place Right Time.</h1>
      </div>

      <div className="bg-gray-200 text-center pt-5">
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search Brand or Model"
          className="p-2 border border-gray-300 rounded"
        />
        <input
          type="range"
          min="0"
          max="5000"
          value={priceRange[1]}
          onChange={(e) =>
            setPriceRange([priceRange[0], parseInt(e.target.value)])
          }
          className="slider mt-2"
        />
        <span className="ml-4">{priceRange[1]}</span> = Price Range
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="p-2 border border-gray-300 rounded ml-2"
        >
          <option value="">Status</option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
       
      </div>

      <div className="flex items-center justify-center min-h-screen bg-gray-200 p-4">
        <div className="bg-gray-300 p-8 rounded-lg shadow-lg max-w-4xl w-full">
          <h2 className="text-2xl font-bold mb-4">Available VEHICLES</h2>

          {!loading ? (
            filteredVehicles.length > 0 &&
            filteredVehicles.map((item) => (
              <div
                key={item._id}
                className="flex items-center bg-red-500 text-white p-4 rounded-lg mb-4"
              >
                <img
                  src={item.avatar}
                  alt="Car"
                  className="w-32 h-auto rounded-lg mr-4"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-bold">{item.carBrand}</h3>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold">{item.carModel}</h3>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold">{item.noOfSeats}</h3>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold">{item.transmission}</h3>
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-bold">{item.address}</h3>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold">{item.licensePlate}</h3>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold">{item.rentPerDay}</p>
                  <p>per day</p>
                  <span className="bg-white text-red-500 px-2 py-1 rounded-full mt-2 inline-block">
                    {item.status}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div>loading...</div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Showroom;
