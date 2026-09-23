// routes/crm/leadsRoutes.js — read/update access to Lead records.
import express from "express";
import { listLeads, getLead, updateLead } from "../../controllers/crm/leadsController.js";
import { authenticate } from "../../middleware/crmAuth.js";

const router = express.Router();
router.use(authenticate);

router.get("/", listLeads);
router.get("/:id", getLead);
router.patch("/:id", updateLead);

export default router;
