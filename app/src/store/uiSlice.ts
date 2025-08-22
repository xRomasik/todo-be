import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Toast } from "../lib/components/Toast";
import type { FilterType } from "../features/task/components/TaskFilter";

type UiState = {
  filter: FilterType;
  toasts: Toast[];
  bulkOperations: {
    isCompletingAll: boolean;
    isDeletingAll: boolean;
  };
  isUILocked: boolean;
};

const initialState: UiState = {
  filter: "all",
  toasts: [],
  bulkOperations: {
    isCompletingAll: false,
    isDeletingAll: false,
  },
  isUILocked: false,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState: initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<FilterType>) => {
      state.filter = action.payload;
    },
    addToast: (state, action: PayloadAction<Omit<Toast, "id">>) => {
      const toast: Toast = {
        ...action.payload,
        id: Date.now().toString() + Math.random().toString(36).substring(2),
      };

      state.toasts.push(toast);
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter(
        (toast) => toast.id !== action.payload
      );
    },
    setBulkCompleteAllLoading: (state, action: PayloadAction<boolean>) => {
      state.bulkOperations.isCompletingAll = action.payload;
      state.isUILocked = action.payload || state.bulkOperations.isDeletingAll;
    },
    setBulkDeleteAllLoading: (state, action: PayloadAction<boolean>) => {
      state.bulkOperations.isDeletingAll = action.payload;
      state.isUILocked = action.payload || state.bulkOperations.isCompletingAll;
    },
  },
});

export const {
  setFilter,
  addToast,
  removeToast,
  setBulkCompleteAllLoading,
  setBulkDeleteAllLoading,
} = uiSlice.actions;
export const uiReducer = uiSlice.reducer;
