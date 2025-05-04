// Legend.tsx
"use client";

import React from 'react';
import { useLanguage } from "../contexts/language-context";
import { legendItems } from "../lib/legendItems";

interface LegendItem {
  category: string;
  icon: React.ReactNode;
  labelKey: string;
}

interface LegendProps {
  onOpenModal: (category: string) => void;
}

const Legend: React.FC<LegendProps> = ({ onOpenModal }) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-3">
      {legendItems.map((item: LegendItem) => (
        <div
          key={item.category}
          className="flex items-center cursor-pointer hover:bg-[#f2fafc] rounded-md p-2"
          onClick={() => onOpenModal(item.category)} 
        >
          {item.icon}
          <span className='pl-4'>{t(item.labelKey)}</span>
        </div>
      ))}
    </div>
  );
};

export default Legend;