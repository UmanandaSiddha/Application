import express from "express";
import { captureSubscription, createSubscription, getLatestSubscription, getUserTransactions, verifySubscription } from "../controllers/subscriptionController.js";
import { isAuthenticatedUser, isUserVerified } from "../middleware/auth.js";

const router = express.Router();

router.route("/new").post(isAuthenticatedUser, isUserVerified, createSubscription);
router.route("/webhook/raz").post(verifySubscription);
router.route("/capture").post(isAuthenticatedUser, isUserVerified, captureSubscription);
router.route("/subscription/user").get(isAuthenticatedUser, isUserVerified, getLatestSubscription);
router.route("/transactions/user").get(isAuthenticatedUser, isUserVerified, getUserTransactions);

export default router;