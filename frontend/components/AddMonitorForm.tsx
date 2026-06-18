'use client';

import { useState } from 'react';
import { createMonitor } from '@/lib/api';
import { Monitor } from '@/types';

interface Props {
  onAdded: (monitor: Monitor) => void;
}

export default function AddMonitorForm({ onAdded }: Props) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');

    if (!name.trim() || !url.trim()) {
      setError('Both name and URL are required.');
      return;
    }

    if (!/^https?:\/\//.test(url)) {
      setError('URL must start with http:// or https://');
      return;
    }

    setLoading(true);
    try {
      const data = await createMonitor(name.trim(), url.trim());
      onAdded({ ...data.monitor, latestCheck: data.latestCheck });
      setName('');
      setUrl('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 mb-8 shadow-sm">
      <h2 className="text-base font-semibold text-gray-800 mb-4">Add New Monitor</h2>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Name (e.g. My API)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="URL (https://...)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-[2] border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
        >
          {loading ? 'Adding…' : 'Add Monitor'}
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}