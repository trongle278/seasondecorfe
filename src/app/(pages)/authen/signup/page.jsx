
"use client";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import ThemeSwitch from "./../../../components/ThemeSwitch";
import Link from "next/link";

export default function SignUp() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    appendDots: (dots) => (
      <div
        style={{
          bottom: "-15px",
          position: "relative",
        }}
        className="dark:bg-gray-800"
      >
        <ul className="slick-dots">{dots}</ul>
      </div>
    ),
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Account created successfully");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-orange-200 via-yellow-100 to-green-200 dark:from-gray-800 dark:to-gray-900">
      <div className="absolute top-5 right-5">
        <ThemeSwitch />
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-xl flex max-w-4xl overflow-hidden">
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

        {/* Right Side: Sign Up Form */}
        <div className="w-full md:w-1/2 p-10 bg-gradient-to-br from-white to-gray-100 dark:from-gray-700 dark:to-gray-800">
<h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4 text-center">
  Create Your Account
</h2>
<p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
  Start exploring seasonal decorations for your home.
</p>

{/* Form */}
<form className="space-y-5">
  {/* Full Name Input */}
  <div className="relative">
    <FontAwesomeIcon
      icon={faUser}
      className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400 dark:text-gray-300"
    />
    <input
      type="text"
      placeholder="Full Name"
      className="w-full pl-10 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
      required
    />
  </div>

  {/* Email Input */}
  <div className="relative">
    <FontAwesomeIcon
      icon={faEnvelope}
      className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400 dark:text-gray-300"
    />
    <input
      type="email"
      placeholder="Email Address"
      className="w-full pl-10 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
      required
    />
  </div>

  {/* Password Input */}
  <div className="relative">
    <FontAwesomeIcon
      icon={faLock}
      className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400 dark:text-gray-300"
    />
    <input
      type="password"
      placeholder="Password"
      className="w-full pl-10 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
      required
    />
  </div>

  {/* Confirm Password Input */}
  <div className="relative">
    <FontAwesomeIcon
      icon={faLock}
      className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400 dark:text-gray-300"
    />
    <input
      type="password"
      placeholder="Confirm Password"
      className="w-full pl-10 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
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

<p className="text-center text-gray-600 dark:text-gray-300 mt-6">
  Already have an account?{" "}
  <Link href="/authen/login" className="text-orange-500 hover:underline">
    Login
  </Link>
</p>

</div>
</div>


    </div>
  );
}
