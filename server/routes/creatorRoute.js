import express from "express";
import {
    createCreatorVCard,
    updateCreatorVCard,
    getCreatorVCard,
    getGeneralVCard
} from "../controllers/creatorController.js";
import { isAuthenticatedUser, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

router.route("/new").post(isAuthenticatedUser, createCreatorVCard);
router.route("/details/:id").get(getGeneralVCard);
router.route("/view").get(isAuthenticatedUser, getCreatorVCard);
router.route("/update/:id").put(isAuthenticatedUser, updateCreatorVCard);

export default router;