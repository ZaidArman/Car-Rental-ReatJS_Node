import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { base_url } from "../config/config";

const Showroom = () => {
  const [vehicles, setVehicles] = useState([]);
  console.log(vehicles, 'vehilcles')
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  // useEffect(() => {
  //   const fetchVehicles = async () => {
  //     try {
  //       setLoading(true);
  //       const response = await axios.post(
  //         `${base_url}/vehicle/rental/getvehicle`,
  //         { all: "all" }
  //       );
  //       setVehicles(response.data?.vehicles);
  //     } catch (error) {
  //       console.error("Error fetching vehicles:", error.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchVehicles();
  // }, []);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${base_url}/booking/cars/`); // ✅ Fetch only available cars
        setVehicles(response.data); // ✅ Set vehicles from API response
      } catch (error) {
        console.error("Error fetching vehicles:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);
  

  // const filteredVehicles = vehicles.filter((vehicle) => {
  //   const matchesSearch =
  //     vehicle.carBrand.toLowerCase().includes(searchText.toLowerCase()) ||
  //     vehicle.carModel.toLowerCase().includes(searchText.toLowerCase()) ||
  //     vehicle.address.toLowerCase().includes(searchText.toLowerCase());
  //   const withinPriceRange =
  //     vehicle.rentPerDay >= priceRange[0] &&
  //     vehicle.rentPerDay <= priceRange[1];
  //   const matchesBrand =
  //     selectedBrand === "" || vehicle.carBrand === selectedBrand;
  //   const matchesStatus =
  //     selectedStatus === "" || vehicle.status === selectedStatus;
  //   return matchesSearch && withinPriceRange && matchesBrand && matchesStatus;
  // });
  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.car_brand?.brand_name?.toLowerCase().includes(searchText.toLowerCase()) ||
      vehicle.car_model?.toLowerCase().includes(searchText.toLowerCase()) ||
      vehicle.location?.toLowerCase().includes(searchText.toLowerCase());
    
    const withinPriceRange =
      vehicle.price_per_day >= priceRange[0] && vehicle.price_per_day <= priceRange[1];
  
    const matchesBrand = selectedBrand === "" || vehicle.car_brand?.brand_name === selectedBrand;
    const matchesStatus = selectedStatus === "" || vehicle.status === selectedStatus;
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
                  src={item.image}
                  alt="Car"
                  className="w-32 h-auto rounded-lg mr-4"
                />
                <div className="flex-1">
                <h3 className="text-xl font-bold">{item?.car_brand?.brand_name}</h3>
                {/* <h3 className="text-xl font-bold">{item.car_brand?.brand_name || "Unknown Brand"}</h3> */}
                  {/* <h3 className="text-xl font-bold">{item.carBrand}</h3> */}
                </div>
                <div className="flex-1">
                <h3 className="text-xl font-bold">{item.car_model}</h3>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold">{item.seats}</h3>
                </div>
                <div className="flex-1">
                  {/* <h3 className="text-xl font-bold">{item.transmission}</h3> */}
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
                  {/* <span className="bg-white text-red-500 px-2 py-1 rounded-full mt-2 inline-block">
                    {item.status}
                  </span> */}
                   <span
                  className="bg-white text-red-500 px-2 py-1 rounded-full mt-2 inline-block cursor-pointer"
                  onClick={() => toggleStatus(item.id, item.status)}
                >
                  {item?.status ? item.status : "Active"} {/* ✅ Default to "Active" */}
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
