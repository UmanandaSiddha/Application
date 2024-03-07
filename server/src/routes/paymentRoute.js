import express from "express";
import { 
    checkoutPayment,
    verifyPayment,
    getPayments,
    testVerify,
    createSubscription
} from "../controllers/paymentController.js";
import { isAuthenticatedUser, isUserVerified } from "../middleware/auth.js";

const router = express.Router();

router.route("/view").get(isAuthenticatedUser, isUserVerified, getPayments);
router.route("/test").post(testVerify);
router.route("/sub").get(createSubscription);
router.route("/checkout").post(isAuthenticatedUser, isUserVerified, checkoutPayment);
router.route("/verify").post(isAuthenticatedUser, isUserVerified, verifyPayment);

export default router;