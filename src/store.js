import { configureStore } from "@reduxjs/toolkit";
import tanksReducer from "./redux/tanksSlice";

export const store = configureStore({
  reducer: {
    tanks: tanksReducer,
  },
});
