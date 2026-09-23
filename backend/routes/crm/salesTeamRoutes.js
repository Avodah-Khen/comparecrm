// routes/crm/salesTeamRoutes.js — CrmUser management: the sales team
// roster, roles (admin/sales_manager/sales_rep), active status.
import express from "express";
import {
  listSalesTeam,
  createSalesTeamMember,
  updateSalesTeamMember,
} from "../../controllers/crm/salesTeamController.js";
import { authenticate, requireRole } from "../../middleware/crmAuth.js";

const router = express.Router();
router.use(authenticate);

router.get("/", listSalesTeam);
router.post("/", requireRole("admin"), createSalesTeamMember);
router.patch("/:id", requireRole("admin"), updateSalesTeamMember);

export default router;
