import { toast } from "sonner";

export const showToast = {
  success: (message: string, description?: string) => {
    return toast.success(description ? message : undefined, {
      description: description || message,
    });
  },

  error: (message: string, description?: string) => {
    return toast.error(description ? message : undefined, {
      description: description || message,
    });
  },

  warning: (message: string, description?: string) => {
    return toast.warning(description ? message : undefined, {
      description: description || message,
    });
  },

  info: (message: string, description?: string) => {
    return toast.info(description ? message : undefined, {
      description: description || message,
    });
  },

  loading: (message: string, description?: string) => {
    return toast.loading(description ? message : undefined, {
      description: description || message,
    });
  },

  promise: <T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: unknown) => string);
    }
  ) => {
    return toast.promise(promise, messages);
  },

  dismiss: (toastId?: string | number) => {
    toast.dismiss(toastId);
  },
};
