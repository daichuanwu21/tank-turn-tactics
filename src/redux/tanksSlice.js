import { createSlice } from "@reduxjs/toolkit";

export const tanksSlice = createSlice({
  name: "tanks",
  initialState: [],
  reducers: {
    // NOTE: THESE ARE PLACEHOLDER REDUCERS WITH NO CONNECTION TO BACKEND
    // TODO: replace all sync logic with RTK query upsert
    initialSync: (_, action) => {
      // expects array of Tank objects as payload
      return action.payload;
    },
    addTank: (state, action) => {
      // expects one Tank object as payload
      state.push(action.payload);
    },
    removeTank: (state, action) => {
      // expects uuid as payload
      const changedState = state.filter((tank) => tank.uuid !== action.payload);
      return changedState;
    },
    updateTank: (state, action) => {
      // expects one existing* Tank object as payload (*already in array)
      const targetTank = state.filter(
        (tank) => tank.uuid === action.payload.uuid
      );

      targetTank[0].coordinateX = action.payload.coordinateX;
      targetTank[0].coordinateY = action.payload.coordinateY;
      targetTank[0].range = action.payload.range;
      targetTank[0].health = action.payload.health;
      if (action.payload.ap) targetTank[0].ap = action.payload.ap;
    },
  },
});

export const { initialSync, addTank, removeTank, updateTank } =
  tanksSlice.actions;

export default tanksSlice.reducer;
