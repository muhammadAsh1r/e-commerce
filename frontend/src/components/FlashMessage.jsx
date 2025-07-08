import React, { useEffect } from "react";

const FlashMessage = ({ type = "info", message, onClose, duration = 3000 }) => {
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  // Colors based on type
  const bgColor =
    type === "success"
      ? "bg-green-500"
      : type === "error"
      ? "bg-red-500"
      : "bg-blue-500";

  return (
    <div
      className={`fixed top-5 right-5 z-50 px-4 py-2 rounded shadow-lg text-white font-semibold ${bgColor} cursor-pointer`}
      onClick={onClose}
      role="alert"
      aria-live="assertive"
    >
      {message}
    </div>
  );
};

export default FlashMessage;
