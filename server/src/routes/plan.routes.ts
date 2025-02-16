import express from "express";
import { authorizeRoles, isAuthenticatedUser, isUserVerified } from "../middleware/auth.middleware.js";
import { getAllPlans, getCustomPlan, getPlan, requestCustomPlan } from "../controllers/plan.controller.js";
import { UserRoleEnum } from "../models/accounts/user.model.js";

const router = express.Router();


router.route("/request/custom").post(isAuthenticatedUser, isUserVerified, authorizeRoles(UserRoleEnum.ORGANIZATION, UserRoleEnum.ADMIN), requestCustomPlan);
router.route("/custom/view/:id").get(isAuthenticatedUser, isUserVerified, getCustomPlan);
router.route("/all").get(getAllPlans);
router.route("/details/:id").get(getPlan);

export default router;