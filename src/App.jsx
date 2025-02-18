
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Header from "./components/Header";
import Footer from "./components/Footer.jsx";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import Rental from "./Pages/Rental";
import Customer from "./Pages/Customer";
import Showroom from "./Pages/Showroom";
import BookNow from "./Pages/BookNow";
import Profile from "./Pages/Profile.jsx";
import Uploadvehicle from "./Pages/Uploadvehicle";
import Payment from "./Pages/Payment";
import Termsandconditions from "./Pages/Termsandconditions";
import Rentedvehicle from "./Pages/Rentedvehicle";
import Contract from "./Pages/Contract";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import "@fortawesome/fontawesome-free/css/all.css";
import ProtectedRouteRental from "./components/ProtectedRouteRental.jsx";
import { base_url } from "./config/config.js";
import axios from "axios";
import ForgetPassword from "./Pages/ForgetPassword.jsx";
import ResetPassword from "./Pages/ResetPassword.jsx";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [stripeKey, setStripeApiKey] = React.useState();
  const getStripeaApiKey = async () => {
    try {
      const { data } = await axios.get(`${base_url}/payment/stripeKey`);
      console.log(data, "data");
      setStripeApiKey(data.stripeApiKey);
    } catch (error) {
      console.log("stripeApiKey", error);
    }
  };

  useEffect(() => {
    getStripeaApiKey();
  }, []);

  return (
    <Router>
            {/* Add ToastContainer globally to show toasts in any component */}
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/ShowRoom" element={<Showroom />} />
        <Route path="/password/forget" element={<ForgetPassword />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />

        <Route path="/Termsandconditions" element={<Termsandconditions />} />
        <Route path="/Profile" element={<Profile />} />
        

        <Route element={<ProtectedRouteRental customerOnly />}>
          <Route path="/Customer" element={<Customer />} />
          <Route path="/Rentedvehicle" element={<Rentedvehicle />} />
          <Route path="/BookNow" element={<BookNow />} />
          <Route path="/Contract" element={<Contract />} />

          {/* <Route path="/Profile" element={<Profile />} /> */}
          {stripeKey && (
            <Route
              path="/payment/payment/:bookingId"
              element={
                <Elements stripe={loadStripe(stripeKey)}>
                  <Payment />
                </Elements>
              }
            />
          )}
        </Route>
        <Route element={<ProtectedRouteRental rentalOnly />}>
          <Route path="/Rental" element={<Rental />} />
          <Route path="/Uploadvehicle" element={<Uploadvehicle />} />
 
        </Route>

        
        <Route path="/Footer" element={<Footer />} />
      </Routes>
    </Router>
  );
}

export default App;
