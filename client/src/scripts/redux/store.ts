import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import ethReducer from "scripts/redux/slices/ethSlice";

export const store = configureStore({
  reducer: { eth: ethReducer },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
