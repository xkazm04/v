import { LucideIcon } from 'lucide-react';

export interface Category {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string;
  count?: number;
  isDefault?: boolean;
}

export interface CategoryCounts {
  [categoryId: string]: number;
}