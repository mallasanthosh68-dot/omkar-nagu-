import type { VercelRequest, VercelResponse } from '@vercel/node';

let isDbInitialized = false;
let appInstance: any = null;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Normalize req.url so Express receives the full requested endpoint if rewritten by Vercel
  const reqAny = req as any;
  if (reqAny.originalUrl && req.url !== reqAny.originalUrl) {
    req.url = reqAny.originalUrl;
  }
  if (!appInstance) {
    try {
      const appModule = await import('../backend/src/app.js');
      appInstance = appModule.app || appModule.default;
      
      const dbModule = await import('../backend/src/config/db.js');
      if (!isDbInitialized && dbModule.initDb) {
        await dbModule.initDb();
        isDbInitialized = true;
      }
    } catch (err) {
      console.error('Error initializing serverless app in api/index.ts:', err);
      return res.status(500).json({
        success: false,
        message: 'Serverless initialization failed',
        error: String(err)
      });
    }
  }

  return appInstance(req, res);
}
