'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { fetchMonitors, deleteMonitor } from '@/lib/api';
import { Monitor, CheckUpdatePayload } from '@/types';
import MonitorCard from './MonitorCard';
import AddMonitorForm from './AddMonitorForm';

let socket: Socket | null = null;

export default function MonitorGrid() {
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMonitors()
      .then((data: Monitor[]) => setMonitors(data))
      .catch(() => setError('Could not reach the backend. Is it running?'))
      .finally(() => setLoading(false));

    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000';
    socket = io(socketUrl, { transports: ['websocket'] });

    socket.on('check-update', (payload: CheckUpdatePayload) => {
      setMonitors((prev) =>
        prev.map((m) =>
          m._id === payload.monitorId
            ? {
                ...m,
                latestCheck: {
                  _id: m.latestCheck?._id ?? '',
                  monitorId: payload.monitorId,
                  statusCode: payload.statusCode,
                  responseTimeMs: payload.responseTimeMs,
                  isUp: payload.isUp,
                  checkedAt: payload.checkedAt,
                  error: payload.error,
                },
              }
            : m
        )
      );
    });

    return () => {
      socket?.disconnect();
      socket = null;
    };
  }, []);

  const handleAdded = (monitor: Monitor) => {
    setMonitors((prev) => [monitor, ...prev]);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMonitor(id);
      setMonitors((prev) => prev.filter((m) => m._id !== id));
    } catch {
      alert('Failed to delete monitor');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Uptime Monitor</h1>
        <p className="text-sm text-gray-500 mt-1">Real-time status for your URLs</p>
      </div>

      <AddMonitorForm onAdded={handleAdded} />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-6">
          {error}
        </div>
      )}

      {loading && (
        <p className="text-sm text-gray-400 text-center py-12">Loading monitors…</p>
      )}

      {!loading && monitors.length === 0 && !error && (
        <p className="text-sm text-gray-400 text-center py-12">
          No monitors yet. Add one above.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {monitors.map((m) => (
          <MonitorCard key={m._id} monitor={m} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}