import { Response } from 'express';
import bcrypt from 'bcryptjs';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { dbStore, UserRecord } from '../config/db.js';
import { formatWhatsAppMessage } from '../utils/whatsapp.js';
import { signToken } from '../utils/jwt.js';

export const createBooking = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const {
      serviceId,
      category,
      serviceName,
      selectedServices,
      address,
      preferredDate,
      preferredTime,
      description,
      customerName,
      customerPhone,
      imageUrl
    } = req.body;

    let finalServiceName = serviceName;
    if (Array.isArray(selectedServices) && selectedServices.length > 0) {
      finalServiceName = selectedServices.join(' • ');
    }

    // Validation
    if (!category || !finalServiceName) {
      res.status(400).json({ success: false, message: 'Service category and service name are required.' });
      return;
    }

    if (!preferredDate) {
      res.status(400).json({ success: false, message: 'Preferred service date is required.' });
      return;
    }

    if (!preferredTime) {
      res.status(400).json({ success: false, message: 'Preferred service time is required.' });
      return;
    }

    if (!description || !description.trim()) {
      res.status(400).json({ success: false, message: 'Please provide a brief description of the work needed.' });
      return;
    }

    const finalAddress = (address && address.trim()) || req.user?.address;
    const finalName = (customerName && customerName.trim()) || req.user?.name;
    const rawPhone = (customerPhone && customerPhone.trim()) || req.user?.phone;

    if (!finalAddress) {
      res.status(400).json({ success: false, message: 'Service address is required.' });
      return;
    }

    if (!finalName) {
      res.status(400).json({ success: false, message: 'Your name is required to book a service.' });
      return;
    }

    if (!rawPhone) {
      res.status(400).json({ success: false, message: 'Your phone number is required to book a service.' });
      return;
    }

    // Clean phone number
    let cleanPhone = rawPhone.replace(/\D/g, '');
    if (cleanPhone.length === 12 && cleanPhone.startsWith('91')) cleanPhone = cleanPhone.slice(2);
    if (cleanPhone.length === 11 && cleanPhone.startsWith('0')) cleanPhone = cleanPhone.slice(1);
    const finalPhone = cleanPhone || rawPhone;

    // Identify or auto-create customer account
    let customer: UserRecord | undefined = req.user;
    let autoToken: string | undefined;

    if (!customer) {
      if (cleanPhone) {
        customer = await dbStore.findUserByPhone(cleanPhone);
      }
      if (!customer) {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(`Customer@${cleanPhone.slice(-4) || '2026'}`, salt);
        customer = await dbStore.createUser({
          name: finalName,
          phone: cleanPhone || rawPhone,
          address: finalAddress,
          passwordHash,
          role: 'CUSTOMER'
        });
      }
      autoToken = signToken({
        userId: customer.id,
        phone: customer.phone,
        role: customer.role,
        name: customer.name
      });
    }

    // Save to Database
    const newBooking = await dbStore.createBooking({
      customerId: customer.id,
      customerName: finalName,
      customerPhone: cleanPhone || rawPhone,
      serviceId,
      category,
      serviceName: finalServiceName,
      address: finalAddress,
      preferredDate,
      preferredTime,
      description: description.trim(),
      imageUrl: imageUrl || null
    });

    // Generate pre-filled WhatsApp message
    const whatsappMessage = formatWhatsAppMessage({
      customerName: finalName,
      phone: finalPhone,
      address: finalAddress,
      category,
      serviceName: finalServiceName,
      preferredDate,
      preferredTime,
      description: description.trim(),
      bookingNumber: newBooking.bookingNumber
    });

    res.status(201).json({
      success: true,
      message: 'Booking submitted successfully!',
      booking: newBooking,
      whatsappMessage,
      token: autoToken,
      user: {
        id: customer.id,
        name: customer.name,
        phone: customer.phone,
        address: customer.address,
        role: customer.role
      }
    });
  } catch (error: any) {
    console.error('Create booking error:', error);
    res.status(500).json({ success: false, message: 'Failed to create booking. Please try again.' });
  }
};

export const getMyBookings = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const bookings = await dbStore.findBookingsByCustomer(req.user.id);

    res.json({
      success: true,
      bookings
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve bookings.' });
  }
};

export const getBookingById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const booking = await dbStore.findBookingById(id);

    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking not found.' });
      return;
    }

    // Customer can only view their own booking unless user is Admin
    if (req.user && req.user.role !== 'ADMIN' && booking.customerId !== req.user.id) {
      res.status(403).json({ success: false, message: 'Access denied to this booking.' });
      return;
    }

    // Include preformatted WhatsApp message
    const whatsappMessage = formatWhatsAppMessage({
      customerName: booking.customerName,
      phone: booking.customerPhone,
      address: booking.address,
      category: booking.category,
      serviceName: booking.serviceName,
      preferredDate: booking.preferredDate,
      preferredTime: booking.preferredTime,
      description: booking.description,
      bookingNumber: booking.bookingNumber
    });

    res.json({
      success: true,
      booking,
      whatsappMessage
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch booking details.' });
  }
};
