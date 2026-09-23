// routes/crm/siteVisitsRoutes.js — SiteVisit records: scheduling and
// tracking property visits between a Lead and the CrmUser handling it.
import express from "express";
import { listSiteVisits, createSiteVisit, updateSiteVisit } from "../../controllers/crm/siteVisitsController.js";
import { authenticate } from "../../middleware/crmAuth.js";

const router = express.Router();
router.use(authenticate);

router.get("/", listSiteVisits);
router.post("/", createSiteVisit);
router.patch("/:id", updateSiteVisit);

export default router;
