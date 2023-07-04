import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import * as constants from "../constants";

interface ILoginRequest {
  email: string;
  password: string;
}

export interface ILoginResponse {
  token: string;
  email: string;
  userId: string;
  tankId: string;
}

interface IRegisterRequest {
  email: string;
  password: string;
  invite_code: string;
}

interface IRegisterResponse {
  detail: string;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${constants.API_ENDPOINT}/user/`,
  }),
  endpoints: (build) => ({
    login: build.mutation<ILoginResponse, ILoginRequest>({
      query: (credentials) => ({
        url: "login",
        method: "POST",
        body: credentials,
      }),
    }),
    register: build.mutation<IRegisterResponse, IRegisterRequest>({
      query: (credentials) => ({
        url: "register",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = authApi;
