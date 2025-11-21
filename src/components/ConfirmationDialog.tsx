// components/ConfirmationDialog.tsx
"use client";

import { useState, useEffect } from "react";
import { ConfirmationDialogProps } from "@/interfaces/comfirmation-dialog";

export default function ConfirmationDialog({
  isOpen,
  title,
  message,
  confirmText = "Konfirmasi",
  cancelText = "Batal",
  isDangerous = false,
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    }
  }, [isOpen]);

  const handleConfirm = async () => {
    console.log("Confirm button clicked");

    try {
      await onConfirm();
    } catch (error) {
      console.error("Error in onConfirm:", error);
    }

    // Tutup animasi modal setelah konfirmasi selesai
    setIsAnimating(false);

    setTimeout(() => {
      onCancel(); // biar parent matiin isOpen
    }, 300); // sama kayak cancel agar konsisten
  };

  const handleCancel = () => {
    console.log("Cancel button clicked");
    setIsAnimating(false);
    setTimeout(() => {
      onCancel();
    }, 300);
  };

  if (!isOpen && !isAnimating) return null;

  const buttonColor = isDangerous
    ? "bg-red-600 hover:bg-red-700"
    : "bg-blue-600 hover:bg-blue-700";

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black z-40 transition-opacity duration-300 ${
          isAnimating ? "opacity-50" : "opacity-0 pointer-events-none"
        }`}
        onClick={handleCancel}
      />

      {/* Dialog */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
          isAnimating
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`bg-white dark:bg-zinc-800 rounded-lg shadow-xl max-w-sm w-full mx-4 transform transition-all duration-300 ${
            isAnimating ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-700">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
              {title}
            </h2>
          </div>

          {/* Body */}
          <div className="px-6 py-4">
            <p className="text-zinc-600 dark:text-zinc-300">{message}</p>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-700 flex gap-3 justify-end">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isLoading}
              className="pointer-events-auto px-4 py-2 text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-700 rounded hover:bg-zinc-200 dark:hover:bg-zinc-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isLoading}
              className={`pointer-events-auto px-4 py-2 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${buttonColor}`}
            >
              {isLoading ? "Loading..." : confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
