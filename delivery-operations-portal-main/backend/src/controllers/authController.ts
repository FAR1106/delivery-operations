/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Request, Response } from 'express';
import { query } from '../db/db';

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password, portal, role } = req.body;

  if (!email || !password || !portal) {
    res.status(400).json({ error: 'Please enter your email, password, and portal type' });
    return;
  }

  try {
    // 1. Admin login verification
    if (portal === 'admin') {
      const result = await query(
        "SELECT * FROM users WHERE role = 'Codin City Admin' AND email = $1 AND password_hash = $2",
        [email, password]
      );

      if (result.rowCount === 0) {
        res.status(401).json({ error: 'Invalid Codin City Admin credentials' });
        return;
      }

      const adminUser = result.rows[0];

      res.status(200).json({
        success: true,
        token: 'mock-jwt-admin-token-xyz',
        user: {
          id: adminUser.id,
          email: adminUser.email,
          role: adminUser.role,
          name: adminUser.name,
          initials: adminUser.initials,
          title: adminUser.title
        }
      });
      return;
    }

    // 2. Regular Enterprise Portal login verification
    if (portal === 'user') {
      if (!role) {
        res.status(400).json({ error: 'Role access mode is required for enterprise login' });
        return;
      }

      const result = await query(
        "SELECT * FROM users WHERE LOWER(email) = LOWER($1) AND password_hash = $2 AND role = $3",
        [email, password, role]
      );

      if (result.rowCount === 0) {
        res.status(401).json({ error: 'Invalid credentials or role mismatch for the enterprise portal' });
        return;
      }

      const matchedUser = result.rows[0];

      res.status(200).json({
        success: true,
        token: `mock-jwt-user-token-${matchedUser.id}`,
        user: {
          id: matchedUser.id,
          email: matchedUser.email,
          role: matchedUser.role,
          name: matchedUser.name,
          initials: matchedUser.initials,
          title: matchedUser.title
        }
      });
      return;
    }

    res.status(400).json({ error: 'Invalid portal type specified' });
  } catch (error: any) {
    console.error('Authentication query failed:', error);
    res.status(500).json({ error: 'Authentication query failed on server' });
  }
};
