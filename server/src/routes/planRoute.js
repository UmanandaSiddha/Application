import express from "express";
import { 
    createPlan,
    deletePlan,
    getAllPlans,
    getCustomPlan,
    getPlan,
    requestCustomPlan
} from "../controllers/planController.js";
import { authorizeRoles, isAuthenticatedUser, isUserVerified } from "../middleware/auth.js";

const router = express.Router();

router.route("/new").post(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), createPlan);
router.route("/all").get(isAuthenticatedUser, isUserVerified, getAllPlans);
router.route("/request").post(isAuthenticatedUser, isUserVerified, requestCustomPlan)
router.route("/request/:id").get(isAuthenticatedUser, isUserVerified, getCustomPlan);
router.route("/details/:id").get(getPlan);
router.route("/delete/:id").delete(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), deletePlan);

export default router;