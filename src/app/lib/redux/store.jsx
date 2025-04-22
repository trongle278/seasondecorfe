"use client";

import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./reducers/userSlice";
import quotationSlice from "./reducers/quotationSlice";

const store = configureStore({
    reducer: {
        users: userSlice,
        quotation: quotationSlice,
    },
    // Thêm middleware thunk
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: true,
        serializableCheck: false,
      }),
  });

export default store;