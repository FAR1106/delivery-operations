/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Router } from 'express';
import { 
  getProjects, 
  getRisks, 
  getResources, 
  createResourceController,
  updateResourceAllocationController,
  getResourceDemandsController,
  createResourceDemandController,
  getResourceRagRecommendationController,
  getReports, 
  getEmployees, 
  updateEmployeeAccess,
  getPortfolioTrends,
  getCapacityForecast,
  getOperationalConfidence,
  getAiBriefingController,
  getProjectAiReportController,
  getSlaMetrics,
  getTelemetryEvents,
  askCopilotController,
  updateRiskStatusController,
  getRiskAiRecommendationController
} from '../controllers/dashboardController';

const router = Router();

router.get('/projects', getProjects);
router.get('/projects/:id/ai-report', getProjectAiReportController);
router.post('/projects/:id/ai-report', getProjectAiReportController);
router.get('/risks', getRisks);
router.patch('/risks/:id/status', updateRiskStatusController);
router.get('/risks/:id/ai-recommendation', getRiskAiRecommendationController);
router.get('/resources', getResources);
router.post('/resources', createResourceController);
router.patch('/resources/:id/allocation', updateResourceAllocationController);
router.get('/resources/rag-recommendation', getResourceRagRecommendationController);
router.get('/resource-demands', getResourceDemandsController);
router.post('/resource-demands', createResourceDemandController);
router.get('/reports', getReports);
router.get('/employees', getEmployees);
router.post('/employees/access', updateEmployeeAccess);
router.get('/trends', getPortfolioTrends);
router.get('/capacity-forecast', getCapacityForecast);
router.get('/operational-confidence', getOperationalConfidence);
router.get('/ai-briefing', getAiBriefingController);
router.get('/sla', getSlaMetrics);
router.get('/events', getTelemetryEvents);
router.post('/copilot', askCopilotController);

export default router;


