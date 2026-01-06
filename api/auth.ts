import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import cors from 'cors';
import authRouter from '../server/src/routes/auth';
import { initDatabase } from '../server/src/database';

const app = express();
app.use(cors());
app.use(express.json());
app.use(authRouter);

// Initialize database once
let dbInitialized = false;
async function ensureDB() {
  if (!dbInitialized) {
    await initDatabase();
    dbInitialized = true;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await ensureDB();
  return app(req as any, res as any);
}
