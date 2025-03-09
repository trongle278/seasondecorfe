"use client";

import { createSlice } from "@reduxjs/toolkit";

const usersSlice = createSlice({
  name: "users",
  initialState: {
    userSlug: "",
  },
  reducers: {
    setUserSlug: (state, action) => {
      state.userSlug = action.payload;
    },
  },
});

export const {
  setUserSlug,
} = usersSlice.actions;
export default usersSlice.reducer;
