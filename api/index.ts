import type { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../backend/src/app.js';
import { initDb } from '../backend/src/config/db.js';

let isDbInitialized = false;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!isDbInitialized) {
    try {
      await initDb();
      isDbInitialized = true;
    } catch (err) {
      console.error('Error during initDb in Vercel Serverless Function:', err);
    }
  }
  return app(req, res);
}
