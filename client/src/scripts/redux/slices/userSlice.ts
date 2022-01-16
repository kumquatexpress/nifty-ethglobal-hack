import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState, AppThunk } from "scripts/redux/store";

export interface UserState {
  user_id: string;
}

const initialState: UserState = {
  user_id: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setUserIdTo: (state, action: PayloadAction<string>) => {
      state.user_id = action.payload;
    },
  },
});

export const selectUserId = (state: RootState) => state.user.user_id;

export const { setUserIdTo } = userSlice.actions;

export default userSlice.reducer;
