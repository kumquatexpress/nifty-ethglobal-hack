import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState, AppThunk } from "scripts/redux/store";
import { RGBAColor, BadgeDataType, BadgeDataColor } from "scripts/types";

export interface CollectionState {
  name: string;
  numBadges: number;
  royalties: number;
  cost: number;
  percentCommon: number;

  badgeData: BadgeDataType;
}

const initialState: CollectionState = {
  name: "",
  numBadges: 100,
  royalties: 10,
  cost: 5.0,
  percentCommon: 50,
  badgeData: {
    imgFile: null,
    imgSrc: null,
    colors: {
      fontStroke: {
        r: 0,
        g: 0,
        b: 0,
        a: 1,
      },
      fontFill: {
        r: 0,
        g: 0,
        b: 0,
        a: 1,
      },
      background: {
        r: 255,
        g: 255,
        b: 255,
        a: 1,
      },
      rare: {
        r: 255,
        g: 238,
        b: 46,
        a: 1,
      },
      common: {
        r: 224,
        g: 224,
        b: 224,
        a: 1,
      },
      uncommon: {
        r: 51,
        g: 166,
        b: 255,
        a: 1,
      },
    },
    hugImage: false,
  },
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
      state.numBadges = action.payload;
    },
    setRoyalties: (state, action: PayloadAction<number>) => {
      state.royalties = action.payload;
    },
    setCost: (state, action: PayloadAction<number>) => {
      state.cost = action.payload;
    },

    setPercentCommon: (state, action: PayloadAction<number>) => {
      state.percentCommon = action.payload;
    },
    setColor: (
      state,
      action: PayloadAction<{ key: BadgeDataColor; color: RGBAColor }>
    ) => {
      state.badgeData.colors[action.payload.key] = action.payload.color;
    },
    setHugImage: (state, action: PayloadAction<boolean>) => {
      state.badgeData.hugImage = action.payload;
    },

    setImageSrc: (state, action: PayloadAction<string>) => {
      state.badgeData.imgSrc = action.payload;
    },
    setImageFile: (state, action: PayloadAction<string>) => {
      state.badgeData.imgFile = action.payload;
    },
  },
});

export const selectCollection = (state: RootState) => state.collection;

export const {
  setNumBadges,
  setRoyalties,
  setCost,
  setName,
  setPercentCommon,
  setColor,
  setHugImage,
  setImageSrc,
  setImageFile,
} = collectionSlice.actions;

export default collectionSlice.reducer;
