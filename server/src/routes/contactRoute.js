import express from "express";

import { authorizeRoles, isAuthenticatedUser, isUserVerified } from "../middleware/auth.js";
import { getAttendedContact, getContact, getReport, getSingleContact } from "../controllers/contactController.js";

const router = express.Router();

router.route("con/all").get(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), getContact);
router.route("/re/all").get(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), getReport);
router.route("con/attended").get(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), getAttendedContact);
router.route("con/:id").get(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), getSingleContact);

export default router;