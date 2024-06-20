import express from "express";
import { isAuthenticatedUser, isUserVerified, authorizeRoles } from "../middleware/auth.js";
import { deleteErrorLogs, deleteInfoLogs, getErrorLogs, getInfoLogs } from "../controllers/admin/logsController.js";
import { adminLogin, deleteUser, freeAccess, getAllUsers, getSingleUser, reActivateUser, updateCard, updateRole } from "../controllers/admin/userController.js";
import { 
    getAllContacts, 
    getAllReports, 
    getAttendedContact, 
    getAttendedReport, 
    getUnAttendedReport, 
    getUnAttendedContact, 
    getSingleContact, 
    getSingleReport,
    switchAttendedContact,
    deleteContact,
    switchAttendedReport,
    deleteReport
} from "../controllers/admin/contactController.js";
import { attendCustomRequests, createCustomPlan, rejectCustomPlan } from "../controllers/admin/requestController.js";
import { createFreePlan, createPlan, deletePlan, switchFreePlanVisibility, updateFreePlan } from "../controllers/admin/planController.js";
const router = express.Router();

// Logs controller
router.route("/logs/info")
    .get(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), getInfoLogs)
    .delete(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), deleteInfoLogs);
router.route("/logs/error")
    .get(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), getErrorLogs)
    .delete(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), deleteErrorLogs);

// User controller
router.route("/users/login").post(adminLogin);
router.route("/users/all").get(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), getAllUsers);
router.route("/users/free/access").put(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), freeAccess);
router.route("/users/card/:id").put(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), updateCard);
router.route("/users/reactivate/:id").put(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), reActivateUser);
router.route("/users/:id")
    .get(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), getSingleUser)
    .put(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), updateRole)
    .delete(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), deleteUser);

// Contact controller
router.route("/contacts/all").get(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), getAllContacts);
router.route("/contacts/attended/true").get(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), getAttendedContact);
router.route("/contacts/attended/false").get(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), getUnAttendedContact);
router.route("/contacts/:id")
    .get(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), getSingleContact)
    .put(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), switchAttendedContact)
    .delete(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), deleteContact);

// Report controller
router.route("/reports/all").get(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), getAllReports);
router.route("/reports/attended/true").get(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), getAttendedReport);
router.route("/reports/attended/false").get(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), getUnAttendedReport);
router.route("/reports/:id")
    .get(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), getSingleReport)
    .put(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), switchAttendedReport)
    .delete(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), deleteReport);

// Request controller 
router.route("/request/create").post(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), createCustomPlan);
router.route("/request/attend/:id").put(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), attendCustomRequests);
router.route("/request/reject/:id").put(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), rejectCustomPlan);

// Plan controller
router.route("/plans/new").post(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), createPlan);
router.route("/plans/free/new").post(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), createFreePlan);
router.route("/plans/free/:id").put(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), updateFreePlan);
router.route("/plans/free/visible/:id").put(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), switchFreePlanVisibility);
router.route("/plans/:id").delete(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), deletePlan);

export default router;