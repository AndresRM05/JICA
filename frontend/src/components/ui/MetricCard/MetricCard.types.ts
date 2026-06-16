import type { ReactNode } from 'react';

export interface MetricCardProps {
  title: string;
  value: string;
  description?: string;
  icon?: ReactNode;
}
