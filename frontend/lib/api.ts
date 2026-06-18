const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function fetchMonitors() {
  const res = await fetch(`${API_URL}/api/monitors`);
  if (!res.ok) throw new Error('Failed to fetch monitors');
  return res.json();
}

export async function createMonitor(name: string, url: string) {
  const res = await fetch(`${API_URL}/api/monitors`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, url }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Failed to create monitor');
  }
  return res.json();
}

export async function deleteMonitor(id: string) {
  const res = await fetch(`${API_URL}/api/monitors/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete monitor');
  return res.json();
}

export async function fetchHistory(id: string, limit = 10) {
  const res = await fetch(`${API_URL}/api/monitors/${id}/history?limit=${limit}`);
  if (!res.ok) throw new Error('Failed to fetch history');
  return res.json();
}