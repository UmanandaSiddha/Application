import express from "express";
import {
    createMedicalVCard,
    updateMedicalVCard,
    getMedicalVCard,
    getGeneralVCard,
    deleteMedicalVCard,
    getMedicalUserVCard
} from "../controllers/medicalController.js";
import { isAuthenticatedUser, authorizeRoles, isUserVerified, isUserPaid } from "../middleware/auth.js";

const router = express.Router();

router.route("/new").post(isAuthenticatedUser, isUserVerified, isUserPaid, createMedicalVCard);
router.route("/details/:id").get(getGeneralVCard);
router.route("/detailed/:id").get(isAuthenticatedUser,  isUserVerified, getMedicalVCard);
router.route("/userMedical").get(isAuthenticatedUser, isUserVerified, getMedicalUserVCard);
router.route("/delete/:id")
    .delete(isAuthenticatedUser, isUserVerified, isUserPaid, deleteMedicalVCard)
    .put(isAuthenticatedUser, isUserVerified, isUserPaid, updateMedicalVCard);

export default router;