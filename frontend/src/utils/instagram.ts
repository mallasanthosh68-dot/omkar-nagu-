import { Booking } from '../types';
import { generateWhatsAppMessage } from './whatsapp';

export const INSTAGRAM_USERNAME = 'omkarnag_electricwork.11';
export const INSTAGRAM_PROFILE_URL = 'https://www.instagram.com/omkarnag_electricwork.11';
export const INSTAGRAM_DM_URL = 'https://ig.me/m/omkarnag_electricwork.11';

export const getInstagramProfileUrl = (): string => {
  const envUrl = import.meta.env.VITE_INSTAGRAM_URL;
  if (envUrl && envUrl.trim()) {
    return envUrl.trim();
  }
  return INSTAGRAM_PROFILE_URL;
};

export const getInstagramUsername = (): string => {
  const envUser = import.meta.env.VITE_INSTAGRAM_USERNAME;
  if (envUser && envUser.trim()) {
    return envUser.trim();
  }
  return INSTAGRAM_USERNAME;
};

export const getInstagramDmUrl = (): string => {
  const username = getInstagramUsername();
  return `https://ig.me/m/${username}`;
};

/**
 * Copies the booking summary to clipboard and opens Instagram DM
 * because Instagram does not support pre-filling text via URL query parameters like WhatsApp.
 */
export const openInstagramBooking = async (booking: Booking): Promise<boolean> => {
  const message = generateWhatsAppMessage(booking);
  let copied = false;

  try {
    if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(message);
      copied = true;
    }
  } catch (err) {
    console.warn('Could not copy booking to clipboard:', err);
  }

  const dmUrl = getInstagramDmUrl();
  window.open(dmUrl, '_blank', 'noopener,noreferrer');
  return copied;
};
