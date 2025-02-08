
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faLock, faPhone, faMapMarkerAlt, faVenusMars } from "@fortawesome/free-solid-svg-icons";

export default function SignUp() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    gender: "male",
    roleId: 2,
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 🚨 Kiểm tra dữ liệu đầu vào
  const validateForm = () => {
    const { email, password, confirmPassword, firstName, lastName, phone, address } = formData;

    if (!/^[a-zA-Z\s]+$/.test(firstName) || !/^[a-zA-Z\s]+$/.test(lastName)) {
      toast.error("First Name and Last Name must contain only letters.");
      return false;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Invalid email format.");
      return false;
    }

    if (!/^\d{10,12}$/.test(phone)) {
      toast.error("Phone number must be 10-12 digits.");
      return false;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return false;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      setFormData({ ...formData, password: "", confirmPassword: "" }); // Clear mật khẩu
      return false;
    }

    if (!address.trim()) {
      toast.error("Address is required.");
      return false;
    }

    return true;
  };

  // 🛠️ Xử lý đăng ký
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("Account created successfully! Redirecting...");
        sessionStorage.setItem("token", data.token); // Lưu token
        setTimeout(() => router.push("/"), 2000);
      } else {
        toast.error(data.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Signup Error:", error);
      toast.error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
    <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-xl flex max-w-2xl w-full overflow-hidden">
      <div className="w-1/2 hidden md:block">
        <Slider {...settings}>
          {["autumn", "winter", "spring", "summer"].map((season) => (
            <div key={season}>
              <img src={`/${season}.png`} alt={season} className="w-full h-full object-cover" />
            </div>
          ))}
        </Slider>
      </div>
  
      {/* Right Side: Sign Up Form (Nhỏ hơn) */}
      <div className="w-1/2 p-4 bg-gray-50 dark:bg-gray-700 max-w-sm">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 text-center ">Create Your Account</h2>
        
        <form className="space-y-3 mt-5" onSubmit={handleSubmit}>
          {/* First & Last Name */}
          <div className="grid grid-cols-2 gap-2">
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" className="w-full py-2 px-3 text-sm border rounded-lg focus:ring-2 focus:ring-orange-400" required />
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" className="w-full py-2 px-3 text-sm border rounded-lg focus:ring-2 focus:ring-orange-400" required />
          </div>
  
          {/* Email */}
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" className="w-full py-2 px-3 text-sm border rounded-lg focus:ring-2 focus:ring-orange-400" required />
  
          {/* Phone */}
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" className="w-full py-2 px-3 text-sm border rounded-lg focus:ring-2 focus:ring-orange-400" required />
  
          {/* Address */}
          <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" className="w-full py-2 px-3 text-sm border rounded-lg focus:ring-2 focus:ring-orange-400" required />
  
          {/* Gender */}
          <select name="gender" value={formData.gender} onChange={handleChange} className="w-full py-2 px-3 text-sm border rounded-lg focus:ring-2 focus:ring-orange-400">
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
  
          {/* Password & Confirm Password */}
          <div className="grid grid-cols-2 gap-2">
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" className="w-full py-2 px-3 text-sm border rounded-lg focus:ring-2 focus:ring-orange-400" required />
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm Password" className="w-full py-2 px-3 text-sm border rounded-lg focus:ring-2 focus:ring-orange-400" required />
          </div>
  
          {/* Submit Button */}
          <button className="w-full py-2.5 bg-orange-500 text-white font-bold text-sm rounded-lg hover:shadow-lg transition-transform">
            {loading ? "Creating Account..." : "Create Account"}
          </button>
  
          {/* Link to Login */}
          <p className="text-center text-gray-600 dark:text-gray-400 mt-3 text-sm">
            Already have an account?{" "}
            <Link href="/authen/login" className="text-orange-500 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  </div>    
  );
}

