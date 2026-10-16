import { Router, Request, Response } from 'express';
import { upload } from '../middleware/upload.js';
import { requireAuth } from '../middleware/auth.js';
import { uploadFile } from '../services/storageService.js';

const router = Router();

router.post('/', requireAuth, upload.single('photo'), async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No image file uploaded.' });
      return;
    }

    const fileUrl = await uploadFile(req.file);
    res.json({
      success: true,
      message: 'Photo uploaded successfully.',
      url: fileUrl,
      filename: req.file.originalname
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Upload failed.' });
  }
});

export default router;
