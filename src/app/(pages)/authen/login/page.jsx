"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };
  const handleGoogleLogin = async () => {
    await signIn("google", { callbackUrl: "/" });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const response = await signIn("credentials", {
      redirect: false, // Quan trọng: Không redirect khi có lỗi
      email,
      password,
    });

    if (response?.error) {
      setError(response.error); // Hiển thị lỗi trên form
      toast.error(response.error);
    } else {
      toast.success("Login successful!");
      router.push("/"); // Chuyển hướng nếu thành công
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-xl flex max-w-4xl overflow-hidden">
        <div className="w-1/2 hidden md:block">
          <Slider {...settings}>
            {["autumn", "winter", "spring", "summer"].map((season) => (
              <div key={season}>
                <img
                  src={`/${season}.png`}
                  alt={season}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </Slider>
        </div>

        <div className="w-full md:w-1/2 p-10 bg-gray-50 dark:bg-gray-700">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">
            Welcome Back!
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8 text-center">
            Login to your account and start exploring seasonal decorations.
          </p>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="relative">
              <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="w-full pl-10 py-3 border rounded-lg focus:ring-2 focus:ring-orange-400"
                required
              />
            </div>

            <div className="relative">
              <FontAwesomeIcon icon={faLock} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-10 py-3 border rounded-lg focus:ring-2 focus:ring-orange-400"
                required
              />
            </div>

            <button type="submit" className="w-full py-3 bg-orange-400 text-white font-bold rounded-lg hover:shadow-lg transition-transform">
              Login
            </button>
          </form>

          <div className="mt-4 text-center">
            <button onClick={handleGoogleLogin} className="w-full py-3 flex items-center justify-center bg-blue-500 text-white font-bold rounded-lg hover:shadow-lg transition-transform">
              <FontAwesomeIcon icon={faGoogle} className="mr-2" /> Login with Google
            </button>
          </div>

          <p className="text-gray-600 dark:text-gray-300 text-center mt-8">
            Don't have an account? <Link href="/authen/signup" className="text-orange-500 hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
