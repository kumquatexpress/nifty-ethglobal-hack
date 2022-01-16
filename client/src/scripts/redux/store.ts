import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import userReducer from "@scripts/redux/slices/userSlice";
import ethReducer from "@scripts/redux/slices/ethSlice";
import collectionReducer from "@scripts/redux/slices/collectionSlice";

export const store = configureStore({
  reducer: {
    eth: ethReducer,
    collection: collectionReducer,
    user: userReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
