import { Request, Response } from 'express';
import { dbStore } from '../config/db.js';

export const getDashboardStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const stats = await dbStore.getDashboardStats();
    res.json({
      success: true,
      stats
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve dashboard statistics.' });
  }
};

export const getAdminBookings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, search } = req.query;
    const bookings = await dbStore.getAllBookings(
      status ? String(status).toUpperCase() : undefined,
      search ? String(search) : undefined
    );

    res.json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve bookings.' });
  }
};

export const getAdminBookingDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const booking = await dbStore.findBookingById(id);

    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking not found.' });
      return;
    }

    const customer = await dbStore.findUserById(booking.customerId);

    res.json({
      success: true,
      booking,
      customer: customer ? {
        id: customer.id,
        name: customer.name,
        phone: customer.phone,
        address: customer.address,
        createdAt: customer.createdAt
      } : null
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve booking details.' });
  }
};

export const updateBookingStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { status } = req.body;

    const validStatuses = ['NEW', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
    if (!status || !validStatuses.includes(status)) {
      res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${validStatuses.join(', ')}`
      });
      return;
    }

    const updated = await dbStore.updateBookingStatus(id, status);
    if (!updated) {
      res.status(404).json({ success: false, message: 'Booking not found.' });
      return;
    }

    res.json({
      success: true,
      message: `Booking status successfully updated to ${status}.`,
      booking: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update booking status.' });
  }
};

export const getCustomersList = async (_req: Request, res: Response): Promise<void> => {
  try {
    const customers = await dbStore.getAllCustomers();
    const allBookings = await dbStore.getAllBookings();

    const customerData = customers.map(cust => {
      const custBookings = allBookings.filter(b => b.customerId === cust.id);
      const completed = custBookings.filter(b => b.status === 'COMPLETED').length;
      const pending = custBookings.filter(b => ['NEW', 'CONFIRMED', 'IN_PROGRESS'].includes(b.status)).length;
      const lastBooking = custBookings[0] ? custBookings[0].createdAt : null;

      return {
        ...cust,
        totalBookings: custBookings.length,
        completedServices: completed,
        pendingServices: pending,
        lastBookingDate: lastBooking
      };
    });

    res.json({
      success: true,
      customers: customerData
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve customers.' });
  }
};

export const getCustomerDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const customer = await dbStore.findUserById(id);

    if (!customer) {
      res.status(404).json({ success: false, message: 'Customer not found.' });
      return;
    }

    const bookings = await dbStore.findBookingsByCustomer(id);
    const completed = bookings.filter(b => b.status === 'COMPLETED').length;
    const pending = bookings.filter(b => ['NEW', 'CONFIRMED', 'IN_PROGRESS'].includes(b.status)).length;

    res.json({
      success: true,
      customer: {
        id: customer.id,
        name: customer.name,
        phone: customer.phone,
        address: customer.address,
        createdAt: customer.createdAt,
        totalBookings: bookings.length,
        completedServices: completed,
        pendingServices: pending,
        bookingHistory: bookings
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve customer details.' });
  }
};
