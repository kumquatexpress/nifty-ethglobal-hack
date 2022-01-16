import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState, AppThunk } from "scripts/redux/store";

export interface EthState {
  address: string;
  user_id: string;
}

const initialState: EthState = {
  address: "",
  user_id: "",
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
    // Use the PayloadAction type to declare the contents of `action.payload`
    setUserIdTo: (state, action: PayloadAction<string>) => {
      state.user_id = action.payload;
    },
  },
});

export const selectAddress = (state: RootState) => state.eth.address;
export const selectUserId = (state: RootState) => state.eth.user_id;

export const { setAddressTo, setUserIdTo } = ethSlice.actions;

export default ethSlice.reducer;
