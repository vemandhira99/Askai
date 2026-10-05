import React from 'react';
import { ChartType } from '../../types/bi';
import { BarChart2, LineChart, PieChart, Table } from 'lucide-react';

interface QuickChartActionsProps {
  currentType?: ChartType;
  onSelectChartType: (type: ChartType) => void;
}

export const QuickChartActions: React.FC<QuickChartActionsProps> = ({ 
  currentType = 'bar', 
  onSelectChartType 
}) => {
  const options: { type: ChartType; label: string; icon: React.ReactNode }[] = [
    { type: 'bar', label: 'Bar', icon: <BarChart2 className="w-3 h-3" /> },
    { type: 'line', label: 'Line', icon: <LineChart className="w-3 h-3" /> },
    { type: 'donut', label: 'Donut', icon: <PieChart className="w-3 h-3" /> },
    { type: 'table', label: 'Table', icon: <Table className="w-3 h-3" /> },
  ];

  return (
    <div className="flex items-center justify-between my-2.5 pt-2 border-t border-zinc-100 text-xs select-none">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[11px] text-zinc-500 font-medium">View as:</span>
        <div className="inline-flex bg-zinc-100 p-0.5 rounded-lg border border-zinc-200/80">
          {options.map(opt => {
            const isActive = currentType === opt.type;
            return (
              <button
                key={opt.type}
                type="button"
                onClick={() => onSelectChartType(opt.type)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-white text-zinc-900 shadow-2xs font-semibold' 
                    : 'text-zinc-500 hover:text-zinc-900'
                }`}
                title={`Switch view to ${opt.label} perspective`}
              >
                {opt.icon}
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>
      <span className="text-[10px] text-zinc-400 font-medium hidden sm:inline">4 Visual Perspectives</span>
    </div>
  );
};
