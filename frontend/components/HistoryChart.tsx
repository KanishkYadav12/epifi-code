'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchHistory } from '@/lib/api';
import { Check } from '@/types';

interface Props {
  monitorId: string;
}

export default function HistoryChart({ monitorId }: Props) {
  const [data, setData] = useState<{ time: string; ms: number }[]>([]);

  useEffect(() => {
    fetchHistory(monitorId, 10)
      .then((checks: Check[]) => {
        const formatted = [...checks].reverse().map((c) => ({
          time: new Date(c.checkedAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          ms: c.responseTimeMs,
        }));
        setData(formatted);
      })
      .catch(() => {});
  }, [monitorId]);

  if (data.length === 0) {
    return <p className="text-xs text-gray-400 mt-3">No history yet.</p>;
  }

  return (
    <div className="mt-3 h-20">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="time" tick={{ fontSize: 9 }} interval="preserveStartEnd" />
          <YAxis tick={{ fontSize: 9 }} width={30} unit="ms" />
          <Tooltip
  contentStyle={{ fontSize: '11px' }}
  formatter={(val) => [`${val}ms`, 'Response']}
/>
          <Line
            type="monotone"
            dataKey="ms"
            stroke="#3b82f6"
            dot={false}
            strokeWidth={1.5}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}