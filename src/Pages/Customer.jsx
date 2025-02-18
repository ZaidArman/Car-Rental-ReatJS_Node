import React, { useContext, useState, useEffect } from "react";
import Showroom from "./Showroom";
import Rentedvehicle from "./Rentedvehicle";
import Profile from "./Profile";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link, useNavigate } from "react-router-dom";
import BookNow from "./BookNow";
import car2 from "../assets/car2.png";
import { AuthContext, useAuth } from "../context/auth/auth.provider";
import axios from "axios";
import { base_url } from "../config/config";

const Customer = () => {
  const [vehicles, setVehicles] = useState([]);
  console.log(vehicles, 'vehicles')
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const { user } = useAuth();
  const navigation = useNavigate();
  const Links = [
    { to: "/Profile", label: "Profile" },
    user?.isCustomer && 
    { to: "/Rentedvehicle", label: "Rentedvehicle" },
  ];

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${base_url}/booking/cars/`); // ✅ Use GET request
        // const activeVehicles = response.data?.filter(car => car.status === "active"); // ✅ Filter only active cars
        // setVehicles(activeVehicles);
        setVehicles(response.data);
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
  

  const handleBookNow = (item) => {
    const queryParams = new URLSearchParams();
    queryParams.set("carId", item.id);
    navigation(`/BookNow?${queryParams.toString()}`);
  };

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.car_brand?.brand_name.toLowerCase().includes(searchText.toLowerCase()) ||
      vehicle.car_model.toLowerCase().includes(searchText.toLowerCase()) ||
      vehicle.location.toLowerCase().includes(searchText.toLowerCase());
  
    const withinPriceRange =
      vehicle.price_per_day >= priceRange[0] && vehicle.price_per_day <= priceRange[1];
  
    const matchesBrand = selectedBrand === "" || vehicle.car_brand?.brand_name === selectedBrand;
    const matchesStatus = selectedStatus === "" || vehicle.status === selectedStatus;
  
    return matchesSearch && withinPriceRange && matchesBrand && matchesStatus;
  });

  console.log(filteredVehicles, 'filteredVehicles')
  

  const carBrandSet = new Set();
  vehicles.forEach((item) => {
    carBrandSet.add(item.carBrand);
  });

  const carBrandOptions = Array.from(carBrandSet).map((carBrand) => {
    return { key: carBrand };
  });

  return (
    <div>
      <Header links={Links} />

      <div className="p-4 bg-gray-200">
        <div className="text-center mb-8">
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
            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
            className="slider mt-2"
          />
          <span className="ml-4">{priceRange[1]}</span> = Price Range
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="p-2 border border-gray-300 rounded ml-4"
          >
            <option value="">Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="bg-gray-300 p-8 rounded-lg shadow-lg max-w-4xl w-full">
            {!loading ? (
              filteredVehicles.length > 0 ? (
                filteredVehicles.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center bg-red-500 text-white p-4 rounded-lg mb-4"
                  >
                    <img
                      src={item?.image}
                      alt="Car"
                      className="w-32 h-auto rounded-lg mr-4"
                    />
                <div className="flex-1">
                <h3 className="text-xl font-bold">{item?.car_brand?.brand_name || "Unknown Brand" }</h3>
                </div>
                <div className="flex-1">
                <h3 className="text-xl font-bold">{item.car_model}</h3>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold">{item.seats}</h3>
                </div>
                 <div className="flex-1">
                  <h3 className="text-xl font-bold">
                      {item.type === "M" ? "Manual" : item.type === "A" ? "Auto" : item.type === "H" ? "Hybrid" : "Unknown"}
                    </h3>

                      </div>

                      <div className="flex-1">
                        <h3 className="text-xl font-bold">{item.location}</h3>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold">{item.licence_plate_no}</h3>
                      </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">{item.price_per_day}</p>
                      <p>per day</p>
                      <span className="bg-white text-red-500 px-2 py-1 rounded-full mt-2 inline-block">
                        {item.status}
                      </span>
                      <div
                        onClick={() => item.status !== "inactive" && handleBookNow(item)}
                        className={`flex-1 ${
                          item.status === "inactive" ? "cursor-not-allowed" : ""
                        }`}
                      >
                        <h3
                          className={`mt-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 ${
                            item.status === "inactive"
                              ? "bg-gray-300 hover:bg-gray-300"
                              : ""
                          }`}
                        >
                          Book Now
                        </h3>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div>No vehicles found.</div>
              )
            ) : (
              <div>Loading...</div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Customer;
