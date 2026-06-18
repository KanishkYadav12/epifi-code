import Monitor from './models/Monitor';
import { pingMonitor } from './services/pingService';

export const runAllChecks = async (): Promise<void> => {
  const monitors = await Monitor.find();
  if (monitors.length === 0) return;

  console.log(`Running checks for ${monitors.length} monitor(s)...`);

  const results = await Promise.allSettled(
    monitors.map((monitor) => pingMonitor(monitor))
  );

  results.forEach((result, idx) => {
    if (result.status === 'rejected') {
      console.error(`Check failed for ${monitors[idx].url}:`, result.reason);
    }
  });
};

export const startScheduler = (): void => {
  const intervalMs = parseInt(process.env.CHECK_INTERVAL_MS || '60000');

  setInterval(() => {
    runAllChecks().catch((err) => console.error('Scheduler tick error:', err));
  }, intervalMs);

  console.log(`Scheduler started, interval: ${intervalMs}ms`);
};