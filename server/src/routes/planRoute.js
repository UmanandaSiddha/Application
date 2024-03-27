import express from "express";
import { 
    createPlan,
    deletePlan,
    getAllPlans,
    getPlan
} from "../controllers/planController.js";
import { authorizeRoles, isAuthenticatedUser, isUserVerified } from "../middleware/auth.js";

const router = express.Router();

router.route("/new").post(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), createPlan);
router.route("/all").get(isAuthenticatedUser, isUserVerified, getAllPlans);
router.route("/details/:id").get(isAuthenticatedUser, isUserVerified, getPlan);
router.route("/delete/:id").delete(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), deletePlan);

export default router;