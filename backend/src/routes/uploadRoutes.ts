import { Router, Request, Response } from 'express';
import { upload } from '../middleware/upload.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/', requireAuth, upload.single('photo'), (req: Request, res: Response): void => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No image file uploaded.' });
      return;
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({
      success: true,
      message: 'Photo uploaded successfully.',
      url: fileUrl,
      filename: req.file.filename
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Upload failed.' });
  }
});

export default router;
