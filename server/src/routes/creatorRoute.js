import express from "express";
import {
    createCreatorVCard,
    updateCreatorVCard,
    getCreatorVCard,
    getGeneralVCard,
    deleteCreatorVCard,
    getCreatorUserVCard
} from "../controllers/creatorController.js";
import { isAuthenticatedUser, authorizeRoles, isUserVerified, isUserPaid } from "../middleware/auth.js";

const router = express.Router();

router.route("/new").post(isAuthenticatedUser, isUserVerified, isUserPaid, createCreatorVCard);
router.route("/details/:id").get(getGeneralVCard);
router.route("/detailed/:id").get(isAuthenticatedUser,  isUserVerified, getCreatorVCard);
router.route("/userCreator").get(isAuthenticatedUser, isUserVerified, getCreatorUserVCard);
router.route("/delete/:id")
    .delete(isAuthenticatedUser, isUserVerified, isUserPaid, deleteCreatorVCard)
    .put(isAuthenticatedUser, isUserVerified, isUserPaid, updateCreatorVCard);

export default router;