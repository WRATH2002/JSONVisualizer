import { createSlice } from "@reduxjs/toolkit";

const dataSlice = createSlice({
  name: "data",
  initialState: {
    searchNodeArr: [],
  },
  reducers: {
    clearSearchNodeArr: (state) => {
      state.searchNodeArr = [];
    },
    updateSearchNodeArr: (state, action) => {
      state.searchNodeArr = action.payload;
    },
  },
});

export const { clearSearchNodeArr, updateSearchNodeArr } = dataSlice.actions;

export default dataSlice.reducer;
