import { Request, Response } from 'express';
import Monitor from '../models/Monitor';
import Check from '../models/Check';
import { pingMonitor } from '../services/pingService';

export const createMonitor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, url } = req.body;

    if (!name || !url) {
      res.status(400).json({ error: 'name and url are required' });
      return;
    }

    if (!/^https?:\/\//.test(url)) {
      res.status(400).json({ error: 'url must start with http:// or https://' });
      return;
    }

    const monitor = await Monitor.create({ name, url });
    const latestCheck = await pingMonitor(monitor);

    res.status(201).json({ monitor, latestCheck });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
  }
};

export const getAllMonitors = async (req: Request, res: Response): Promise<void> => {
  try {
    const monitors = await Monitor.find().sort({ createdAt: -1 });

    const withLatestCheck = await Promise.all(
      monitors.map(async (monitor) => {
        const latestCheck = await Check.findOne({ monitorId: monitor._id }).sort({
          checkedAt: -1
        });
        return { ...monitor.toObject(), latestCheck };
      })
    );

    res.json(withLatestCheck);
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
  }
};

export const getMonitorHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const limit = parseInt(req.query.limit as string) || 20;

    const history = await Check.find({ monitorId: id })
      .sort({ checkedAt: -1 })
      .limit(limit);

    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
  }
};

export const deleteMonitor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const deleted = await Monitor.findByIdAndDelete(id);
    if (!deleted) {
      res.status(404).json({ error: 'Monitor not found' });
      return;
    }

    await Check.deleteMany({ monitorId: id });

    res.json({ message: 'Monitor deleted', id });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
  }
};