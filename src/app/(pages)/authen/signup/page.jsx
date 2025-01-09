"use client";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";

export default function SignUp() {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        appendDots: (dots) => (
          <div style={{ bottom: '-15px', position: 'relative' }}>{dots}</div>
        ),
      };
      

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-300 via-yellow-200 to-green-300">
      <div className="bg-gradient-to-r from-gray-100 to-gray-200 shadow-2xl rounded-xl flex max-w-5xl overflow-hidden">
        {/* Left Side - Slider */}
        <div className="w-1/2 hidden md:block">
          <Slider {...settings}>
            <div>
              <img
                src="/autumn.png"
                alt="Autumn"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <img
                src="/winter.png"
                alt="Winter"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <img
                src="/spring.png"
                alt="Spring"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <img
                src="/summer.png"
                alt="Summer"
                className="w-full h-full object-cover"
              />
            </div>
          </Slider>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-10 bg-gradient-to-br from-white to-gray-100">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
            Create Your Account
          </h2>
          <p className="text-gray-600 mb-6 text-center">
            Start exploring seasonal decorations for your home.
          </p>

          {/* Form */}
          <form className="space-y-5">
            {/* Full Name Input */}
            <div className="relative">
              <FontAwesomeIcon
                icon={faUser}
                className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400"
              />
              <input
                type="text"
                placeholder="Full Name"
                className="w-full pl-10 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                required
              />
            </div>

            {/* Email Input */}
            <div className="relative">
              <FontAwesomeIcon
                icon={faEnvelope}
                className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400"
              />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full pl-10 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                required
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <FontAwesomeIcon
                icon={faLock}
                className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400"
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full pl-10 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                required
              />
            </div>

            {/* Confirm Password Input */}
            <div className="relative">
              <FontAwesomeIcon
                icon={faLock}
                className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400"
              />
              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full pl-10 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-orange-400 to-green-400 text-white font-bold rounded-lg hover:shadow-lg hover:scale-105 transition-transform"
            >
              Create Account
            </button>
          </form>

          <p className="text-center text-gray-600 mt-6">
            Already have an account?{" "}
            <a href="/login" className="text-orange-500 hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
