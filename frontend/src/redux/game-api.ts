import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { createEntityAdapter } from "@reduxjs/toolkit";
import type { EntityState } from "@reduxjs/toolkit";
import SocketIOManager from "../socket-io-manager";
import { RootState } from "./store";
import * as constants from "../constants";

export interface ITankDocument {
  id: string;
  healthPoints: number;
  actionPoints?: number;
  range: number;
  positionX: number;
  positionY: number;
  displayName: string;
}

interface IGenericSuccessResponse {
  detail: string;
}

interface IMoveRequest {
  positionX: number;
  positionY: number;
}

interface IOtherTankInteractionRequest {
  targetTankId: string;
}

const tanksAdapter = createEntityAdapter<ITankDocument>();
export const gameApi = createApi({
  reducerPath: "gameApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${constants.API_ENDPOINT}/tank/`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (build) => ({
    tanks: build.query<EntityState<ITankDocument>, undefined>({
      query: () => `${constants.API_ENDPOINT}/initial-tank-sync`,
      transformResponse(response: ITankDocument[]) {
        return tanksAdapter.addMany(tanksAdapter.getInitialState(), response);
      },
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        const socket = SocketIOManager.socket("/tank-events", {
          retries: Infinity,
        });
        try {
          await cacheDataLoaded;

          socket.on("insert", (ev) => {
            updateCachedData((draft) => {
              tanksAdapter.addOne(draft, JSON.parse(ev));
            });
          });

          socket.on("update", (ev) => {
            updateCachedData((draft) => {
              tanksAdapter.updateOne(draft, JSON.parse(ev));
            });
          });

          socket.on("delete", (ev) => {
            updateCachedData((draft) => {
              tanksAdapter.removeOne(draft, JSON.parse(ev).id);
            });
          });
        } catch {}

        await cacheEntryRemoved;
        socket.disconnect();
      },
    }),
    move: build.mutation<IGenericSuccessResponse, IMoveRequest>({
      query: (moveReq) => ({
        url: "move",
        method: "POST",
        body: moveReq,
      }),
    }),
    addHealthPoint: build.mutation<IGenericSuccessResponse, {}>({
      query: () => ({
        url: "add-health-point",
        method: "POST",
      }),
    }),
    upgradeRange: build.mutation<IGenericSuccessResponse, {}>({
      query: () => ({
        url: "upgrade-range",
        method: "POST",
      }),
    }),
    shoot: build.mutation<
      IGenericSuccessResponse,
      IOtherTankInteractionRequest
    >({
      query: (targetTankReq) => ({
        url: "shoot",
        method: "POST",
        body: targetTankReq,
      }),
    }),
    giveActionPoint: build.mutation<
      IGenericSuccessResponse,
      IOtherTankInteractionRequest
    >({
      query: (targetTankReq) => ({
        url: "give-action-point",
        method: "POST",
        body: targetTankReq,
      }),
    }),
    giveHealthPoint: build.mutation<
      IGenericSuccessResponse,
      IOtherTankInteractionRequest
    >({
      query: (targetTankReq) => ({
        url: "give-health-point",
        method: "POST",
        body: targetTankReq,
      }),
    }),
    actionPoints: build.query<IGenericSuccessResponse & { ap: number }, {}>({
      query: () => ({
        url: "ap",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useTanksQuery,
  useMoveMutation,
  useAddHealthPointMutation,
  useUpgradeRangeMutation,
  useShootMutation,
  useGiveActionPointMutation,
  useGiveHealthPointMutation,
  useActionPointsQuery,
} = gameApi;
