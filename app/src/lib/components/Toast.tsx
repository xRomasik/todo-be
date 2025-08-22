import { useEffect, useState } from "react";
import { useAppDispatch } from "../../store/redux";
import { removeToast } from "../../store/uiSlice";

export type Toast = {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
};

type ToastType = "error" | "success" | "warning" | "info";

export const ToastItem = (props: Toast) => {
  const { id, message, type, duration } = props;
  const [isVisible, setIsVisible] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setIsVisible(true);

    const removeTimer = setTimeout(() => {
      setIsVisible(false);
      dispatch(removeToast(id));
    }, duration || 3000);

    return () => {
      clearTimeout(removeTimer);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    dispatch(removeToast(id));
  };

  return (
    <div
      className={`toast toast--${type} ${isVisible ? "toast--visible" : ""}`}
    >
      <div className="toast__content">
        <span className="toast__icon">
          {type === "error" && "❌"}
          {type === "success" && "✅"}
          {type === "warning" && "⚠️"}
          {type === "info" && "ℹ️"}
        </span>
        <span className="toast__message">{message}</span>
      </div>
      <button
        className="toast__close"
        onClick={handleClose}
        aria-label="Zavřít notifikaci"
      >
        ✕
      </button>
    </div>
  );
};
