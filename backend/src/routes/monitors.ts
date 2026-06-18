import { Router } from 'express';
import {
  createMonitor,
  getAllMonitors,
  getMonitorHistory,
  deleteMonitor
} from '../controllers/monitorController';

const router = Router();

router.post('/', createMonitor);
router.get('/', getAllMonitors);
router.get('/:id/history', getMonitorHistory);
router.delete('/:id', deleteMonitor);

export default router;