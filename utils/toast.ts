import { toast } from "sonner";
import { getFriendlyErrorMessage } from "./error-handler";

export const notify = {
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
};
