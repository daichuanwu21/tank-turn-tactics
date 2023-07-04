import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ILoginResponse } from "./auth-api";

export interface IAuthState {
  loggedIn: boolean;
  token: null | string;
  email: null | string;
  userId: null | string;
  tankId: null | string;
}

const getSavedCredentials = (): IAuthState => {
  const authString = localStorage.getItem("auth");
  if (!authString)
    return {
      loggedIn: false,
      token: null,
      email: null,
      userId: null,
      tankId: null,
    };

  const authObj = JSON.parse(authString) as Omit<IAuthState, "loggedIn">;
  return {
    loggedIn: true,
    ...authObj,
  };
};

const initialState: IAuthState = getSavedCredentials();

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<ILoginResponse>) => {
      state.loggedIn = true;
      state.token = action.payload.token;
      state.email = action.payload.email;
      state.userId = action.payload.userId;
      state.tankId = action.payload.tankId;
    },
    logout: (state) => {
      state.loggedIn = false;
      state.token = null;
      state.email = null;
      state.userId = null;
      state.tankId = null;
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
