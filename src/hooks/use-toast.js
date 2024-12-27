"use client";
// Inspired by react-hot-toast library
import { useState, useEffect } from "react";

const TOAST_TIMEOUT = 5000;

export function useToast() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setToasts((currentToasts) =>
        currentToasts.filter((toast) => {
          return toast.timestamp + TOAST_TIMEOUT > Date.now();
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const toast = ({ title, description, variant = "default" }) => {
    const id = Date.now();
    const newToast = {
      id,
      title,
      description,
      variant,
      timestamp: Date.now(),
    };

    setToasts((currentToasts) => [...currentToasts, newToast]);

    // Auto remove after timeout
    setTimeout(() => {
      setToasts((currentToasts) =>
        currentToasts.filter((toast) => toast.id !== id)
      );
    }, TOAST_TIMEOUT);
  };

  return {
    toast,
    toasts,
    dismiss: (id) =>
      setToasts((currentToasts) =>
        currentToasts.filter((toast) => toast.id !== id)
      ),
  };
}
