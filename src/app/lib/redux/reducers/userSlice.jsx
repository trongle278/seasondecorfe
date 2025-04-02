"use client";

import { createSlice } from "@reduxjs/toolkit";


const usersSlice = createSlice({
  name: "users",
  initialState: {
    userSlug: "",
    userLocation: {
      code: "",
      province: "",
    },
  },
  reducers: {
    setUserSlug: (state, action) => {
      state.userSlug = action.payload;
    },
    setUserLocationCode: (state, action) => {
      state.userLocation.code = action.payload;
    },
    setUserLocationProvince: (state, action) => {
      state.userLocation.province = action.payload;
    },
    resetUserLocation: (state) => {
      state.userLocation.code = "";
      state.userLocation.province = "";
    },
  },
});

export const {
  setUserSlug,
  setUserLocationCode,
  setUserLocationProvince,
  resetUserLocation,
} = usersSlice.actions;
export default usersSlice.reducer;
