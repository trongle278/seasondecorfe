"use client";
import Slider from "react-slick";
import { useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-orange-200 via-yellow-100 to-green-200">
      <div className="bg-white shadow-2xl rounded-xl flex max-w-4xl overflow-hidden">
        {/* Left Side: Carousel */}
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

        {/* Right Side: Login Form */}
        <div className="w-full md:w-1/2 p-10 bg-gradient-to-br from-white to-gray-100">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Welcome Back!
          </h2>
          <p className="text-gray-600 mb-8 text-center">
            Login to your account and start exploring seasonal decorations.
          </p>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="relative">
              <FontAwesomeIcon
                icon={faEnvelope}
                className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400"
              />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-10 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-orange-400 to-green-400 text-white font-bold rounded-lg hover:shadow-lg hover:scale-105 transition-transform"
            >
              Login
            </button>
          </form>

          <p className="text-gray-600 text-center mt-8">
            Don't have an account?{" "}
            <a href="/signup" className="text-orange-500 hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
