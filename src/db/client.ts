import pg from 'pg';

const { Pool } = pg;

// Global singleton pool for PostgreSQL in serverless environments (Vercel)
declare global {
  // eslint-disable-next-line no-var
  var pgPoolGlobal: pg.Pool | undefined;
}

export function getPostgresPool(): pg.Pool | null {
  // Only initialize on server-side (Node.js / Vercel Serverless)
  if (typeof window !== 'undefined') {
    return null;
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.warn('[Database] DATABASE_URL is not set.');
    return null;
  }

  if (!globalThis.pgPoolGlobal) {
    const isLocalhost = connectionString.includes('localhost') || connectionString.includes('127.0.0.1');

    globalThis.pgPoolGlobal = new Pool({
      connectionString,
      ssl: isLocalhost ? false : { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

    globalThis.pgPoolGlobal.on('error', (err) => {
      console.error('[Database Pool Error]:', err.message);
    });
  }

  return globalThis.pgPoolGlobal;
}

/**
 * Execute a query against PostgreSQL using DATABASE_URL
 */
export async function query<T = any>(text: string, params?: any[]): Promise<T[]> {
  const pool = getPostgresPool();
  if (!pool) {
    throw new Error('DATABASE_URL is not configured or running in client-side environment.');
  }
  const res = await pool.query(text, params);
  return res.rows as T[];
}

export const dbPool = typeof window === 'undefined' ? getPostgresPool() : null;
