import type { VercelRequest, VercelResponse } from '@vercel/node';
import { query } from '../src/db/client';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    let dbStatus = 'disconnected';

    if (process.env.DATABASE_URL) {
      try {
        const rows = await query('SELECT NOW() as current_time, current_database() as db_name');
        dbStatus = `connected (db: ${rows[0]?.db_name || 'ok'})`;
      } catch (err: any) {
        dbStatus = `error: ${err.message || 'connection failed'}`;
      }
    } else {
      dbStatus = 'DATABASE_URL not configured';
    }

    return res.status(200).json({
      status: 'ok',
      service: 'Radar-e-Jang API',
      runtime: 'Vercel Serverless',
      database: dbStatus,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
}
