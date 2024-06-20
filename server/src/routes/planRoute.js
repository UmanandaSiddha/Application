import express from "express";
import { 
    getAllPlans,
    getCustomPlan,
    getPlan,
    requestCustomPlan,
} from "../controllers/planController.js";
import { authorizeRoles, isAuthenticatedUser, isUserVerified } from "../middleware/auth.js";

const router = express.Router();


router.route("/request/custom").post(isAuthenticatedUser, isUserVerified, authorizeRoles("org"), requestCustomPlan);
router.route("/custom/view/:id").get(isAuthenticatedUser, isUserVerified, getCustomPlan);
router.route("/all").get(getAllPlans);
router.route("/details/:id").get(getPlan);

export default router;