import express from "express";
import { 
    checkoutPayment,
    verifyPayment,
    getPayments
} from "../controllers/paymentController.js";
import { isAuthenticatedUser } from "../middleware/auth.js";

const router = express.Router();

router.route("/view").get(isAuthenticatedUser, getPayments)
router.route("/checkout").post(isAuthenticatedUser, checkoutPayment);
router.route("/verify/:validity/:amount/:planName").post(isAuthenticatedUser, verifyPayment);

export default router;