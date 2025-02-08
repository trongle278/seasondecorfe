import { NextResponse } from "next/server";
import BaseRequest from "../../../lib/api/config/Axios-config";

export async function POST(req) {
  try {
    const { email, password, firstName, lastName, phone, address, gender, roleId } = await req.json();

    // 🚨 Validate dữ liệu đầu vào
    if (!email || !password || !firstName || !lastName || !phone || !address) {
      return NextResponse.json({ success: false, message: "All fields are required." }, { status: 400 });
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ success: false, message: "Invalid email format." }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ success: false, message: "Password must be at least 8 characters." }, { status: 400 });
    }

    if (!/^\d{10,12}$/.test(phone)) {
      return NextResponse.json({ success: false, message: "Phone number must be 10-12 digits." }, { status: 400 });
    }

    // 🛠️ Gửi thông tin đăng ký lên backend
    const response = await BaseRequest.Post("/api/auth/register", {
      email,
      password,
      firstName,
      lastName,
      phone,
      address,
      gender,
      roleId,
    });

    // 🎯 Kiểm tra phản hồi từ backend
    if (response?.success && response?.token) {
      return NextResponse.json({ success: true, token: response.token });
    } else {
      return NextResponse.json({ success: false, message: response?.message || "Registration failed" }, { status: 400 });
    }
  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json(
      { success: false, message: error.response?.data?.message || "Something went wrong." },
      { status: 500 }
    );
  }
}
