import { useAppSelector } from "../../store/redux";
import { ToastItem } from "./Toast";
import type { RootState } from "../../store/redux";

export const ToastContainer = () => {
  const toasts = useAppSelector((state: RootState) => state.ui.toasts);

  if (!toasts.length) {
    return null;
  }

  return (
    <div className="toasts">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
        />
      ))}
    </div>
  );
};
