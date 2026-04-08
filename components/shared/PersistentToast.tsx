"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { useNotifications } from "@/context/NotificationContext";
import { Notification, NotificationAction } from "@/types/notification";

interface PersistentToastProps {
  notification: Notification;
  onDismiss?: (id: string) => void;
}

export function PersistentToast({ notification, onDismiss }: PersistentToastProps) {
  const { markAsRead, removeNotification } = useNotifications();

  useEffect(() => {
    const toastId = toast.custom(
      (id) => {
        const handleAction = (action: NotificationAction) => {
          switch (action) {
            case "undo":
              // Lógica para deshacer
              console.log("Undo action for notification:", notification.id);
              break;
            case "view":
              // Lógica para ver detalles
              console.log("View action for notification:", notification.id);
              break;
            case "dismiss":
              // Lógica para cerrar
              toast.dismiss(id);
              if (onDismiss) {
                onDismiss(notification.id);
              }
              break;
          }
        };

        const getToastStyles = () => {
          switch (notification.type) {
            case "success":
              return "border-green-200 bg-green-50 text-green-900";
            case "error":
              return "border-red-200 bg-red-50 text-red-900";
            case "warning":
              return "border-yellow-200 bg-yellow-50 text-yellow-900";
            case "info":
              return "border-blue-200 bg-blue-50 text-blue-900";
            default:
              return "border-gray-200 bg-gray-50 text-gray-900";
          }
        };

        const getActionButtonStyles = () => {
          switch (notification.type) {
            case "success":
              return "bg-green-600 hover:bg-green-700";
            case "error":
              return "bg-red-600 hover:bg-red-700";
            case "warning":
              return "bg-yellow-600 hover:bg-yellow-700";
            case "info":
              return "bg-blue-600 hover:bg-blue-700";
            default:
              return "bg-gray-600 hover:bg-gray-700";
          }
        };

        return (
          <div
            className={`flex flex-col gap-2 p-4 rounded-lg border shadow-lg ${getToastStyles()}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {notification.type === "success" && "✅"}
                  {notification.type === "error" && "❌"}
                  {notification.type === "warning" && "⚠️"}
                  {notification.type === "info" && "ℹ️"}
                </div>
                <div>
                  <h4 className="font-semibold">{notification.title}</h4>
                  <p className="text-sm mt-1">{notification.message}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  toast.dismiss(id);
                  if (onDismiss) {
                    onDismiss(notification.id);
                  }
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {notification.actions && notification.actions.length > 0 && (
              <div className="flex gap-2 mt-2">
                {notification.actions.includes("undo") && (
                  <button
                    onClick={() => handleAction("undo")}
                    className={`px-3 py-1.5 text-xs font-medium text-white rounded ${getActionButtonStyles()}`}
                  >
                    Deshacer
                  </button>
                )}
                {notification.actions.includes("view") && (
                  <button
                    onClick={() => handleAction("view")}
                    className={`px-3 py-1.5 text-xs font-medium text-white rounded ${getActionButtonStyles()}`}
                  >
                    Ver detalles
                  </button>
                )}
                {notification.actions.includes("dismiss") && (
                  <button
                    onClick={() => handleAction("dismiss")}
                    className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded"
                  >
                    Cerrar
                  </button>
                )}
              </div>
            )}
          </div>
        );
      },
      {
        duration: Infinity, // Persistente hasta que el usuario la cierre
        onDismiss: () => {
          markAsRead(notification.id);
        },
      }
    );

    return () => {
      toast.dismiss(toastId);
    };
  }, [notification, markAsRead, onDismiss, removeNotification]);

  return null;
}