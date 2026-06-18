'use client';

import { Monitor } from '@/types';
import HistoryChart from './HistoryChart';

function relativeTime(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);

  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;

  return `${Math.floor(diff / 3600)}h ago`;
}

interface Props {
  monitor: Monitor;
  onDelete: (id: string) => void;
}

export default function MonitorCard({ monitor, onDelete }: Props) {
  const { latestCheck } = monitor;

  const statusLabel =
    latestCheck == null ? 'PENDING' : latestCheck.isUp ? 'UP' : 'DOWN';

  const statusClass =
    latestCheck == null
      ? 'bg-gray-100 text-gray-500'
      : latestCheck.isUp
      ? 'bg-green-100 text-green-700'
      : 'bg-red-100 text-red-700';

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-semibold text-gray-900 text-sm truncate">
            {monitor.name}
          </p>

          <a
            href={monitor.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-500 hover:underline truncate block"
          >
            {monitor.url}
          </a>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusClass}`}
          >
            {statusLabel}
          </span>

          <button
            onClick={() => onDelete(monitor._id)}
            className="text-gray-400 hover:text-red-500 text-xs transition-colors"
            title="Delete monitor"
          >
            ✕
          </button>
        </div>
      </div>

      {latestCheck && (
        <div className="flex gap-4 text-xs text-gray-500">
          <span>{latestCheck.responseTimeMs}ms</span>

          {latestCheck.statusCode !== null && (
            <span>HTTP {latestCheck.statusCode}</span>
          )}

          <span>{relativeTime(latestCheck.checkedAt)}</span>
        </div>
      )}

      {latestCheck?.error && (
        <p
          className="text-xs text-red-500 truncate"
          title={latestCheck.error}
        >
          {latestCheck.error}
        </p>
      )}

      <HistoryChart monitorId={monitor._id} />
    </div>
  );
}