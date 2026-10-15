import { Request, Response } from 'express';
import { dbStore } from '../config/db.js';

export const getServices = async (_req: Request, res: Response): Promise<void> => {
  try {
    const services = await dbStore.getServices();
    res.json({
      success: true,
      services
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve services.' });
  }
};

export const getServiceById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const service = await dbStore.getServiceById(id);

    if (!service) {
      res.status(404).json({ success: false, message: 'Service not found.' });
      return;
    }

    res.json({
      success: true,
      service
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve service.' });
  }
};
