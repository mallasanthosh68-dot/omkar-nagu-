import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { dbStore, UserRecord } from '../config/db.js';
import { signToken } from '../utils/jwt.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, phone, address, password, confirmPassword } = req.body;

    // Validation
    if (!name || !name.trim()) {
      res.status(400).json({ success: false, message: 'Full name is required.' });
      return;
    }

    if (!phone || !phone.trim()) {
      res.status(400).json({ success: false, message: 'Phone number is required.' });
      return;
    }

    // Indian phone number normalization and validation
    let cleanPhone = phone.trim().replace(/\D/g, '');
    if (cleanPhone.length === 12 && cleanPhone.startsWith('91')) {
      cleanPhone = cleanPhone.slice(2);
    } else if (cleanPhone.length === 11 && cleanPhone.startsWith('0')) {
      cleanPhone = cleanPhone.slice(1);
    }

    const validPhoneRegex = /^[6-9]\d{9}$/;
    if (!validPhoneRegex.test(cleanPhone)) {
      res.status(400).json({
        success: false,
        message: 'Please enter a valid 10-digit Indian mobile number (e.g., 9876543210).'
      });
      return;
    }

    if (!address || !address.trim()) {
      res.status(400).json({ success: false, message: 'Service address is required.' });
      return;
    }

    if (!password || password.length < 8) {
      res.status(400).json({ success: false, message: 'Password must be at least 8 characters long.' });
      return;
    }

    if (password !== confirmPassword) {
      res.status(400).json({ success: false, message: 'Password confirmation does not match.' });
      return;
    }

    // Check if phone number already registered
    const existing = await dbStore.findUserByPhone(cleanPhone);
    if (existing) {
      res.status(409).json({
        success: false,
        message: 'An account with this phone number already exists. Please login instead.'
      });
      return;
    }

    // Hash password with bcrypt
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await dbStore.createUser({
      name: name.trim(),
      phone: cleanPhone,
      address: address.trim(),
      passwordHash,
      role: 'CUSTOMER'
    });

    const token = signToken({
      userId: newUser.id,
      phone: newUser.phone,
      role: newUser.role,
      name: newUser.name
    });

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        phone: newUser.phone,
        address: newUser.address,
        role: newUser.role
      }
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration. Please try again.' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      res.status(400).json({ success: false, message: 'Phone number and password are required.' });
      return;
    }

    const trimmed = phone.trim().toLowerCase();
    let user = await dbStore.findUserByPhone(phone.trim());
    if (!user && (trimmed === 'naguomkar@service.com' || trimmed === 'admin' || trimmed === 'administrator')) {
      user = await dbStore.getAdminUser();
    }
    if (!user) {
      let cleanPhone = phone.trim().replace(/\D/g, '');
      if (cleanPhone.length === 12 && cleanPhone.startsWith('91')) {
        cleanPhone = cleanPhone.slice(2);
      } else if (cleanPhone.length === 11 && cleanPhone.startsWith('0')) {
        cleanPhone = cleanPhone.slice(1);
      }
      if (cleanPhone) {
        user = await dbStore.findUserByPhone(cleanPhone);
      }
    }

    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid phone number / username or password.' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      res.status(401).json({ success: false, message: 'Invalid phone number / username or password.' });
      return;
    }

    const token = signToken({
      userId: user.id,
      phone: user.phone,
      role: user.role,
      name: user.name
    });

    res.json({
      success: true,
      message: 'Logged in successfully!',
      token,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        address: user.address,
        role: user.role
      }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login. Please try again.' });
  }
};

export const adminLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      res.status(400).json({ success: false, message: 'Admin ID / Email and password are required.' });
      return;
    }

    const identifier = phone.trim().toLowerCase();
    let user: UserRecord | undefined;

    // Support naguomkar@service.com, admin, or phone lookup
    if (identifier === 'admin' || identifier === 'administrator' || identifier === 'naguomkar@service.com') {
      user = await dbStore.getAdminUser();
    } else {
      user = await dbStore.findUserByPhone(phone.trim());
      if (!user) {
        let cleanPhone = phone.trim().replace(/\D/g, '');
        if (cleanPhone.length === 12 && cleanPhone.startsWith('91')) {
          cleanPhone = cleanPhone.slice(2);
        } else if (cleanPhone.length === 11 && cleanPhone.startsWith('0')) {
          cleanPhone = cleanPhone.slice(1);
        }
        if (cleanPhone) {
          user = await dbStore.findUserByPhone(cleanPhone);
        }
      }
    }

    if (!user || user.role !== 'ADMIN') {
      res.status(401).json({ success: false, message: 'Invalid administrator credentials.' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      res.status(401).json({ success: false, message: 'Invalid administrator credentials.' });
      return;
    }

    const token = signToken({
      userId: user.id,
      phone: user.phone,
      role: user.role,
      name: user.name
    });

    res.json({
      success: true,
      message: 'Administrator logged in successfully!',
      token,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        address: user.address,
        role: user.role
      }
    });
  } catch (error: any) {
    console.error('Admin login error:', error);
    res.status(500).json({ success: false, message: 'Server error during admin login.' });
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    res.json({
      success: true,
      user: {
        id: req.user.id,
        name: req.user.name,
        phone: req.user.phone,
        address: req.user.address,
        role: req.user.role
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve profile.' });
  }
};
