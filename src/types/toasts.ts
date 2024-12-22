export enum ToastStyle {
  Success = 'alert-success',
  Error = 'alert-error',
  Info = 'alert-info',
}

export interface Toast {
  id: string;
  title: string;
  description?: string;
  style: ToastStyle;
}

export interface ToastProps extends Omit<Toast, 'id'> {}
