// routes/crm/authRoutes.js — CrmUser login/session, independent of the
// site's Mongo-based JWT auth.
import express from "express";
import { login, logout, me } from "../../controllers/crm/authController.js";
import { authenticate } from "../../middleware/crmAuth.js";

const router = express.Router();

router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authenticate, me);

export default router;
