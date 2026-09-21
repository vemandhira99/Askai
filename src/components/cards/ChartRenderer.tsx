import React, { useState } from 'react';
import { ChartType, ChartSeries, ColorPalette } from '../../types/bi';

const PALETTE_COLORS: Record<ColorPalette, { primary: string; secondary: string; light: string; shades: string[] }> = {
  navy: {
    primary: '#1e295b',
    secondary: '#283674',
    light: '#e0e7ff',
    shades: ['#1e295b', '#283674', '#35458d', '#4457a6', '#596dc0', '#7486d3', '#96a5e4', '#bcc6f1']
  },
  emerald: {
    primary: '#059669',
    secondary: '#10b981',
    light: '#d1fae5',
    shades: ['#065f46', '#047857', '#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#ccfbf1']
  },
  purple: {
    primary: '#7c3aed',
    secondary: '#8b5cf6',
    light: '#ede9fe',
    shades: ['#5b21b6', '#6d28d9', '#7c3aed', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe', '#ede9fe']
  },
  amber: {
    primary: '#d97706',
    secondary: '#f59e0b',
    light: '#fef3c7',
    shades: ['#92400e', '#b45309', '#d97706', '#f59e0b', '#fbbf24', '#fcd34d', '#fde68a', '#fef3c7']
  },
  slate: {
    primary: '#1e293b',
    secondary: '#334155',
    light: '#f1f5f9',
    shades: ['#0f172a', '#1e293b', '#334155', '#475569', '#64748b', '#94a3b8', '#cbd5e1', '#e2e8f0']
  }
};

interface ChartRendererProps {
  type: ChartType;
  data: ChartSeries[];
  unit?: string;
  height?: number;
  colorPalette?: ColorPalette;
  showDataLabels?: boolean;
  showGridlines?: boolean;
  showLegend?: boolean;
}

export const ChartRenderer: React.FC<ChartRendererProps> = ({ 
  type, 
  data, 
  unit = '',
  height = 240,
  colorPalette = 'navy',
  showDataLabels = false,
  showGridlines = true,
  showLegend = true,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return <div className="h-48 flex items-center justify-center text-zinc-400 text-xs">No chart data available</div>;
  }

  const palette = PALETTE_COLORS[colorPalette] || PALETTE_COLORS.navy;

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
          {/* Grid lines */}
          {showGridlines && [0, 0.5, 1].map((pct, i) => {
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
            const barColor = isHovered 
              ? palette.primary 
              : palette.shades[idx % palette.shades.length];

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
                  className="transition-all duration-150 hover:brightness-110"
                />

                {/* Data Labels */}
                {showDataLabels && (
                  <text
                    x={x + barWidth / 2}
                    y={y - 4}
                    textAnchor="middle"
                    className="text-[9px] font-mono fill-zinc-700 font-bold"
                  >
                    {Math.round(item.value)}
                  </text>
                )}

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

  // LINE / AREA CHART
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
          {showGridlines && [0, 0.5, 1].map((pct, i) => {
            const y = chartHeight - pct * (chartHeight - 32) + 12;
            return (
              <line key={i} x1={paddingX} y1={y} x2={chartWidth - 16} y2={y} stroke="#f4f4f5" strokeDasharray="3 3" />
            );
          })}

          {type === 'area' && (
            <path d={areaD} fill={palette.primary} opacity={0.15} />
          )}

          <path d={pathD} fill="none" stroke={palette.primary} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />

          {points.map((p, idx) => (
            <g key={idx} onMouseEnter={() => setHoveredIdx(idx)} onMouseLeave={() => setHoveredIdx(null)} className="cursor-pointer">
              <circle
                cx={p.x}
                cy={p.y}
                r={hoveredIdx === idx ? 5.5 : 3.5}
                fill="#ffffff"
                stroke={palette.primary}
                strokeWidth={2.5}
              />

              {showDataLabels && (
                <text
                  x={p.x}
                  y={p.y - 8}
                  textAnchor="middle"
                  className="text-[9px] font-mono fill-zinc-700 font-bold"
                >
                  {Math.round(p.value)}
                </text>
              )}

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
              const color = palette.shades[idx % palette.shades.length];

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

        {showLegend && (
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
            {data.map((item, idx) => {
              const color = palette.shades[idx % palette.shades.length];
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
        )}
      </div>
    );
  }

  // TREEMAP CHART
  if (type === 'treemap') {
    const total = data.reduce((acc, d) => acc + d.value, 0);

    return (
      <div className="w-full h-full min-h-[240px] p-2 flex flex-col justify-center select-none">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 h-56">
          {data.slice(0, 8).map((item, idx) => {
            const pct = total > 0 ? ((item.value / total) * 100).toFixed(1) : '0';
            const color = palette.shades[idx % palette.shades.length];
            const isHovered = hoveredIdx === idx;

            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{ backgroundColor: color }}
                className={`rounded-lg p-3 text-white flex flex-col justify-between transition-all duration-200 cursor-pointer shadow-2xs ${
                  isHovered ? 'scale-[1.02] ring-2 ring-white/50 brightness-110' : 'hover:opacity-95'
                }`}
              >
                <div>
                  <div className="text-xs font-bold truncate">{item.name}</div>
                  <div className="text-[10px] opacity-80">{pct}% share</div>
                </div>
                <div className="font-mono text-sm font-bold mt-2">
                  {item.value.toLocaleString()} {unit}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // TABLE CHART
  if (type === 'table') {
    const total = data.reduce((acc, d) => acc + d.value, 0);
    return (
      <div className="w-full overflow-x-auto border border-zinc-200 rounded-lg select-none">
        <table className="w-full text-xs text-left">
          <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-600 font-semibold">
            <tr>
              <th className="px-3 py-2 w-10">#</th>
              <th className="px-3 py-2">Category</th>
              <th className="px-3 py-2 text-right">Value ({unit})</th>
              <th className="px-3 py-2 text-right">Share (%)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 font-mono text-[11px]">
            {data.map((item, idx) => {
              const pct = total > 0 ? ((item.value / total) * 100).toFixed(1) : '0';
              return (
                <tr key={idx} className="hover:bg-zinc-50">
                  <td className="px-3 py-1.5 text-zinc-400">{idx + 1}</td>
                  <td className="px-3 py-1.5 font-sans font-medium text-zinc-800">{item.name}</td>
                  <td className="px-3 py-1.5 text-right font-bold text-zinc-900">{item.value.toLocaleString()}</td>
                  <td className="px-3 py-1.5 text-right text-zinc-500">{pct}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  return null;
};
