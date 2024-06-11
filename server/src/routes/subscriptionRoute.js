import express from "express";
import { 
    cancelSubscription, 
    captureSubscription, 
    createFreeSubscription, 
    createSubscription, 
    getLatestSubscription, 
    getParticularTransaction, 
    getUserTransactions, 
    verifySubscription 
} from "../controllers/subscriptionController.js";
import { isAuthenticatedUser, isUserVerified } from "../middleware/auth.js";

const router = express.Router();

router.route("/new").post(isAuthenticatedUser, isUserVerified, createSubscription);
router.route("/new/free").post(isAuthenticatedUser, isUserVerified, createFreeSubscription);
router.route("/capture").post(isAuthenticatedUser, isUserVerified, captureSubscription);
router.route("/webhook/sub").post(verifySubscription);
router.route("/cancel/:id").get(isAuthenticatedUser, isUserVerified, cancelSubscription);
router.route("/subscription/latest").get(isAuthenticatedUser, isUserVerified, getLatestSubscription);
router.route("/transactions/all").get(isAuthenticatedUser, isUserVerified, getUserTransactions);
router.route("/transaction/:id").get(isAuthenticatedUser, isUserVerified, getParticularTransaction);

export default router;