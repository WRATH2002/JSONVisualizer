import { configureStore } from "@reduxjs/toolkit";
import dataSlice from "./dataSlice";
// import appSlice from "./appSlice";
// import chatSlice from "./chatSlice";

const store = configureStore({
  reducer: {
    data: dataSlice,
  },
});

export default store;
