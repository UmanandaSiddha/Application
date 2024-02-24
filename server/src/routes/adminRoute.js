import express from "express";
import { 
    loginAdmin
} from "../controllers/adminController.js";
// import { isAuthenticatedUser, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

router.route("/login").post(loginAdmin);

export default router;