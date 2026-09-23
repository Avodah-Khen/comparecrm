// routes/crm/dashboardRoutes.js — aggregate stats for the CRM dashboard,
// computed live from Lead/LeadActivity/SiteVisit — never hardcoded.
import express from "express";
import { getStats } from "../../controllers/crm/dashboardController.js";
import { authenticate } from "../../middleware/crmAuth.js";

const router = express.Router();
router.use(authenticate);

router.get("/stats", getStats);

export default router;
