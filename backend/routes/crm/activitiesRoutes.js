// routes/crm/activitiesRoutes.js — LeadActivity records: audit trail of
// notes/status-change events attached to a Lead.
import express from "express";
import { listActivities, createActivity } from "../../controllers/crm/activitiesController.js";
import { authenticate } from "../../middleware/crmAuth.js";

const router = express.Router();
router.use(authenticate);

router.get("/", listActivities);
router.post("/", createActivity);

export default router;
