import { createContext, useContext, useEffect, useState } from "react";
import { LoadingContext } from "../loading/loading.provider";
import { base_url } from "../../config/config";
import axios from "axios";
import { toast } from "react-toastify"; // Import Toastify


const INITIAL_STATE = {
  user: null,
};

export const AuthContext = createContext(INITIAL_STATE);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authanticated, setAuthanticated] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [role, setRole] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedRole = localStorage.getItem("role");
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      setUser(JSON.parse(savedUser)); // Load user from local storage
    }
    
    console.log(savedToken, savedRole, "auth data");
    if (savedToken) {
      setToken(savedToken);
      setRole(savedRole);
      setAuthanticated(true);
      getProfile();
    }

    setUserLoading(false);
  }, []);

  const logOut = async () => {
    setAuthanticated(false);
    localStorage.removeItem("role");
    setUser(null);
    setToken("");
    setRole("");
    localStorage.removeItem("token");
  };


  const getProfile = async () => {
    try {
      const getToken = localStorage.getItem("token");
      if (!getToken) return;
  
      console.log("Fetching user profile...");
      const { data } = await axios.get(`${base_url}/accounts/users/profile/`, {
        headers: {
          Authorization: `Token ${getToken}`,
        },
      });
  
      console.log("Fetched User Profile Data:", data);
      setUser(data); // Ensure full user object is stored
      localStorage.setItem("user", JSON.stringify(data)); // Save in localStorage
    } catch (err) {
      console.error("Error fetching user profile:", err);
    }
  };
  
  

  // const getProfile = async () => {
  //   try {
  //     const getToken = localStorage.getItem("token");
  //     console.log(getToken, "token");
  //     const { data } = await axios.get(`${base_url}/accounts/users/`, {
  //       headers: {
  //         Authorization: `${getToken}`,
  //       },
  //     });
  //     console.log(data, "user in get profile data");
  //     setUser(data?.user);
  //   } catch (err) {
  //     console.log("🚀 ~ getClientProfile ~ err**********************:", err);
  //   } finally {
  //   }
  // };

  const login = async (loginData, onSuccess, onFailure) => {
    try {
      const { data } = await axios.post(`${base_url}/accounts/login/`, loginData);
      localStorage.setItem("token", data?.token);
      localStorage.setItem("role", data?.role); // Store role
  
      setToken(data?.token);
      setAuthanticated(true);
      getProfile(); // Fetch user profile after login
      setUser(data);
  
      // toast.success("Login successful! 🎉 Redirecting...", { position: "top-right" });
      onSuccess(data);
    } catch (err) {
      // toast.error(err?.response?.data?.message || "Login failed! Please check your credentials.", { position: "top-right" });
      onFailure(err);
    }
  };
  

  // const signup = async (signupData, onSuccess, onFailure) => {
  //   try {
  //     const { data } = await axios.post(`${base_url}/accounts/signup/`, signupData);
  //     onSuccess(data);
  //     console.log("🚀 ~ signup ~ data:", data);
  //   } catch (err) {
  //     onFailure(err);
  //     console.log("🚀 ~ signup ~ err:", err);
  //   } finally {
  //   }
  // };

  const signup = async (signupData, onSuccess, onFailure) => {
    try {
      const { data } = await axios.post(`${base_url}/accounts/signup/`, signupData, {
        headers: {
          "Content-Type": "multipart/form-data", // Important for file uploads
        },
      });
      // toast.success("Account created successfully! 🎉", { position: "top-right" });
      onSuccess(data);
      console.log("🚀 ~ signup ~ data:", data);
    } catch (err) {
      // toast.error("Signup failed. Please check your details.", { position: "top-right" });
      onFailure(err);
      console.log("🚀 ~ signup ~ err:", err);
    }
  };

  const values = {
    user,
    setUser,
    setSelectedRole,
    selectedRole,
    getProfile,
    login,
    signup,
    setAuthanticated,
    authanticated,
    logOut,
    userLoading,
    token,
    role,
    setRole,
    setToken,
  };
  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};
export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
