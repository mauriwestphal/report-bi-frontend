"use client";

import { useEffect } from "react";
import { useNotifications } from "@/context/NotificationContext";
import { PersistentToast } from "./PersistentToast";
import { cleanupOldNotifications } from "@/utils/notifications";

export function NotificationManager() {
  const { notifications, removeNotification } = useNotifications();

  // Limpiar notificaciones antiguas al montar el componente
  useEffect(() => {
    const cleanedCount = cleanupOldNotifications();
    if (cleanedCount > 0) {
      console.log(`Se limpiaron ${cleanedCount} notificaciones antiguas`);
    }
  }, []);

  // Filtrar notificaciones no leídas para mostrar como toasts persistentes
  const unreadNotifications = notifications.filter((n) => !n.read);

  if (unreadNotifications.length === 0) {
    return null;
  }

  return (
    <>
      {unreadNotifications.map((notification) => (
        <PersistentToast
          key={notification.id}
          notification={notification}
          onDismiss={removeNotification}
        />
      ))}
    </>
  );
}