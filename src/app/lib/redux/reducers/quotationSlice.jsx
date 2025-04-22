"use client";

import { createSlice } from "@reduxjs/toolkit";


const quotationSlice = createSlice({
  name: "quotation",
  initialState: {
    quotationExisted: false,
    quotationSigned: false,
    
  },
  reducers: {
    setQuotationExisted: (state, action) => {
      state.quotationExisted = action.payload;
    },  
    resetQuotationExisted: (state) => {
      state.quotationExisted = false;
    },
    setQuotationSigned: (state, action) => {
      state.quotationSigned = action.payload;
    },
    resetQuotationSigned: (state) => {
      state.quotationSigned = false;
    },
  },
});

export const {
  setQuotationExisted,
  resetQuotationExisted,
  setQuotationSigned,
  resetQuotationSigned,
} = quotationSlice.actions;
export default quotationSlice.reducer;
