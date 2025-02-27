import BaseRequest from "@/app/lib/api/config/Axios-config";

const SUB_URL = `api/Auth`;

export const RegisterCustomer = async (userData) => {
  try {
    console.log("Registering user:", userData);
    const res = await BaseRequest.Post(
      `/${SUB_URL}/register-customer`,
      userData
    );
    return res;
  } catch (error) {
    return error;
  }
};

export const VerifyEmail = async (userData) => {
  try {
    console.log("Verifying email:", userData);
    const res = await BaseRequest.Post(`/${SUB_URL}/verify-email`, userData);
    return res;
  } catch (error) {
    return error;
  }
};
