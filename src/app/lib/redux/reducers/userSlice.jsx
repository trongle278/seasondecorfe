"use client";

import { createSlice } from "@reduxjs/toolkit";

const usersSlice = createSlice({
  name: "users",
  initialState: {
    isProviderSigned: "",
  },
  reducers: {
    setIsProviderSigned: (state, action) => {
      state.isProviderSigned = action.payload;
    },
  },
});

export const {
  setIsProviderSigned,
} = usersSlice.actions;
export default usersSlice.reducer;
