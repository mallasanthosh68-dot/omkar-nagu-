import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { dbStore } from '../config/db.js';

export const getProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const bookings = await dbStore.findBookingsByCustomer(req.user.id);

    res.json({
      success: true,
      profile: {
        id: req.user.id,
        name: req.user.name,
        phone: req.user.phone,
        address: req.user.address,
        role: req.user.role,
        createdAt: req.user.createdAt,
        totalBookings: bookings.length,
        completedBookings: bookings.filter(b => b.status === 'COMPLETED').length,
        activeBookings: bookings.filter(b => ['NEW', 'CONFIRMED', 'IN_PROGRESS'].includes(b.status)).length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch customer profile' });
  }
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { name, address, phone } = req.body;
    let cleanPhone = req.user.phone;

    if (phone && phone !== req.user.phone) {
      cleanPhone = phone.replace(/\D/g, '');
      if (cleanPhone.length === 12 && cleanPhone.startsWith('91')) {
        cleanPhone = cleanPhone.slice(2);
      } else if (cleanPhone.length === 11 && cleanPhone.startsWith('0')) {
        cleanPhone = cleanPhone.slice(1);
      }
      const validPhoneRegex = /^[6-9]\d{9}$/;
      if (!validPhoneRegex.test(cleanPhone)) {
        res.status(400).json({
          success: false,
          message: 'Please enter a valid 10-digit Indian mobile number.'
        });
        return;
      }
      const existing = await dbStore.findUserByPhone(cleanPhone);
      if (existing && existing.id !== req.user.id) {
        res.status(409).json({ success: false, message: 'Phone number already registered to another account.' });
        return;
      }
    }

    const updated = await dbStore.updateUser(req.user.id, {
      name: name?.trim(),
      address: address?.trim(),
      phone: cleanPhone
    });

    if (!updated) {
      res.status(404).json({ success: false, message: 'Customer record not found.' });
      return;
    }

    res.json({
      success: true,
      message: 'Profile updated successfully!',
      user: {
        id: updated.id,
        name: updated.name,
        phone: updated.phone,
        address: updated.address,
        role: updated.role
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
};
