import express from "express";
import { captureSubscription, createSubscription, getUserTransactions, verifySubscription } from "../controllers/subscriptionController.js";
import { isAuthenticatedUser, isUserVerified } from "../middleware/auth.js";

const router = express.Router();

router.route("/new").post(isAuthenticatedUser, isUserVerified, createSubscription);
router.route("/webhook/raz").post(verifySubscription);
router.route("/transactions/user").get(isAuthenticatedUser, isUserVerified, getUserTransactions);
router.route("/capture").post(isAuthenticatedUser, isUserVerified, captureSubscription);

export default router;