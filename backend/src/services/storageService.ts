import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

const supabase = (supabaseUrl && supabaseKey)
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export const uploadFile = async (file: Express.Multer.File): Promise<string> => {
  // 1. Try Supabase Storage if configured
  if (supabase) {
    try {
      const ext = file.originalname.split('.').pop() || 'jpg';
      const fileName = `booking-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;

      const { data, error } = await supabase.storage
        .from('booking-photos')
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: true
        });

      if (!error && data) {
        const { data: publicUrlData } = supabase.storage
          .from('booking-photos')
          .getPublicUrl(fileName);
        if (publicUrlData?.publicUrl) {
          return publicUrlData.publicUrl;
        }
      }
    } catch (err) {
      console.warn('Supabase storage upload failed, falling back to base64 data URI:', err);
    }
  }

  // 2. Universal reliable fallback for Vercel Serverless: base64 Data URI
  return `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
};
