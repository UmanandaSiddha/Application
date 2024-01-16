import express from "express";
import {
    createPersonalVCard,
    updatePersonalVCard,
    getPersonalVCard,
    getGeneralVCard
} from "../controllers/personalController.js"
import { isAuthenticatedUser, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

router.route("/new").post(isAuthenticatedUser, createPersonalVCard);
router.route("/details/:id").get(getGeneralVCard);
router.route("/view").get(isAuthenticatedUser, getPersonalVCard);
router.route("/update/:id").put(isAuthenticatedUser, updatePersonalVCard);

export default router;