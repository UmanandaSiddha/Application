import express from "express";
import { createSubscription, testSubscription } from "../controllers/subscriptionController.js";
import { isAuthenticatedUser, isUserVerified } from "../middleware/auth.js";

const router = express.Router();

router.route("/new").post(isAuthenticatedUser, isUserVerified, createSubscription);
router.route("/webhook/raz").post(testSubscription);

export default router;