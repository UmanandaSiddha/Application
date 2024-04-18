import express from "express";
import { capturePayment, checkoutPayment, verifyPayment } from "../controllers/donationController.js";

const router = express.Router();

router.route("/new/pay").post(checkoutPayment);
router.route("/webhook/pay").post(capturePayment);
router.route("/verify/pay").post(verifyPayment);

export default router;