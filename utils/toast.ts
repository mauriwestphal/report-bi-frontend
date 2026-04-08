import { toast } from "sonner";
import { getFriendlyErrorMessage } from "./error-handler";
import { createNotification, notificationTemplates } from "./notifications";
import { useNotifications } from "@/context/NotificationContext";

// Hook para usar notificaciones en componentes
// Nota: Este hook solo funciona en componentes client-side
// Para usar en server components, importar directamente las funciones

export const notify = {
  // Métodos básicos de toast (compatibilidad con código existente)
  success: (msg: string) => toast.success(msg),
  error: (msg: string) => toast.error(msg),
  info: (msg: string) => toast.info(msg),
  warning: (msg: string) => toast.warning(msg),
  
  // Método para mostrar errores de API de forma amigable
  apiError: (error: any, defaultMessage = 'Ocurrió un error') => {
    const friendlyMessage = getFriendlyErrorMessage(error)
    toast.error(friendlyMessage)
    return friendlyMessage
  },
  
  // Método para mostrar loading
  loading: (msg: string) => toast.loading(msg),
  
  // Método para dismiss
  dismiss: (id?: string) => toast.dismiss(id),
  
  // Nuevos métodos para notificaciones persistentes
  persistent: {
    // Notificación persistente básica
    show: (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string, actions?: Array<'undo' | 'view' | 'dismiss'>) => {
      // Esta función necesita ser usada dentro de un componente con el contexto
      // Se implementa en el hook useNotificationActions
      console.warn('notify.persistent.show() debe ser usado con el hook useNotificationActions');
      return null;
    },
    
    // Métodos predefinidos para eventos comunes
    userCreated: (userName: string) => {
      console.warn('notify.persistent.userCreated() debe ser usado con el hook useNotificationActions');
      return null;
    },
    
    userDeleted: (userName: string) => {
      console.warn('notify.persistent.userDeleted() debe ser usado con el hook useNotificationActions');
      return null;
    },
    
    monitorCreated: (monitorName: string) => {
      console.warn('notify.persistent.monitorCreated() debe ser usado con el hook useNotificationActions');
      return null;
    },
    
    monitorUpdated: (monitorName: string) => {
      console.warn('notify.persistent.monitorUpdated() debe ser usado con el hook useNotificationActions');
      return null;
    },
    
    powerBiError: (reportName: string) => {
      console.warn('notify.persistent.powerBiError() debe ser usado con el hook useNotificationActions');
      return null;
    },
    
    permissionChanged: (roleName: string) => {
      console.warn('notify.persistent.permissionChanged() debe ser usado con el hook useNotificationActions');
      return null;
    },
  }
};

// Hook para usar acciones de notificación en componentes
// Este hook proporciona acceso al contexto de notificaciones
// y métodos para mostrar notificaciones persistentes
export function useNotificationActions() {
  const { addNotification } = useNotifications();
  
  return {
    // Método para mostrar notificación persistente
    showPersistent: (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string, actions?: Array<'undo' | 'view' | 'dismiss'>) => {
      const notification = createNotification(type, title, message, actions);
      return addNotification(notification);
    },
    
    // Métodos predefinidos
    notifyUserCreated: (userName: string) => {
      const notification = notificationTemplates.userCreated(userName);
      return addNotification(notification);
    },
    
    notifyUserDeleted: (userName: string) => {
      const notification = notificationTemplates.userDeleted(userName);
      return addNotification(notification);
    },
    
    notifyMonitorCreated: (monitorName: string) => {
      const notification = notificationTemplates.monitorCreated(monitorName);
      return addNotification(notification);
    },
    
    notifyMonitorUpdated: (monitorName: string) => {
      const notification = notificationTemplates.monitorUpdated(monitorName);
      return addNotification(notification);
    },
    
    notifyPowerBiError: (reportName: string) => {
      const notification = notificationTemplates.powerBiError(reportName);
      return addNotification(notification);
    },
    
    notifyPermissionChanged: (roleName: string) => {
      const notification = notificationTemplates.permissionChanged(roleName);
      return addNotification(notification);
    },
    
    // Métodos del sistema
    notifySystemWarning: (message: string) => {
      const notification = notificationTemplates.systemWarning(message);
      return addNotification(notification);
    },
    
    notifySystemError: (message: string) => {
      const notification = notificationTemplates.systemError(message);
      return addNotification(notification);
    },
    
    notifySystemInfo: (message: string) => {
      const notification = notificationTemplates.systemInfo(message);
      return addNotification(notification);
    },
  };
}
