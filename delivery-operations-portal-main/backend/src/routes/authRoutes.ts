/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Router } from 'express';
import { login } from '../controllers/authController';

const router = Router();

router.post('/login', login);

export default router;
