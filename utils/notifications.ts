import { Notification, NotificationType, NotificationAction } from "@/types/notification";

// Función para crear notificaciones estándar
export function createNotification(
  type: NotificationType,
  title: string,
  message: string,
  actions?: NotificationAction[],
  data?: any
): Omit<Notification, "id" | "timestamp" | "read"> {
  return {
    type,
    title,
    message,
    actions,
    data,
  };
}

// Notificaciones predefinidas para eventos comunes
export const notificationTemplates = {
  userCreated: (userName: string) =>
    createNotification(
      "success",
      "Usuario creado",
      `El usuario "${userName}" ha sido creado exitosamente.`,
      ["view", "dismiss"]
    ),

  userDeleted: (userName: string) =>
    createNotification(
      "warning",
      "Usuario eliminado",
      `El usuario "${userName}" ha sido eliminado.`,
      ["undo", "dismiss"]
    ),

  monitorCreated: (monitorName: string) =>
    createNotification(
      "success",
      "Monitor creado",
      `El monitor "${monitorName}" ha sido creado exitosamente.`,
      ["view", "dismiss"]
    ),

  monitorUpdated: (monitorName: string) =>
    createNotification(
      "info",
      "Monitor actualizado",
      `El monitor "${monitorName}" ha sido actualizado.`,
      ["view", "dismiss"]
    ),

  powerBiError: (reportName: string) =>
    createNotification(
      "error",
      "Error de carga Power BI",
      `No se pudo cargar el reporte "${reportName}". Verifica la conexión o los permisos.`,
      ["view", "dismiss"]
    ),

  permissionChanged: (roleName: string) =>
    createNotification(
      "info",
      "Permisos actualizados",
      `Los permisos del rol "${roleName}" han sido modificados.`,
      ["view", "dismiss"]
    ),

  // Notificaciones del sistema
  systemWarning: (message: string) =>
    createNotification("warning", "Advertencia del sistema", message, ["dismiss"]),

  systemError: (message: string) =>
    createNotification("error", "Error del sistema", message, ["dismiss"]),

  systemInfo: (message: string) =>
    createNotification("info", "Información del sistema", message, ["dismiss"]),
};

// Helper para formatear fechas relativas
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "hace un momento";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `hace ${diffInMinutes} ${diffInMinutes === 1 ? "minuto" : "minutos"}`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `hace ${diffInHours} ${diffInHours === 1 ? "hora" : "horas"}`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `hace ${diffInDays} ${diffInDays === 1 ? "día" : "días"}`;
  }

  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Validar si una notificación es antigua (más de 7 días)
export function isNotificationOld(notification: Notification): boolean {
  const ageInDays = (Date.now() - notification.timestamp.getTime()) / (1000 * 60 * 60 * 24);
  return ageInDays > 7;
}

// Limpiar notificaciones antiguas del localStorage
export function cleanupOldNotifications(): number {
  try {
    const stored = localStorage.getItem("bipro-notifications");
    if (!stored) return 0;

    const notifications: Notification[] = JSON.parse(stored);
    const freshNotifications = notifications.filter((n) => !isNotificationOld(n));

    if (freshNotifications.length !== notifications.length) {
      localStorage.setItem("bipro-notifications", JSON.stringify(freshNotifications));
      return notifications.length - freshNotifications.length;
    }

    return 0;
  } catch (error) {
    console.error("Error cleaning up old notifications:", error);
    return 0;
  }
}