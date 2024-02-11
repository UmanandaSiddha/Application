import express from "express";
import {
    createCreatorVCard,
    updateCreatorVCard,
    getCreatorVCard,
    getGeneralVCard,
    deleteCreatorVCard
} from "../controllers/creatorController.js";
import { isAuthenticatedUser, authorizeRoles, isUserVerified, isUserPaid } from "../middleware/auth.js";

const router = express.Router();

router.route("/new").post(isAuthenticatedUser, isUserVerified, isUserPaid, createCreatorVCard);
router.route("/details/:id").get(getGeneralVCard);
router.route("/view").get(isAuthenticatedUser, isUserVerified, isUserPaid, getCreatorVCard);
router.route("/update").put(isAuthenticatedUser, isUserVerified, isUserPaid, updateCreatorVCard);
router.route("/delete").delete(isAuthenticatedUser, isUserVerified, isUserPaid, deleteCreatorVCard);

export default router;