import express from "express";
import { capturePayment, createDonation, verifyPayment } from "../controllers/donatorController";

const router = express.Router();

router.route("/new/pay").post(createDonation);
router.route("/webhook/pay").post(capturePayment);
router.route("/verify/pay").post(verifyPayment);

export default router;