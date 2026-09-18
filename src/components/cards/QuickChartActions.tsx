import React from 'react';
import { ChartType } from '../../types/bi';

interface QuickChartActionsProps {
  currentType?: ChartType;
  onSelectChartType: (type: ChartType) => void;
}

export const QuickChartActions: React.FC<QuickChartActionsProps> = ({ 
  currentType, 
  onSelectChartType 
}) => {
  const options: { type: ChartType; label: string }[] = [
    { type: 'bar', label: 'Bar' },
    { type: 'line', label: 'Line' },
    { type: 'donut', label: 'Donut' },
    { type: 'area', label: 'Area' },
  ];

  return (
    <div className="flex items-center gap-1 my-2">
      <span className="text-[11px] text-zinc-400 mr-1.5 select-none font-medium">Type:</span>
      <div className="inline-flex bg-zinc-100 p-0.5 rounded-lg border border-zinc-200/80">
        {options.map(opt => {
          const isActive = currentType === opt.type;
          return (
            <button
              key={opt.type}
              onClick={() => onSelectChartType(opt.type)}
              className={`px-2.5 py-0.5 rounded-md text-xs font-medium transition-all ${
                isActive 
                  ? 'bg-white text-zinc-900 shadow-xs' 
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
