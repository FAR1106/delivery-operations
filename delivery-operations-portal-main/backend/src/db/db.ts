/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

let activePool: any = null;

export const setPool = (newPool: any) => {
  activePool = newPool;
};

export const getPool = () => {
  if (!activePool) {
    const poolConfig = {
      host: process.env.PGHOST || 'localhost',
      port: parseInt(process.env.PGPORT || '5432', 10),
      user: process.env.PGUSER || 'postgres',
      password: process.env.PGPASSWORD || 'postgres',
      database: 'delivery_portal',
    };
    activePool = new Pool(poolConfig);
  }
  return activePool;
};

// Helper query function
export const query = async (text: string, params?: any[]) => {
  const poolInstance = getPool();
  return poolInstance.query(text, params);
};

export const pool = {
  query: (text: string, params?: any[]) => query(text, params),
};
