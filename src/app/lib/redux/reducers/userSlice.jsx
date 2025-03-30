"use client";

import { createSlice } from "@reduxjs/toolkit";

const usersSlice = createSlice({
  name: "users",
  initialState: {
    userSlug: "",
    userLocation: "",
  },
  reducers: {
    setUserSlug: (state, action) => {
      state.userSlug = action.payload;
    },
    setUserLocation: (state, action) => {
      state.userLocation = action.payload;
    },
  },
});

export const {
  setUserSlug,
  setUserLocation,
} = usersSlice.actions;
export default usersSlice.reducer;
