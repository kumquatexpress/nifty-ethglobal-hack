import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState, AppThunk } from "scripts/redux/store";

export interface EthState {
  address: string;
}

const initialState: EthState = {
  address: "",
};

export const ethSlice = createSlice({
  name: "eth",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setAddressTo: (state, action: PayloadAction<string>) => {
      state.address = action.payload;
    },
  },
});

export const selectAddress = (state: RootState) => state.eth.address;

export const { setAddressTo } = ethSlice.actions;

export default ethSlice.reducer;
