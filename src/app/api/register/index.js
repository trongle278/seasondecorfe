import BaseRequest from "@/app/lib/api/config/Axios-config";
import nProgress from "nprogress";
import "nprogress/nprogress.css";

const SUB_URL = `api/Auth`;

export const RegisterCustomer = async (userData) => {
  try {
    console.log("Registering user:", userData);
    nProgress.start();
    const res = await BaseRequest.Post(
      `/${SUB_URL}/register-customer`,
      userData
    );
    return res;
  } catch (error) {
    return error;
  } finally {
    nProgress.done();
  }
};

export const VerifyEmail = async (userData) => {
  try {
    console.log("Verifying email:", userData);
    nProgress.start();
    const res = await BaseRequest.Post(
      `/${SUB_URL}/verify-email`,
      userData
    );
    return res;
  } catch (error) {
    return error;
  } finally {
    nProgress.done();
  }
};
