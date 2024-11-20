import express from "express";
import { 
    capturePayment, 
    createDonation, 
    createDonationPlan, 
    createDonatorDetails, 
    createSubscription, 
    getDonator, 
    getDonatorSubscription, 
    getDonatorTransaction, 
    getParticularDonatorTransaction, 
    loginDonator, 
    logoutDonator, 
    sendDonatorOTP, 
    updatePanDetail, 
    verifyPayment 
} from "../controllers/donatorController.js";
import { isAuthenticatedDonator } from "../middleware/donatorAuth.js";

const router = express.Router();

router.route("/send/otp").post(sendDonatorOTP);
router.route("/login").put(loginDonator);
router.route("/me").get(isAuthenticatedDonator, getDonator);
router.route("/new").post(isAuthenticatedDonator, createDonatorDetails);
router.route("/edit/pan").put(isAuthenticatedDonator, updatePanDetail);
router.route("/new/plan").post(isAuthenticatedDonator, createDonationPlan);
router.route("/new/subscription").post(isAuthenticatedDonator, createSubscription);
router.route("/new/pay").post(isAuthenticatedDonator, createDonation);
router.route("/webhook/pay").post(capturePayment);
router.route("/verify/pay").post(isAuthenticatedDonator, verifyPayment);
router.route("/subcription/latest").get(isAuthenticatedDonator, getDonatorSubscription);
router.route("/transaction/all").get(isAuthenticatedDonator, getDonatorTransaction);
router.route("/transaction/:id").get(isAuthenticatedDonator, getParticularDonatorTransaction);
router.route("/logout").get(isAuthenticatedDonator, logoutDonator);

export default router;