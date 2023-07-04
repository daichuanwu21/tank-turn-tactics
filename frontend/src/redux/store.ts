import { configureStore } from "@reduxjs/toolkit";
import { gameApi } from "./game-api";
import authReducer from "./auth-slice";
import { authApi } from "./auth-api";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [gameApi.reducerPath]: gameApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([gameApi.middleware, authApi.middleware]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
