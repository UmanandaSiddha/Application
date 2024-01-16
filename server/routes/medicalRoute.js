import express from "express";
import {
    createMedicalVCard,
    updateMedicalVCard,
    getMedicalVCard,
    getGeneralVCard
} from "../controllers/medicalController.js";
import { isAuthenticatedUser, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

router.route("/new").post(isAuthenticatedUser, createMedicalVCard);
router.route("/details/:id").get(getGeneralVCard);
router.route("/view").get(isAuthenticatedUser, getMedicalVCard);
router.route("/update/:id").put(isAuthenticatedUser, updateMedicalVCard);

export default router;