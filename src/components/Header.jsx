import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { AuthContext }  from "../context/auth/auth.provider";

const Header = ({ links = [] }) => {
  const { authanticated, logOut } = useContext(AuthContext);
  const navigation = useNavigate();
  const handleLogout = () => {
    logOut();
    navigation("/login");
  };

  return (
    <header className="flex p-4 sticky top-0">
      <div className="hidden md:flex space-x-4">
        <Link to="/Home">
          <img src={logo} alt="Logo" className="w-25 h-10" />
        </Link>
      </div>

      <nav className="flex items-center">
        <div className="flex space-x-4">
          {authanticated ? (
            <button
              onClick={handleLogout}
              className="text-black px-3 py-2 font-bold text-xl leading-tight tracking-wide rounded-lg opacity-70"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/Login"
                className="text-black px-3 py-2 font-bold text-xl leading-tight tracking-wide rounded-lg opacity-70"
              >
                Login
              </Link>
              <Link
                to="/Signup"
                className="text-black px-3 py-2 font-bold text-xl leading-tight tracking-wide rounded-lg opacity-70"
              >
                Signup
              </Link>
            </>
          )}
          {links.length>0 && links.map((link, index) => (
            <Link
              key={index}
              to={link?.to}
              className="text-black px-3 py-2 font-bold text-xl leading-tight tracking-wide rounded-lg opacity-70"
            >
              <h1>{link?.label}</h1>
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default Header;
