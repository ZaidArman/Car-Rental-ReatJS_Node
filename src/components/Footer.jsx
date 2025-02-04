import React from 'react';

const Footer = () => {
  return (
    <div className="bg-black text-white py-8 w-full">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-bold mb-4 ml-2">
            READY FOR THE <br /> NEW <span className="text-red-500">  ERA?</span>
          </h2>
          <p className='ml-2'> Contact US</p>
          <p className='ml-2'>manas4808294@gmail.com</p>
        </div>
        <div className="text-center md:text-right">
          <p>@2024 Car Rental Hub All Rights Reserved</p>
        </div>
        <div className="flex space-x-4">
          <a href="#" className="text-white hover:text-gray-400">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="#" className="text-white hover:text-gray-400">
            <i className="fab fa-facebook"></i>
          </a>
          <a href="#" className="text-white hover:text-gray-400">
            <i className="fab fa-instagram"></i>
          </a>
        </div>
        <div className="text-center md:text-left">
          <a href="termsandconditions" className="text-white hover:text-gray-400 mr-2">
            Terms & Conditions
          </a>
        </div>
      </div>
    </div>
  );
};

export default Footer;