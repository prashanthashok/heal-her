'use client';

import { useMemo } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ReferenceLine,
} from 'recharts';
import { last30Days } from '@/lib/tracker';

interface ChartProps {
  data: ReturnType<typeof last30Days>;
  dataKey: 'energy' | 'mood';
  color: string;
  label: string;
}

function CustomTooltip({
  active, payload, label: _label, metricLabel,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
  metricLabel: string;
}) {
  if (!active || !payload?.length || payload[0].value == null) return null;
  return (
    <div className="bg-white border border-cream-dark shadow-md rounded-xl px-3 py-2 text-xs">
      <p className="font-semibold text-charcoal">{metricLabel}: {payload[0].value}/5</p>
    </div>
  );
}

function MiniChart({ data, dataKey, color, label }: ChartProps) {
  // Only show ticks for first and last labelled points
  const tickFormatter = (val: string, idx: number) => {
    const hasData = data.filter(d => d[dataKey] !== null);
    if (hasData.length === 0) return '';
    if (idx === 0 || idx === data.length - 1) return val;
    return '';
  };

  const avg = useMemo(() => {
    const vals = data.map(d => d[dataKey]).filter((v): v is number => v !== null);
    return vals.length ? (vals.reduce((s, v) => s + v, 0) / vals.length).toFixed(1) : null;
  }, [data, dataKey]);

  return (
    <div className="card space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-charcoal">{label}</p>
          <p className="text-xs text-charcoal/40">Last 30 days</p>
        </div>
        {avg && (
          <div className="text-right">
            <p className="text-lg font-bold" style={{ color }}>{avg}</p>
            <p className="text-[10px] text-charcoal/40">avg / 5</p>
          </div>
        )}
      </div>

      {data.every(d => d[dataKey] === null) ? (
        <div className="h-28 flex items-center justify-center">
          <p className="text-xs text-charcoal/30">No data yet — start logging ✦</p>
        </div>
      ) : (
        <div className="h-28">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 6, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F5E8D4" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 9, fill: '#3D353570' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={tickFormatter}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={[1, 5]}
                ticks={[1, 2, 3, 4, 5]}
                tick={{ fontSize: 9, fill: '#3D353570' }}
                tickLine={false}
                axisLine={false}
                width={24}
              />
              <ReferenceLine y={3} stroke="#3D353515" strokeDasharray="4 4" />
              <Tooltip
                content={<CustomTooltip metricLabel={label} />}
                cursor={{ stroke: '#3D353515', strokeWidth: 1 }}
              />
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                strokeWidth={2}
                dot={{ r: 3, fill: color, strokeWidth: 0 }}
                activeDot={{ r: 5, fill: color, strokeWidth: 2, stroke: '#FDF6EC' }}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export function TrendCharts() {
  const data = useMemo(() => last30Days(), []);

  return (
    <div className="space-y-4">
      <h3 className="section-title">Trends</h3>
      <MiniChart data={data} dataKey="energy" color="#C9A84C" label="Energy" />
      <MiniChart data={data} dataKey="mood"   color="#7D9B76" label="Mood" />
    </div>
  );
}
