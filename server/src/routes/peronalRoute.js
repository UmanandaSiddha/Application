import express from "express";
import {
    createPersonalVCard,
    updatePersonalVCard,
    getPersonalVCard,
    getGeneralVCard,
    deletePersonalVCard,
    getPersonalUserVCard
} from "../controllers/personalController.js"
import { isAuthenticatedUser, isUserPaid, authorizeRoles, isUserVerified } from "../middleware/auth.js";

const router = express.Router();

router.route("/new").post(isAuthenticatedUser, isUserVerified, isUserPaid, createPersonalVCard);
router.route("/details/:id").get(getGeneralVCard);
router.route("/detailed/:id").get(isAuthenticatedUser,  isUserVerified, getPersonalVCard);
router.route("/userPersonal").get(isAuthenticatedUser, isUserVerified, getPersonalUserVCard);
router.route("/delete/:id")
    .delete(isAuthenticatedUser, isUserVerified, isUserPaid, deletePersonalVCard)
    .put(isAuthenticatedUser, isUserVerified, isUserPaid, updatePersonalVCard);

export default router;