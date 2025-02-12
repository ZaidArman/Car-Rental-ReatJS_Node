import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth/auth.provider";
import { toast } from "react-toastify"; // Import Toastify

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    first_name: "",  // Ensure this matches Django
    last_name: "",   // Ensure this matches Django
    cnic: "",        // Add this field
    address: "",
    phone_number: "",  // Fix field name from 'contact' to 'phone_number'
    email: "",
    password: "",
    roles: "",
    image: null,
  });
  
  const [errors, setErrors] = useState({});
  const navigation = useNavigate();
  const [singUpSuccess, setSignUpSuccess] = useState("");
  const [errorSignUp, setErrorSignUp] = useState("");

  const { signup } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  const handleImageChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      image: e.target.files[0],
    }));
    setErrors({
      ...errors,
      image: "",
    });
  };

  // const validateForm = () => {
  //   const newErrors = {};
  //   Object.keys(formData).forEach((key) => {
  //     if (!formData[key] && key !== "image") {
  //       newErrors[key] = "This field is required.";
  //     }
  //   });
  //   setErrors(newErrors);
  //   return Object.keys(newErrors).length === 0;
  // };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = ["first_name", "last_name", "cnic", "address", "phone_number", "email", "password"];
  
    requiredFields.forEach((key) => {
      if (!formData[key]) {
        newErrors[key] = "This field is required.";
      }
    });
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  

  const onSuccess = (data) => {
    toast.success("Signup successful! 🎉");
    setSignUpSuccess("SignUp Successfull");
    navigation("/login");
  };

  const onFailure = (err) => {
    setErrorSignUp(err?.response?.data?.message || "an error occured");
    toast.error(`${key}: ${value[0]}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    const formDataToSend = new FormData();
    formDataToSend.append("first_name", formData.first_name); // Fix field name
    formDataToSend.append("last_name", formData.last_name);   // Fix field name
    formDataToSend.append("cnic", formData.cnic);             // Add CNIC field
    formDataToSend.append("address", formData.address);
    formDataToSend.append("phone_number", formData.phone_number); // Fix field name
    formDataToSend.append("email", formData.email);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("roles", formData.roles);
    
    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }
  
    await signup(formDataToSend, onSuccess, onFailure);
  };
  

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigation("/Home");
    }
  }, [navigation]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-200">
      <div className="bg-gray-300 p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Create An Account
        </h2>
        <p className="mb-6 text-center">
          Create a free account to start using our services for free!
        </p>
        <form onSubmit={handleSubmit}>
          <div className="flex-1 flex justify-center">
            <div
              className="mb-6 bg-red-500 rounded-full w-32 h-32 flex items-center justify-center relative cursor-pointer"
              onClick={() => document.getElementById("fileInput").click()}
              style={{
                backgroundImage: `url(${
                  formData.image ? URL.createObjectURL(formData.image) : ""
                })`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <input
                id="fileInput"
                type="file"
                name="image"
                onChange={handleImageChange}
                className="hidden"
              />
              <p className="text-white mt-2">Add Image</p>
            </div>
            {errors.image && <p className="text-red-500">{errors.image}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              value={formData.first_name}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded"
            />
            {errors.first_name && (
              <p className="text-red-500">{errors.first_name}</p>
            )}

            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              value={formData.last_name}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded"
            />
            {errors.last_name && (
              <p className="text-red-500">{errors.last_name}</p>
            )}
          </div>

          <div className="mb-4">
            <input
              type="text"
              name="cnic"  // New field for CNIC
              placeholder="CNIC"
              value={formData.cnic}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
            {errors.cnic && <p className="text-red-500">{errors.cnic}</p>}
          </div>


          <div className="mb-4">
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
            {errors.address && <p className="text-red-500">{errors.address}</p>}
          </div>
          <div className="mb-4">
            <input
              type="text"
              name="phone_number"
              placeholder="Contact No."
              value={formData.phone_number}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
            {errors.phone_number && <p className="text-red-500">{errors.phone_number}</p>}
          </div>
          <div className="mb-4">
            <input
              type="email"
              name="email"
              placeholder="Enter Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
            {errors.email && <p className="text-red-500">{errors.email}</p>}
          </div>
          <div className="mb-4">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
            {errors.password && (
              <p className="text-red-500">{errors.password}</p>
            )}
          </div>
          <div
            className={`${errorSignUp ? "text-red-500" : "text-green-500"}  `}
          >
            {errorSignUp && errorSignUp}
            {singUpSuccess && singUpSuccess}
          </div>

          <button
            type="submit"
            onClick={() =>
              handleChange({
                target: {
                  name: "roles",
                  value: "Customer",
                },
              })
            }
            className="w-full p-3 mb-4 font-bold text-white bg-gray-400 hover:bg-gray-500 rounded-lg"
          >
            SignUp as a customer
          </button>
          <button
            type="submit"
            onClick={() =>
              handleChange({
                target: {
                  name: "roles",
                  value: "Rental",
                },
              })
            }
            className="w-full p-3 mb-4 font-bold text-white bg-gray-400 hover:bg-gray-500 rounded-lg"
          >
            SignUp as a rental
          </button>
        </form>
        <div className="text-center mt-4">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-black">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
