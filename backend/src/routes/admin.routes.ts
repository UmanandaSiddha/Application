import express from "express";
import { authorizeRoles, isAuthenticatedUser, isUserVerified } from "../middleware/auth.middleware.js";
import { UserRoleEnum } from "../models/accounts/user.model.js";
import { getAllDonators, getSingleDonator } from "../controllers/admin/donator.controller.js";
import { deleteErrorLogs, deleteInfoLogs, getErrorLogs, getInfoLogs } from "../controllers/admin/logs.controller.js";
import { adminLogin, blockUser, deleteUser, freeAccess, getAllUsers, getSingleUser, reActivateUser, revokeFreeAccess, unBlockUser, updateRole } from "../controllers/admin/user.controller.js";
import { deleteCard, getUserCards, updateCard } from "../controllers/card.controller.js";
import { getAllCards, getCardStats, getSingleCard } from "../controllers/admin/card.controller.js";
import { deleteContact, getAllContacts, getSingleContact, switchAttendedContact } from "../controllers/admin/contact.controller.js";
import { attendCustomRequests, createCustomPlan, deleteRequest, getAllCustomRequests, getParticularRequest, rejectCustomPlan } from "../controllers/admin/request.controller.js";
import { createFreePlan, createPlan, deletePlan, getParticularPlan, switchPlanVisibility, updateFreePlan, updatePlan } from "../controllers/admin/plan.controller.js";
import { getAllPlans } from "../controllers/plan.controller.js";
import { deleteTransaction, getAllTransactions, getDonatorTransactions, updateTransaction } from "../controllers/admin/transaction.controller.js";
import { getParticularTransaction, getUserTransactions } from "../controllers/subscription.controller.js";
import { deleteSubscription, getAllUserSubscriptions, getDonatorSubscriptions, getParticularSubscription, getUserSubscriptions, updateSubscription } from "../controllers/admin/subscription.controller.js";

const router = express.Router();

// Donator Controller
router.route("/donator/all").get(isAuthenticatedUser, isUserVerified, authorizeRoles(UserRoleEnum.ADMIN), getAllDonators);
router.route("/donator/byId/:id").get(isAuthenticatedUser, isUserVerified, authorizeRoles(UserRoleEnum.ADMIN), getSingleDonator);

// Logs controller
router.route("/logs/info")
    .get(isAuthenticatedUser, isUserVerified, authorizeRoles(UserRoleEnum.ADMIN), getInfoLogs)
    .delete(isAuthenticatedUser, isUserVerified, authorizeRoles(UserRoleEnum.ADMIN), deleteInfoLogs);
router.route("/logs/error")
    .get(isAuthenticatedUser, isUserVerified, authorizeRoles(UserRoleEnum.ADMIN), getErrorLogs)
    .delete(isAuthenticatedUser, isUserVerified, authorizeRoles(UserRoleEnum.ADMIN), deleteErrorLogs);

// User controller
router.route("/users/login").post(adminLogin);
router.route("/users/all").get(isAuthenticatedUser, isUserVerified, authorizeRoles(UserRoleEnum.ADMIN), getAllUsers);
router.route("/users/byId/:id")
    .get(isAuthenticatedUser, isUserVerified, authorizeRoles(UserRoleEnum.ADMIN), getSingleUser)
    .put(isAuthenticatedUser, isUserVerified, authorizeRoles(UserRoleEnum.ADMIN), updateRole);
router.route("/users/free/access/:id").put(isAuthenticatedUser, isUserVerified, authorizeRoles(UserRoleEnum.ADMIN), freeAccess);
router.route("/users/free/revoke/:id").put(isAuthenticatedUser, isUserVerified, authorizeRoles(UserRoleEnum.ADMIN), revokeFreeAccess);
router.route("/users/block/:id").put(isAuthenticatedUser, isUserVerified, authorizeRoles(UserRoleEnum.ADMIN), blockUser);
router.route("/users/unblock/:id").put(isAuthenticatedUser, isUserVerified, authorizeRoles(UserRoleEnum.ADMIN), unBlockUser);
router.route("/users/card/:id").put(isAuthenticatedUser, isUserVerified, authorizeRoles(UserRoleEnum.ADMIN), updateCard);
router.route("/users/reactivate/:id").put(isAuthenticatedUser, isUserVerified, authorizeRoles(UserRoleEnum.ADMIN), reActivateUser);
router.route("/users/deactivate/:id").put(isAuthenticatedUser, isUserVerified, authorizeRoles(UserRoleEnum.ADMIN), deleteUser);

// Cards controller
router.route("/cards/all").get(isAuthenticatedUser, isUserVerified, authorizeRoles(UserRoleEnum.ADMIN), getAllCards);
router.route("/cards/user/:id").get(isAuthenticatedUser, isUserVerified, authorizeRoles(UserRoleEnum.ADMIN), getUserCards);
router.route("/cards/stats/:id").get(isAuthenticatedUser, isUserVerified, authorizeRoles(UserRoleEnum.ADMIN), getCardStats);
router.route("/cards/byId/:id")
    .get(isAuthenticatedUser, isUserVerified, authorizeRoles(UserRoleEnum.ADMIN), getSingleCard)
    .delete(isAuthenticatedUser, isUserVerified, authorizeRoles(UserRoleEnum.ADMIN), deleteCard);

// Contact controller
router.route("/contacts/all").get(isAuthenticatedUser, isUserVerified, authorizeRoles(UserRoleEnum.ADMIN), getAllContacts);
router.route("/contacts/byId/:id")
    .get(isAuthenticatedUser, isUserVerified, authorizeRoles(UserRoleEnum.ADMIN), getSingleContact)
    .put(isAuthenticatedUser, isUserVerified, authorizeRoles(UserRoleEnum.ADMIN), switchAttendedContact)
    .delete(isAuthenticatedUser, isUserVerified, authorizeRoles(UserRoleEnum.ADMIN), deleteContact);

// Request controller 
router.route("/request/all").get(isAuthenticatedUser, isUserVerified, authorizeRoles(UserRoleEnum.ADMIN), getAllCustomRequests);
router.route("/request/byId/:id")
    .get(isAuthenticatedUser, isUserVerified, authorizeRoles(UserRoleEnum.ADMIN), getParticularRequest)
    .delete(isAuthenticatedUser, isUserVerified, authorizeRoles(UserRoleEnum.ADMIN), deleteRequest);
router.route("/request/new/:id").post(isAuthenticatedUser, isUserVerified, authorizeRoles(UserRoleEnum.ADMIN), createCustomPlan);
router.route("/request/attend/:id").put(isAuthenticatedUser, isUserVerified, authorizeRoles(UserRoleEnum.ADMIN), attendCustomRequests);
router.route("/request/reject/:id").put(isAuthenticatedUser, isUserVerified, authorizeRoles(UserRoleEnum.ADMIN), rejectCustomPlan);

// Plan controller
router.route("/plans/new").post(isAuthenticatedUser, isUserVerified, authorizeRoles(UserRoleEnum.ADMIN), createPlan);
router.route("/plans/free/new").post(isAuthenticatedUser, isUserVerified, authorizeRoles(UserRoleEnum.ADMIN), createFreePlan);
router.route("/plans/free/:id").put(isAuthenticatedUser, isUserVerified, authorizeRoles(UserRoleEnum.ADMIN), updateFreePlan);
router.route("/plans/all").get(isAuthenticatedUser, isUserVerified, authorizeRoles(UserRoleEnum.ADMIN), getAllPlans);
router.route("/plans/byId/:id")
    .get(isAuthenticatedUser, isUserVerified, authorizeRoles(UserRoleEnum.ADMIN), getParticularPlan)
    .post(isAuthenticatedUser, isUserVerified, authorizeRoles(UserRoleEnum.ADMIN), updatePlan)
    .put(isAuthenticatedUser, isUserVerified, authorizeRoles(UserRoleEnum.ADMIN), switchPlanVisibility)
    .delete(isAuthenticatedUser, isUserVerified, authorizeRoles(UserRoleEnum.ADMIN), deletePlan);

// transactions
router.route("/transac/all").get(isAuthenticatedUser, isUserVerified, authorizeRoles(UserRoleEnum.ADMIN), getAllTransactions);
router.route("/transac/byId/:id")
    .get(isAuthenticatedUser, isUserVerified, authorizeRoles(UserRoleEnum.ADMIN), getParticularTransaction)
    .put(isAuthenticatedUser, isUserVerified, authorizeRoles(UserRoleEnum.ADMIN), updateTransaction)
    .delete(isAuthenticatedUser, isUserVerified, authorizeRoles(UserRoleEnum.ADMIN), deleteTransaction);
router.route("/transac/user/:id").get(isAuthenticatedUser, isUserVerified, authorizeRoles(UserRoleEnum.ADMIN), getUserTransactions);
router.route("/transac/donator/:id").get(isAuthenticatedUser, isUserVerified, authorizeRoles(UserRoleEnum.ADMIN), getDonatorTransactions);

// subscriptions
router.route("/sub/user/:id").get(isAuthenticatedUser, isUserVerified, authorizeRoles(UserRoleEnum.ADMIN), getUserSubscriptions);
router.route("/sub/byId/:id")
    .get(isAuthenticatedUser, isUserVerified, authorizeRoles(UserRoleEnum.ADMIN), getParticularSubscription)
    .put(isAuthenticatedUser, isUserVerified, authorizeRoles(UserRoleEnum.ADMIN), updateSubscription)
    .delete(isAuthenticatedUser, isUserVerified, authorizeRoles(UserRoleEnum.ADMIN), deleteSubscription);
router.route("/sub/donator/:id").get(isAuthenticatedUser, isUserVerified, authorizeRoles(UserRoleEnum.ADMIN), getDonatorSubscriptions);
router.route("/sub/all").get(isAuthenticatedUser, isUserVerified, authorizeRoles(UserRoleEnum.ADMIN), getAllUserSubscriptions);

export default router;