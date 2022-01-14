import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState, AppThunk } from "scripts/redux/store";

export interface CollectionState {
  numBadges: number;
  imgSrc: string | null;
  imgFile: File | null;
  canvasSize: number;
  name: string;
}

const initialState: CollectionState = {
  name: "",
  numBadges: 100,
  canvasSize: 150,
  imgFile: null,
  imgSrc: null,
};

export const collectionSlice = createSlice({
  name: "collection",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setNumBadges: (state, action: PayloadAction<number>) => {
      console.log(action);
      state.numBadges = action.payload;
    },
  },
});

export const selectCollection = (state: RootState) => state.collection;

export const { setNumBadges, setName } = collectionSlice.actions;

export default collectionSlice.reducer;
