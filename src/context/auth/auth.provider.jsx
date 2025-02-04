import { createContext, useContext, useEffect, useState } from "react";
import { LoadingContext } from "../loading/loading.provider";
import { base_url } from "../../config/config";
import axios from "axios";

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
      console.log(getToken, "token");
      const { data } = await axios.get(`${base_url}/user/profile`, {
        headers: {
          Authorization: `${getToken}`,
        },
      });
      console.log(data, "user in get profile data");
      setUser(data?.user);
    } catch (err) {
      console.log("🚀 ~ getClientProfile ~ err**********************:", err);
    } finally {
    }
  };

  const login = async (loginData, onSuccess, onFailure) => {
    try {
      const { data } = await axios.post(`${base_url}/user/login`, loginData);
      localStorage.setItem("token", data?.token);
      setToken(data?.token);
      setAuthanticated(true);
      setUser(data);
      onSuccess(data);
    } catch (err) {
      console.log("🚀 ~ login ~ err:", err);
      onFailure(err);
    } finally {
    }
  };

  const signup = async (signupData, onSuccess, onFailure) => {
    try {
      const { data } = await axios.post(`${base_url}/user/signup`, signupData);
      onSuccess(data);
      console.log("🚀 ~ signup ~ data:", data);
    } catch (err) {
      onFailure(err);
      console.log("🚀 ~ signup ~ err:", err);
    } finally {
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
