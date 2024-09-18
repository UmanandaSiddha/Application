import express from "express";
import { isAuthenticatedUser, isUserVerified, authorizeRoles } from "../middleware/auth.js";
import { deleteErrorLogs, deleteInfoLogs, getErrorLogs, getInfoLogs } from "../controllers/admin/logsController.js";
import { adminLogin, blockUser, deleteUser, freeAccess, getAllUsers, getSingleUser, reActivateUser, revokeFreeAccess, unBlockUser, updateCard, updateRole } from "../controllers/admin/userController.js";
import { getAllContacts, getSingleContact, switchAttendedContact, deleteContact } from "../controllers/admin/contactController.js";
import { attendCustomRequests, createCustomPlan, getAllCustomRequests, getParticularRequest, rejectCustomPlan } from "../controllers/admin/requestController.js";
import { createFreePlan, createPlan, deletePlan, getAllPlans, getParticularPlan, switchPlanVisibility, updateFreePlan, updatePlan } from "../controllers/admin/planController.js";
import { getAllCards, getCardStats, getUserCards } from "../controllers/admin/cardsController.js";
import { getAllTransactions, getDonatorTransactions, getUserTransactions } from "../controllers/admin/transactionController.js";
import { getAllUserSubscriptions, getDonatorSubscriptions, getUserLatestSubscription, getUserSubscriptions } from "../controllers/admin/subscriptionController.js";
import { getAllDonators, getSingleDonator } from "../controllers/admin/donatorController.js";

const router = express.Router();

// Donator Controller
router.route("/donator/all").get(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), getAllDonators);
router.route("/donator/byId/:id").get(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), getSingleDonator);

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
router.route("/users/byId/:id")
    .get(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), getSingleUser)
    .put(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), updateRole);

router.route("/users/free/access/:id").put(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), freeAccess);
router.route("/users/free/revoke/:id").put(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), revokeFreeAccess);

router.route("/users/block/:id").put(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), blockUser);
router.route("/users/unblock/:id").put(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), unBlockUser);

router.route("/users/card/:id").put(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), updateCard);
router.route("/users/reactivate/:id").put(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), reActivateUser);
router.route("/users/deactivate/:id").put(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), deleteUser);

// Cards controller
router.route("/cards/all").get(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), getAllCards);
router.route("/cards/user/:id").get(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), getUserCards);
router.route("/cards/stats/:id").get(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), getCardStats);

// Contact controller
router.route("/contacts/all").get(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), getAllContacts);
router.route("/contacts/:id")
    .get(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), getSingleContact)
    .put(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), switchAttendedContact)
    .delete(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), deleteContact);

// Request controller 
router.route("/request/all").get(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), getAllCustomRequests);
router.route("/request/:id").get(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), getParticularRequest);
router.route("/request/create").post(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), createCustomPlan);
router.route("/request/attend/:id").put(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), attendCustomRequests);
router.route("/request/reject/:id").put(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), rejectCustomPlan);

// Plan controller
router.route("/plans/new").post(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), createPlan);
router.route("/plans/free/new").post(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), createFreePlan);
router.route("/plans/free/:id").put(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), updateFreePlan);
router.route("/plans/all").get(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), getAllPlans);
router.route("/plans/byId/:id")
    .get(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), getParticularPlan)
    .post(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), updatePlan)
    .put(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), switchPlanVisibility)
    .delete(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), deletePlan);

// transactions
router.route("/transac/all").get(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), getAllTransactions);
router.route("/transac/user/:id").get(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), getUserTransactions);
router.route("/transac/donator/:id").get(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), getDonatorTransactions);

// subscriptions
router.route("/sub/latest").get(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), getUserLatestSubscription);
router.route("/sub/user/:id").get(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), getUserSubscriptions);
router.route("/sub/donator/:id").get(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), getDonatorSubscriptions);
router.route("/sub/all").get(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), getAllUserSubscriptions);

export default router;