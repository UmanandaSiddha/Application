import express from "express";
import {
    createMedicalVCard,
    updateMedicalVCard,
    getMedicalVCard,
    getGeneralVCard,
    deleteMedicalVCard
} from "../controllers/medicalController.js";
import { isAuthenticatedUser, authorizeRoles, isUserVerified, isUserPaid } from "../middleware/auth.js";

const router = express.Router();

router.route("/new").post(isAuthenticatedUser, isUserVerified, isUserPaid, createMedicalVCard);
router.route("/details/:id").get(getGeneralVCard);
router.route("/view").get(isAuthenticatedUser, isUserVerified, getMedicalVCard);
router.route("/update").put(isAuthenticatedUser, isUserVerified, isUserPaid, updateMedicalVCard);
router.route("/delete").delete(isAuthenticatedUser, isUserVerified, isUserPaid, deleteMedicalVCard);

export default router;