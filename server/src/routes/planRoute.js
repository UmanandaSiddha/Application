import express from "express";
import { 
    attendCustomRequests,
    createCustomPlan,
    createFreePlan,
    createPlan,
    deletePlan,
    getAllPlans,
    getCustomPlan,
    getPlan,
    rejectCustomPlan,
    requestCustomPlan,
    switchFreePlanVisibility,
    updateFreePlan
} from "../controllers/planController.js";
import { authorizeRoles, isAuthenticatedUser, isUserVerified } from "../middleware/auth.js";

const router = express.Router();

router.route("/new").post(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), createPlan);
router.route("/new/free").post(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), createFreePlan);
router.route("/free/:id").put(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), updateFreePlan);
router.route("/free/switch/:id").put(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), switchFreePlanVisibility);
router.route("/request/custom").post(isAuthenticatedUser, isUserVerified, authorizeRoles("org"), requestCustomPlan);
router.route("/new/custom").post(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), createCustomPlan);
router.route("/custom/attend").put(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), attendCustomRequests);
router.route("/custom/reject").put(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), rejectCustomPlan);
router.route("/custom/view/:id").get(isAuthenticatedUser, isUserVerified, getCustomPlan);
router.route("/delete/:id").delete(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), deletePlan);
router.route("/all").get(getAllPlans);
router.route("/details/:id").get(getPlan);

export default router;