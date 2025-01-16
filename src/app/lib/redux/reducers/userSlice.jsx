"use client";

import { createSlice } from "@reduxjs/toolkit";

const usersSlice = createSlice({
  name: "users",
  initialState: {
    usersList: [],
    updateUser: {},
    detailUser: {},
    userHistory: [],
    currentUser: null,
  },
  reducers: {
    setUsersList: (state, action) => {
      state.usersList = action.payload;
    },
    setUpdateUser: (state, action) => {
      state.updateUser = action.payload;
    },
    setDetailUser: (state, action) => {
      state.detailUser = action.payload;
    },
    setUserHistory: (state, action) => {
      state.userHistory = action.payload;
    },
    setCurrentUser: {
      reducer: (state, action) => {
        state.currentUser = action.payload.user; // Only store the user data
      },
      prepare: (user) => ({ payload: { user } }), // Payload creator
    },
    clearCurrentUser: (state) => {
        state.currentUser = null;
        sessionStorage.removeItem("token"); // Xóa khỏi sessionStorage
        sessionStorage.removeItem("user"); // Xóa khỏi sessionStorage
    },
  },
});

export const {
  setUsersList,
  setUpdateUser,
  setDetailUser,
  setUserHistory,
  setCurrentUser,
  clearCurrentUser,
} = usersSlice.actions;
export default usersSlice.reducer;
