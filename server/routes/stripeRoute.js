import express from "express";
import { 
    createPayment
} from "../controllers/stripeController.js";
import { isAuthenticatedUser } from "../middleware/auth.js";

const router = express.Router();

router.route("/new").post(isAuthenticatedUser, createPayment);

export default router;