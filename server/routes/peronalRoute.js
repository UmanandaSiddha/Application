import express from "express";
import {
    createPersonalVCard,
    updatePersonalVCard,
    getPersonalVCard,
    getGeneralVCard,
    deletePersonalVCard
} from "../controllers/personalController.js"
import { isAuthenticatedUser, isUserPaid, authorizeRoles, isUserVerified } from "../middleware/auth.js";

const router = express.Router();

router.route("/new").post(isAuthenticatedUser, isUserVerified, isUserPaid, createPersonalVCard);
router.route("/details/:id").get(getGeneralVCard);
router.route("/view").get(isAuthenticatedUser, isUserVerified, isUserPaid, getPersonalVCard);
router.route("/update").put(isAuthenticatedUser, isUserVerified, isUserPaid, updatePersonalVCard);
router.route("/delete").delete(isAuthenticatedUser, isUserVerified, isUserPaid, deletePersonalVCard);

export default router;