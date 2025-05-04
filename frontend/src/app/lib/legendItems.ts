// legendItems.ts
import { ReactNode } from 'react';
import { getTrashIcon } from './icons';

export interface LegendItem {
  category: string;
  labelKey: string;
  icon: React.JSX.Element; 
}

export const legendItems: LegendItem[] = [
  { category: "Combustible", labelKey: "result.Combustible", icon: getTrashIcon("Combustible") },
  { category: "Non-Combustible", labelKey: "result.Non-Combustible", icon: getTrashIcon("Non-Combustible") },
  { category: "Plastic", labelKey: "result.Plastic", icon: getTrashIcon("Plastic") },
  { category: "Bottles", labelKey: "result.Bottles", icon: getTrashIcon("Bottles") },
  { category: "Paper", labelKey: "result.Paper", icon: getTrashIcon("Paper") },
  { category: "Branches", labelKey: "result.Branches", icon: getTrashIcon("Branches") },
  { category: "Irregular", labelKey: "result.Irregular", icon: getTrashIcon("Irregular") },
  { category: "Not Collected", labelKey: "result.Not Collected", icon: getTrashIcon("Not Collected") },
  
];