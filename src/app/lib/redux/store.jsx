"use client";

import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./reducers/userSlice";


const store = configureStore({
    reducer: {
        users: userSlice,
    },
    // Thêm middleware thunk
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: true,
        serializableCheck: false,
      }),
  });

export default store;