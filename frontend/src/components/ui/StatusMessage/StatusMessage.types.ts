export type StatusMessageVariant = 'info' | 'error' | 'success';

export interface StatusMessageProps {
  title: string;
  message: string;
  variant?: StatusMessageVariant;
}
