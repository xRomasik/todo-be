import { configureStore } from "@reduxjs/toolkit";
import { tasksApi } from "./tasksSlice";
import { uiSlice } from "./uiSlice";
import { useDispatch, useSelector } from "react-redux";

export const store = configureStore({
  reducer: {
    [tasksApi.reducerPath]: tasksApi.reducer,
    [uiSlice.reducerPath]: uiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(tasksApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
