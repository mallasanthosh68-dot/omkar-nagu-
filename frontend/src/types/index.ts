export type Role = 'CUSTOMER' | 'ADMIN';

export type BookingStatus = 'NEW' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface User {
  id: string;
  name: string;
  phone: string;
  address: string;
  role: Role;
}

export type ServiceCategory = 'Wiring' | 'Ceiling & Lighting' | 'Panel Board' | 'Other';

export interface ServiceItem {
  id: string;
  category: ServiceCategory;
  name: string;
  description: string;
  features: string[];
  badge?: string;
  imageUrl?: string;
}

export interface Booking {
  id: string;
  bookingNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  serviceId?: string;
  category: string;
  serviceName: string;
  address: string;
  preferredDate: string;
  preferredTime: string;
  description: string;
  imageUrl?: string | null;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  total: number;
  new: number;
  confirmed: number;
  inProgress: number;
  completed: number;
  cancelled: number;
}

export interface CustomerSummary extends User {
  totalBookings: number;
  completedServices: number;
  pendingServices: number;
  lastBookingDate?: string | null;
  createdAt: string;
}
