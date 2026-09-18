import React, { useState } from 'react';
import { ChartType, ChartSeries } from '../../types/bi';

interface ChartRendererProps {
  type: ChartType;
  data: ChartSeries[];
  unit?: string;
  height?: number;
}

export const ChartRenderer: React.FC<ChartRendererProps> = ({ 
  type, 
  data, 
  unit = '',
  height = 240 
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return <div className="h-48 flex items-center justify-center text-zinc-400 text-xs">No chart data available</div>;
  }

  const maxValue = Math.max(...data.map(d => d.value), 1);
  const chartHeight = height - 40;
  const chartWidth = 560;
  const paddingX = 42;

  // BAR CHART
  if (type === 'bar') {
    const barWidth = Math.min(38, (chartWidth - paddingX * 2) / data.length - 14);

    return (
      <div className="relative w-full overflow-x-auto py-1 select-none">
        <svg viewBox={`0 0 ${chartWidth} ${height}`} className="w-full h-auto min-h-[190px]">
          {/* Subtle Grid lines */}
          {[0, 0.5, 1].map((pct, i) => {
            const y = chartHeight - pct * (chartHeight - 32) + 14;
            const valLabel = Math.round(maxValue * pct);
            return (
              <g key={i}>
                <line x1={paddingX} y1={y} x2={chartWidth - 16} y2={y} stroke="#f4f4f5" strokeDasharray="3 3" />
                <text x={paddingX - 8} y={y + 3} textAnchor="end" className="text-[10px] fill-zinc-400 font-mono">
                  {valLabel}
                </text>
              </g>
            );
          })}

          {/* Bars */}
          {data.map((item, idx) => {
            const barH = (item.value / maxValue) * (chartHeight - 32);
            const x = paddingX + 16 + idx * ((chartWidth - paddingX - 24) / data.length);
            const y = chartHeight - barH + 14;
            const isHovered = hoveredIdx === idx;

            // Refined calm monochrome palette
            const barColor = idx === 0 
              ? (isHovered ? '#18181b' : '#27272a')
              : (isHovered ? '#3f3f46' : idx < 3 ? '#52525b' : '#a1a1aa');

            return (
              <g 
                key={idx} 
                onMouseEnter={() => setHoveredIdx(idx)} 
                onMouseLeave={() => setHoveredIdx(null)}
                className="cursor-pointer"
              >
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={Math.max(barH, 3)}
                  rx={3}
                  fill={barColor}
                  className="transition-all duration-150 hover:brightness-125"
                />
                <text
                  x={x + barWidth / 2}
                  y={chartHeight + 28}
                  textAnchor="middle"
                  className="text-[11px] fill-zinc-600 font-medium"
                >
                  {item.name}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Floating Tooltip */}
        {hoveredIdx !== null && (
          <div className="absolute top-1 right-3 bg-zinc-900 text-white text-xs px-2.5 py-1.5 rounded-md shadow-md pointer-events-none transition-all flex items-center gap-2">
            <span className="font-medium text-zinc-300">{data[hoveredIdx].name}:</span>
            <span className="font-mono font-semibold text-white">{data[hoveredIdx].value.toLocaleString()} {unit}</span>
          </div>
        )}
      </div>
    );
  }

  // LINE CHART
  if (type === 'line' || type === 'area') {
    const points = data.map((d, i) => {
      const x = paddingX + 16 + i * ((chartWidth - paddingX - 36) / (data.length - 1 || 1));
      const y = chartHeight - (d.value / maxValue) * (chartHeight - 36) + 12;
      return { x, y, ...d };
    });

    const pathD = points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '');
    const areaD = `${pathD} L ${points[points.length - 1].x} ${chartHeight + 12} L ${points[0].x} ${chartHeight + 12} Z`;

    return (
      <div className="relative w-full overflow-x-auto py-1 select-none">
        <svg viewBox={`0 0 ${chartWidth} ${height}`} className="w-full h-auto min-h-[190px]">
          {[0, 0.5, 1].map((pct, i) => {
            const y = chartHeight - pct * (chartHeight - 36) + 12;
            return (
              <line key={i} x1={paddingX} y1={y} x2={chartWidth - 16} y2={y} stroke="#f4f4f5" strokeDasharray="3 3" />
            );
          })}

          {type === 'area' && (
            <path d={areaD} fill="#27272a" opacity={0.08} />
          )}

          <path d={pathD} fill="none" stroke="#18181b" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />

          {points.map((p, idx) => (
            <g key={idx} onMouseEnter={() => setHoveredIdx(idx)} onMouseLeave={() => setHoveredIdx(null)} className="cursor-pointer">
              <circle
                cx={p.x}
                cy={p.y}
                r={hoveredIdx === idx ? 5 : 3.5}
                fill="#ffffff"
                stroke="#18181b"
                strokeWidth={2}
              />
              <text
                x={p.x}
                y={chartHeight + 28}
                textAnchor="middle"
                className="text-[11px] fill-zinc-600 font-medium"
              >
                {p.name}
              </text>
            </g>
          ))}
        </svg>

        {hoveredIdx !== null && (
          <div className="absolute top-1 right-3 bg-zinc-900 text-white text-xs px-2.5 py-1.5 rounded-md shadow-md pointer-events-none">
            <span className="font-medium text-zinc-300">{data[hoveredIdx].name}: </span>
            <span className="font-mono font-semibold text-white">{data[hoveredIdx].value.toLocaleString()} {unit}</span>
          </div>
        )}
      </div>
    );
  }

  // DONUT CHART
  if (type === 'donut') {
    const total = data.reduce((acc, d) => acc + d.value, 0);
    const radius = 64;
    const strokeWidth = 24;
    const center = 90;
    let accumulatedAngle = 0;

    const shades = ['#18181b', '#3f3f46', '#71717a', '#a1a1aa', '#d4d4d8', '#e4e4e7'];

    return (
      <div className="flex flex-col sm:flex-row items-center justify-center gap-8 py-3 select-none">
        <div className="relative w-44 h-44 flex-shrink-0">
          <svg viewBox="0 0 180 180" className="w-full h-full transform -rotate-90">
            {data.map((item, idx) => {
              const sliceAngle = (item.value / total) * 360;
              const circumference = 2 * Math.PI * radius;
              const strokeDasharray = `${(sliceAngle / 360) * circumference} ${circumference}`;
              const strokeDashoffset = -((accumulatedAngle / 360) * circumference);
              accumulatedAngle += sliceAngle;
              const color = shades[idx % shades.length];

              return (
                <circle
                  key={idx}
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="transparent"
                  stroke={color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="cursor-pointer transition-opacity duration-150 hover:opacity-80"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider">Total</span>
            <span className="text-xs font-bold text-zinc-900 font-mono">
              {hoveredIdx !== null ? `${Math.round((data[hoveredIdx].value / total) * 100)}%` : Math.round(total).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
          {data.map((item, idx) => {
            const color = shades[idx % shades.length];
            const pct = Math.round((item.value / total) * 100);
            return (
              <div 
                key={idx} 
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={`flex items-center gap-2 p-1 rounded cursor-pointer ${hoveredIdx === idx ? 'bg-zinc-100 font-medium' : ''}`}
              >
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }}></span>
                <span className="text-zinc-700 truncate max-w-[80px]">{item.name}</span>
                <span className="text-zinc-400 ml-auto font-mono text-[10px]">{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
};
