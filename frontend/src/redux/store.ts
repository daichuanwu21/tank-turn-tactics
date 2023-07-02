import { configureStore } from "@reduxjs/toolkit";
import tanksReducer from "./tanksSlice";

export const store = configureStore({
  reducer: {
    tanks: tanksReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
