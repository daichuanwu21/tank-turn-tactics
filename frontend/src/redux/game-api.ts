import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { createEntityAdapter } from "@reduxjs/toolkit";
import type { EntityState } from "@reduxjs/toolkit";
import SocketIOManager from "../socket-io-manager";

export interface ITankDocument {
  id: string;
  healthPoints: number;
  actionPoints?: number;
  range: number;
  positionX: number;
  positionY: number;
  displayName: string;
}

const tanksAdapter = createEntityAdapter<ITankDocument>();
export const gameApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: `${
      process.env.REACT_APP_API_USE_HTTPS === "YES" ? "https://" : "http://"
    }${process.env.REACT_APP_API_DOMAIN}/`,
  }),
  endpoints: (build) => ({
    tanks: build.query<EntityState<ITankDocument>, undefined>({
      query: () => "initial-tank-sync",
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
  }),
});

export const { useTanksQuery } = gameApi;
