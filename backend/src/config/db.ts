import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { INITIAL_SERVICES, ServiceItem } from '../data/initialServices.js';
import { fileURLToPath } from 'url';

export interface UserRecord {
  id: string;
  name: string;
  phone: string;
  address: string;
  passwordHash: string;
  role: 'CUSTOMER' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
}

export interface BookingRecord {
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
  status: 'NEW' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
}

interface DatabaseSchema {
  users: UserRecord[];
  services: ServiceItem[];
  bookings: BookingRecord[];
  nextBookingIdNumber: number;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Locate database file reliably across root or backend cwd
const resolveDbPaths = () => {
  const relPath = path.resolve(__dirname, '../../data/db.json');
  const cwdBackendPath = path.resolve(process.cwd(), 'backend/data/db.json');
  const cwdPath = path.resolve(process.cwd(), 'data/db.json');

  if (fs.existsSync(relPath)) return { dataDir: path.dirname(relPath), dbFile: relPath };
  if (fs.existsSync(cwdBackendPath)) return { dataDir: path.dirname(cwdBackendPath), dbFile: cwdBackendPath };
  if (fs.existsSync(cwdPath)) return { dataDir: path.dirname(cwdPath), dbFile: cwdPath };

  // Default to relative data directory in backend package
  const defaultDir = path.resolve(__dirname, '../../data');
  return { dataDir: defaultDir, dbFile: path.join(defaultDir, 'db.json') };
};

const { dataDir: DATA_DIR, dbFile: DB_FILE } = resolveDbPaths();

// Initialize Prisma client for Supabase PostgreSQL
export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error']
});

export let isPrismaConnected = false;

// In-memory + persistent store ensuring rock-solid availability in any environment
let memoryDb: DatabaseSchema = {
  users: [],
  services: [...INITIAL_SERVICES],
  bookings: [],
  nextBookingIdNumber: 1025
};

// Prisma to App Model mappers
const mapPrismaUser = (u: any): UserRecord => ({
  id: u.id,
  name: u.name,
  phone: u.phone,
  address: u.address,
  passwordHash: u.passwordHash,
  role: u.role as 'CUSTOMER' | 'ADMIN',
  createdAt: u.createdAt instanceof Date ? u.createdAt.toISOString() : String(u.createdAt),
  updatedAt: u.updatedAt instanceof Date ? u.updatedAt.toISOString() : String(u.updatedAt)
});

const mapPrismaBooking = (b: any): BookingRecord => ({
  id: b.id,
  bookingNumber: b.bookingNumber,
  customerId: b.customerId,
  customerName: b.customerName || b.customer?.name || 'Customer',
  customerPhone: b.customerPhone || b.customer?.phone || '',
  serviceId: b.serviceId || undefined,
  category: b.category,
  serviceName: b.serviceName,
  address: b.address,
  preferredDate: b.preferredDate,
  preferredTime: b.preferredTime,
  description: b.description,
  imageUrl: b.imageUrl || null,
  status: b.status as 'NEW' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED',
  createdAt: b.createdAt instanceof Date ? b.createdAt.toISOString() : String(b.createdAt),
  updatedAt: b.updatedAt instanceof Date ? b.updatedAt.toISOString() : String(b.updatedAt)
});

const mapPrismaService = (s: any): ServiceItem => {
  const matched = INITIAL_SERVICES.find(is => is.id === s.id);
  return {
    id: s.id,
    category: s.category as any,
    name: s.name,
    description: s.description,
    features: matched?.features || ['Professional electrical workmanship', 'Safety verified and guaranteed'],
    badge: matched?.badge
  };
};

export const saveDb = () => {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const jsonStr = JSON.stringify(memoryDb, null, 2);
    fs.writeFileSync(DB_FILE, jsonStr, 'utf-8');

    // Also mirror to root data/db.json if running from root to ensure multi-directory consistency
    const rootDataDir = path.resolve(process.cwd(), 'data');
    const rootDbFile = path.join(rootDataDir, 'db.json');
    if (rootDbFile !== DB_FILE && fs.existsSync(rootDataDir)) {
      fs.writeFileSync(rootDbFile, jsonStr, 'utf-8');
    }
  } catch (e) {
    console.warn('Local database file persist skipped (expected in read-only / cloud container):', e);
  }
};

export const initDb = async () => {
  // 1. Try local JSON file cache
  if (!fs.existsSync(DATA_DIR)) {
    try { fs.mkdirSync(DATA_DIR, { recursive: true }); } catch (_) {}
  }
  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      memoryDb = JSON.parse(content);
    } catch (e) {
      console.warn('Could not parse db.json, using defaults...', e);
    }
  }

  // 2. Try connecting to Supabase / PostgreSQL via Prisma if DATABASE_URL is set
  if (process.env.DATABASE_URL) {
    try {
      await prisma.$connect();
      isPrismaConnected = true;
      console.log('⚡ Connected to Supabase / PostgreSQL database successfully via Prisma.');

      // Check and seed admin user in Supabase
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash('26152215', salt);
      const adminExists = await prisma.user.findFirst({
        where: {
          OR: [
            { role: 'ADMIN' },
            { phone: 'naguomkar@service.com' },
            { phone: '9876543210' },
            { phone: 'admin' }
          ]
        }
      });

      if (!adminExists) {
        await prisma.user.create({
          data: {
            id: 'admin-master-id',
            name: 'Omkar Nagu (Administrator)',
            phone: 'naguomkar@service.com',
            address: 'Visakhapatnam, Andhra Pradesh',
            passwordHash,
            role: 'ADMIN'
          }
        });
        console.log('✔ Administrator user seeded in Supabase database.');
      } else {
        // Ensure credentials are up to date
        await prisma.user.update({
          where: { id: adminExists.id },
          data: {
            phone: 'naguomkar@service.com',
            passwordHash,
            role: 'ADMIN'
          }
        });
      }

      // Check and seed Services in Supabase
      const serviceCount = await prisma.service.count();
      if (serviceCount === 0) {
        for (const s of INITIAL_SERVICES) {
          await prisma.service.create({
            data: {
              id: s.id,
              category: s.category,
              name: s.name,
              description: s.description,
              isActive: true
            }
          });
        }
        console.log(`✔ Seeded ${INITIAL_SERVICES.length} services into Supabase database.`);
      }

      // Sync booking count to determine next booking number
      const highestBooking = await prisma.booking.findFirst({
        orderBy: { createdAt: 'desc' }
      });
      if (highestBooking && highestBooking.bookingNumber) {
        const match = highestBooking.bookingNumber.match(/ON-EW-(\d+)/);
        if (match && match[1]) {
          memoryDb.nextBookingIdNumber = Math.max(memoryDb.nextBookingIdNumber, parseInt(match[1], 10) + 1);
        }
      }

      // Populate memory cache from Supabase for fast lookups
      const allUsers = await prisma.user.findMany();
      memoryDb.users = allUsers.map(mapPrismaUser);

      const allServices = await prisma.service.findMany();
      memoryDb.services = allServices.map(mapPrismaService);

      const allBookings = await prisma.booking.findMany({
        include: { customer: true },
        orderBy: { createdAt: 'desc' }
      });
      memoryDb.bookings = allBookings.map(mapPrismaBooking);

      saveDb();
      console.log('✔ Supabase database state synchronized successfully.');
      return;
    } catch (dbErr) {
      isPrismaConnected = false;
      console.warn('⚠️ Could not connect to Supabase PostgreSQL, operating with persistent local store:', dbErr);
    }
  } else {
    console.log('ℹ No DATABASE_URL provided. Operating with persistent local storage.');
  }

  // 3. Fallback: Seed local memory store if Prisma not connected
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('26152215', salt);
  const adminExists = memoryDb.users.find(u => u.role === 'ADMIN' || u.phone === 'naguomkar@service.com' || u.phone === '9876543210' || u.phone === 'admin');
  if (adminExists) {
    adminExists.phone = 'naguomkar@service.com';
    adminExists.passwordHash = passwordHash;
    adminExists.role = 'ADMIN';
    adminExists.updatedAt = new Date().toISOString();
  } else {
    const adminUser: UserRecord = {
      id: 'admin-master-id',
      name: 'Omkar Nagu (Administrator)',
      phone: 'naguomkar@service.com',
      address: 'Visakhapatnam, Andhra Pradesh',
      passwordHash,
      role: 'ADMIN',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    memoryDb.users.push(adminUser);
  }

  // Ensure default demo customer exists
  const demoCustomer = memoryDb.users.find(u => u.phone === '9988776655');
  if (!demoCustomer) {
    const custSalt = await bcrypt.genSalt(10);
    const custPasswordHash = await bcrypt.hash('Customer@123', custSalt);
    const customerUser: UserRecord = {
      id: 'demo-customer-id',
      name: 'Santhosh Kumar',
      phone: '9988776655',
      address: 'Plot 42, MVP Colony, Visakhapatnam, Andhra Pradesh',
      passwordHash: custPasswordHash,
      role: 'CUSTOMER',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    memoryDb.users.push(customerUser);

    if (memoryDb.bookings.length === 0) {
      memoryDb.bookings = [
        {
          id: 'b-1020',
          bookingNumber: 'ON-EW-1020',
          customerId: 'demo-customer-id',
          customerName: 'Santhosh Kumar',
          customerPhone: '9988776655',
          serviceId: 'wire-house',
          category: 'Wiring',
          serviceName: 'House Wiring',
          address: 'Plot 42, MVP Colony, Visakhapatnam, Andhra Pradesh',
          preferredDate: '2026-10-15',
          preferredTime: '10:00 AM',
          description: 'Complete electrical wiring and conduit installation for newly constructed ground floor villa.',
          imageUrl: null,
          status: 'NEW',
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
          updatedAt: new Date(Date.now() - 3600000 * 2).toISOString()
        },
        {
          id: 'b-1021',
          bookingNumber: 'ON-EW-1021',
          customerId: 'demo-customer-id',
          customerName: 'Santhosh Kumar',
          customerPhone: '9988776655',
          serviceId: 'light-chandelier',
          category: 'Ceiling & Lighting',
          serviceName: 'Chandelier Installation',
          address: 'Plot 42, MVP Colony, Visakhapatnam, Andhra Pradesh',
          preferredDate: '2026-10-16',
          preferredTime: '02:00 PM',
          description: 'Heavy living room double-tier crystal chandelier hanging and dedicated dimmer connection.',
          imageUrl: null,
          status: 'CONFIRMED',
          createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
          updatedAt: new Date(Date.now() - 3600000 * 18).toISOString()
        }
      ];
      memoryDb.nextBookingIdNumber = 1025;
    }
  }

  if (!memoryDb.services || memoryDb.services.length === 0) {
    memoryDb.services = [...INITIAL_SERVICES];
  }

  saveDb();
  console.log('Database initialized successfully with seeded users & services.');
};

export const dbStore = {
  // Users
  findUserByPhone: async (phone: string): Promise<UserRecord | undefined> => {
    if (!phone) return undefined;
    const trimmed = phone.trim();
    const cleanSearch = trimmed.replace(/\D/g, '');
    const search10 = cleanSearch.length >= 10 ? cleanSearch.slice(-10) : cleanSearch;

    if (isPrismaConnected) {
      try {
        let user = await prisma.user.findFirst({
          where: {
            phone: { equals: trimmed, mode: 'insensitive' }
          }
        });
        if (!user && search10) {
          user = await prisma.user.findFirst({
            where: {
              phone: { endsWith: search10 }
            }
          });
        }
        if (user) return mapPrismaUser(user);
      } catch (e) {
        console.warn('Prisma findUserByPhone fallback:', e);
      }
    }

    return memoryDb.users.find(u => {
      if (u.phone.toLowerCase() === trimmed.toLowerCase()) return true;
      if (cleanSearch) {
        const cleanUserPhone = u.phone.replace(/\D/g, '');
        const user10 = cleanUserPhone.length >= 10 ? cleanUserPhone.slice(-10) : cleanUserPhone;
        if (user10 && search10 && user10 === search10) return true;
      }
      return false;
    });
  },

  getAdminUser: async (): Promise<UserRecord | undefined> => {
    if (isPrismaConnected) {
      try {
        const admin = await prisma.user.findFirst({
          where: { role: 'ADMIN' }
        });
        if (admin) return mapPrismaUser(admin);
      } catch (e) {
        console.warn('Prisma getAdminUser fallback:', e);
      }
    }
    return memoryDb.users.find(u => u.role === 'ADMIN');
  },

  findUserById: async (id: string): Promise<UserRecord | undefined> => {
    if (isPrismaConnected) {
      try {
        const user = await prisma.user.findUnique({
          where: { id }
        });
        if (user) return mapPrismaUser(user);
      } catch (e) {
        console.warn('Prisma findUserById fallback:', e);
      }
    }
    return memoryDb.users.find(u => u.id === id);
  },

  createUser: async (user: Omit<UserRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserRecord> => {
    if (isPrismaConnected) {
      try {
        const created = await prisma.user.create({
          data: {
            name: user.name,
            phone: user.phone,
            address: user.address,
            passwordHash: user.passwordHash,
            role: user.role
          }
        });
        const mapped = mapPrismaUser(created);
        memoryDb.users.push(mapped);
        saveDb();
        return mapped;
      } catch (e) {
        console.warn('Prisma createUser fallback:', e);
      }
    }

    const newUser: UserRecord = {
      ...user,
      id: `usr_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    memoryDb.users.push(newUser);
    saveDb();
    return newUser;
  },

  updateUser: async (id: string, updates: Partial<Pick<UserRecord, 'name' | 'phone' | 'address'>>): Promise<UserRecord | null> => {
    if (isPrismaConnected) {
      try {
        const updated = await prisma.user.update({
          where: { id },
          data: {
            ...(updates.name ? { name: updates.name } : {}),
            ...(updates.phone ? { phone: updates.phone } : {}),
            ...(updates.address ? { address: updates.address } : {})
          }
        });
        const mapped = mapPrismaUser(updated);
        const idx = memoryDb.users.findIndex(u => u.id === id);
        if (idx !== -1) memoryDb.users[idx] = mapped;
        saveDb();
        return mapped;
      } catch (e) {
        console.warn('Prisma updateUser fallback:', e);
      }
    }

    const user = memoryDb.users.find(u => u.id === id);
    if (!user) return null;
    if (updates.name) user.name = updates.name;
    if (updates.phone) user.phone = updates.phone;
    if (updates.address) user.address = updates.address;
    user.updatedAt = new Date().toISOString();
    saveDb();
    return user;
  },

  getAllCustomers: async (): Promise<Omit<UserRecord, 'passwordHash'>[]> => {
    if (isPrismaConnected) {
      try {
        const customers = await prisma.user.findMany({
          where: { role: 'CUSTOMER' },
          orderBy: { createdAt: 'desc' }
        });
        return customers.map(c => {
          const { passwordHash, ...rest } = mapPrismaUser(c);
          return rest;
        });
      } catch (e) {
        console.warn('Prisma getAllCustomers fallback:', e);
      }
    }

    return memoryDb.users
      .filter(u => u.role === 'CUSTOMER')
      .map(({ passwordHash, ...safeUser }) => safeUser);
  },

  // Services
  getServices: async (): Promise<ServiceItem[]> => {
    if (isPrismaConnected) {
      try {
        const services = await prisma.service.findMany({
          where: { isActive: true }
        });
        if (services.length > 0) return services.map(mapPrismaService);
      } catch (e) {
        console.warn('Prisma getServices fallback:', e);
      }
    }
    return memoryDb.services;
  },

  getServiceById: async (id: string): Promise<ServiceItem | undefined> => {
    if (isPrismaConnected) {
      try {
        const service = await prisma.service.findUnique({
          where: { id }
        });
        if (service) return mapPrismaService(service);
      } catch (e) {
        console.warn('Prisma getServiceById fallback:', e);
      }
    }
    return memoryDb.services.find(s => s.id === id);
  },

  // Bookings
  createBooking: async (data: {
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
  }): Promise<BookingRecord> => {
    const bookingNumber = `ON-EW-${memoryDb.nextBookingIdNumber++}`;

    if (isPrismaConnected) {
      try {
        const created = await prisma.booking.create({
          data: {
            bookingNumber,
            customerId: data.customerId,
            customerName: data.customerName,
            customerPhone: data.customerPhone,
            serviceId: data.serviceId || null,
            category: data.category,
            serviceName: data.serviceName,
            address: data.address,
            preferredDate: data.preferredDate,
            preferredTime: data.preferredTime,
            description: data.description,
            imageUrl: data.imageUrl || null,
            status: 'NEW'
          },
          include: {
            customer: true
          }
        });
        const mapped = mapPrismaBooking(created);
        memoryDb.bookings.unshift(mapped);
        saveDb();
        return mapped;
      } catch (e) {
        console.warn('Prisma createBooking fallback:', e);
      }
    }

    const newBooking: BookingRecord = {
      id: `bk_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      bookingNumber,
      customerId: data.customerId,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      serviceId: data.serviceId,
      category: data.category,
      serviceName: data.serviceName,
      address: data.address,
      preferredDate: data.preferredDate,
      preferredTime: data.preferredTime,
      description: data.description,
      imageUrl: data.imageUrl || null,
      status: 'NEW',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    memoryDb.bookings.unshift(newBooking);
    saveDb();
    return newBooking;
  },

  findBookingById: async (id: string): Promise<BookingRecord | undefined> => {
    if (isPrismaConnected) {
      try {
        const booking = await prisma.booking.findFirst({
          where: {
            OR: [{ id }, { bookingNumber: id }]
          },
          include: { customer: true }
        });
        if (booking) return mapPrismaBooking(booking);
      } catch (e) {
        console.warn('Prisma findBookingById fallback:', e);
      }
    }
    return memoryDb.bookings.find(b => b.id === id || b.bookingNumber === id);
  },

  findBookingsByCustomer: async (customerId: string): Promise<BookingRecord[]> => {
    if (isPrismaConnected) {
      try {
        const bookings = await prisma.booking.findMany({
          where: { customerId },
          include: { customer: true },
          orderBy: { createdAt: 'desc' }
        });
        return bookings.map(mapPrismaBooking);
      } catch (e) {
        console.warn('Prisma findBookingsByCustomer fallback:', e);
      }
    }
    return memoryDb.bookings
      .filter(b => b.customerId === customerId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getAllBookings: async (filterStatus?: string, search?: string): Promise<BookingRecord[]> => {
    if (isPrismaConnected) {
      try {
        const whereClause: any = {};
        if (filterStatus && filterStatus !== 'ALL') {
          whereClause.status = filterStatus;
        }
        if (search && search.trim()) {
          const q = search.trim();
          whereClause.OR = [
            { bookingNumber: { contains: q, mode: 'insensitive' } },
            { customerName: { contains: q, mode: 'insensitive' } },
            { customerPhone: { contains: q, mode: 'insensitive' } },
            { serviceName: { contains: q, mode: 'insensitive' } },
            { address: { contains: q, mode: 'insensitive' } }
          ];
        }

        const bookings = await prisma.booking.findMany({
          where: whereClause,
          include: { customer: true },
          orderBy: { createdAt: 'desc' }
        });
        return bookings.map(mapPrismaBooking);
      } catch (e) {
        console.warn('Prisma getAllBookings fallback:', e);
      }
    }

    let list = [...memoryDb.bookings];
    if (filterStatus && filterStatus !== 'ALL') {
      list = list.filter(b => b.status === filterStatus);
    }
    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(b =>
        b.bookingNumber.toLowerCase().includes(q) ||
        b.customerName.toLowerCase().includes(q) ||
        b.customerPhone.includes(q) ||
        b.serviceName.toLowerCase().includes(q) ||
        b.address.toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  updateBookingStatus: async (
    id: string,
    newStatus: 'NEW' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  ): Promise<BookingRecord | null> => {
    if (isPrismaConnected) {
      try {
        const updated = await prisma.booking.update({
          where: { id },
          data: { status: newStatus },
          include: { customer: true }
        });
        const mapped = mapPrismaBooking(updated);
        const idx = memoryDb.bookings.findIndex(b => b.id === id || b.bookingNumber === id);
        if (idx !== -1) memoryDb.bookings[idx] = mapped;
        saveDb();
        return mapped;
      } catch (e) {
        console.warn('Prisma updateBookingStatus fallback:', e);
      }
    }

    const booking = memoryDb.bookings.find(b => b.id === id || b.bookingNumber === id);
    if (!booking) return null;
    booking.status = newStatus;
    booking.updatedAt = new Date().toISOString();
    saveDb();
    return booking;
  },

  getDashboardStats: async () => {
    if (isPrismaConnected) {
      try {
        const [total, newCount, confirmed, inProgress, completed, cancelled] = await Promise.all([
          prisma.booking.count(),
          prisma.booking.count({ where: { status: 'NEW' } }),
          prisma.booking.count({ where: { status: 'CONFIRMED' } }),
          prisma.booking.count({ where: { status: 'IN_PROGRESS' } }),
          prisma.booking.count({ where: { status: 'COMPLETED' } }),
          prisma.booking.count({ where: { status: 'CANCELLED' } })
        ]);

        return {
          total,
          new: newCount,
          confirmed,
          inProgress,
          completed,
          cancelled
        };
      } catch (e) {
        console.warn('Prisma getDashboardStats fallback:', e);
      }
    }

    const total = memoryDb.bookings.length;
    const newRequests = memoryDb.bookings.filter(b => b.status === 'NEW').length;
    const confirmed = memoryDb.bookings.filter(b => b.status === 'CONFIRMED').length;
    const inProgress = memoryDb.bookings.filter(b => b.status === 'IN_PROGRESS').length;
    const completed = memoryDb.bookings.filter(b => b.status === 'COMPLETED').length;
    const cancelled = memoryDb.bookings.filter(b => b.status === 'CANCELLED').length;

    return {
      total,
      new: newRequests,
      confirmed,
      inProgress,
      completed,
      cancelled
    };
  }
};
