import axios from 'axios';
import Check, { ICheck } from '../models/Check';
import { IMonitor } from '../models/Monitor';
import { getIO } from '../socket';

const PING_TIMEOUT_MS = 5000;

export const pingMonitor = async (monitor: IMonitor): Promise<ICheck> => {
  const startTime = Date.now();
  let statusCode: number | null = null;
  let isUp = false;
  let error: string | null = null;

  try {
    const response = await axios.get(monitor.url, {
      timeout: PING_TIMEOUT_MS,
      validateStatus: () => true
    });
    statusCode = response.status;
    isUp = statusCode >= 200 && statusCode < 400;
  } catch (err) {
    error = err instanceof Error ? err.message : 'Unknown error';
    isUp = false;
  }

  const responseTimeMs = Date.now() - startTime;

  const check = await Check.create({
    monitorId: monitor._id,
    statusCode,
    responseTimeMs,
    isUp,
    checkedAt: new Date(),
    error
  });

  getIO().emit('check-update', {
    monitorId: monitor._id.toString(),
    statusCode,
    responseTimeMs,
    isUp,
    checkedAt: check.checkedAt.toISOString(),
    error
  });

  return check;
};