import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext, useAuth } from "../context/auth/auth.provider";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const { login, setRole } = useAuth();
  const navigation = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log(token, "TOKEN VALUE");
    if (token) {
      navigation("/Home");
    }
  }, []);

  const handleLogin = async () => {
    const data = {
      email: email,
      password: password,
    };

    const onSuccess = (data) => {
      if(data?.isRental) {
      if(data?.isCustomer) {
        localStorage.setItem("role", "both")
        setRole("both")
      } else {
        localStorage.setItem("role", "rental")
        setRole("rental")
      }
        navigation("/Rental");
        return ;
      } 
      else if (data?.isCustomer ) {
        localStorage.setItem("role", "customer")
        navigation("/Customer");
        setRole("customer")
      }
    };

    const onFailure = (err) => {
      setError(err?.response?.data?.message || "an error occured");
    };

    await login(data, onSuccess, onFailure);
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="bg-gray-300 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <p className="mb-6 text-center">
          Please enter your details below to continue
        </p>
        <input
          type="email"
          placeholder="Enter Email Address"
          value={email}
          onChange={handleEmailChange}
          className="w-full p-3 mb-4 border rounded-lg"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
          className="w-full p-3 mb-4 border rounded-lg"
        />
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          onClick={handleLogin}
          className="w-full p-3 mb-4 font-bold text-white bg-gray-400 hover:bg-gray-500 rounded-lg"
        >
          Login
        </button>
        <div className="text-center text-gray-600">
          <span>Don't have an account? </span>
          <Link to="/signup" className="text-black">
            Sign up
          </Link>
        </div>
        <div className="text-center text-gray-600">
          
          <Link to="/password/forget" className="text-black">
          forgot password? 
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
