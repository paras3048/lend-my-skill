import { config } from 'dotenv';

config();

export const JWT_SECRET = process.env.JWT_SECRET;
export const SALT_ROUNDS = 10;
export const SUPABASE_URL = process.env.SUPABASE_URL;
export const SUPABASE_KEY = process.env.SUPABASE_KEY;
export const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
export const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
export const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
export const WEBHOOK_URL = process.env.WEBHOOK_URL;
export const STORAGE_BUCKET_URL = process.env.STORAGE_BUCKET_URL;
if (!JWT_SECRET)
  throw new Error(`ValueError: Please Add JWT_SECRET in \`.env\` file`);
if (!SUPABASE_KEY)
  throw new Error(`ValueError: Please Add SUPABASE_KEY in \`.env\` file`);
if (!SUPABASE_URL)
  throw new Error(`ValueError: Please Add SUPABASE_URL in \`.env\` file`);
if (!WEBHOOK_SECRET)
  throw new Error(`ValueError: Please Add WEBHOOK_SECRET in \`.env\` file`);
if (!RAZORPAY_KEY_ID)
  throw new Error(`ValueError: Please Add RAZORPAY_KEY_ID in \`.env\` file`);
if (!RAZORPAY_KEY_SECRET)
  throw new Error(
    `ValueError: Please Add RAZORPAY_KEY_SECRET in \`.env\` file`,
  );
if (!WEBHOOK_URL)
  throw new Error(`ValueError: Please Add WEBHOOK_URL in \`.env\` file`);
if (!STORAGE_BUCKET_URL)
  throw new Error(`ValueError: Please Add STORAGE_BUCKET_URL in \`.env\` file`);
