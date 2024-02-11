import express from "express";
import { 
    checkoutPayment,
    verifyPayment,
    getPayments
} from "../controllers/paymentController.js";
import { isAuthenticatedUser, isUserVerified } from "../middleware/auth.js";

const router = express.Router();

router.route("/view").get(isAuthenticatedUser, isUserVerified, getPayments)
router.route("/checkout").post(isAuthenticatedUser, isUserVerified, checkoutPayment);
router.route("/verify").post(isAuthenticatedUser, isUserVerified, verifyPayment);

export default router;