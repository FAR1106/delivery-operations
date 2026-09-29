/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Router } from 'express';
import { addCompany, getCompanies, syncCompany, deleteCompany, updateCompany } from '../controllers/companyController';

const router = Router();

router.post('/', addCompany);
router.get('/', getCompanies);
router.patch('/:id', updateCompany);
router.post('/:id/sync', syncCompany);

router.delete('/:id', deleteCompany);

export default router;
