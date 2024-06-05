import express from "express";
import { 
    registerUser, 
    loginUser, 
    logoutUser, 
    forgotPassword, 
    resetPassword, 
    getUserDetails, 
    updatePassword,
    updateProfile,
    verifyUser,
    requestVerification,
    deleteAccount,
    setPassword,
    unblockUser,
} from "../controllers/userController.js";
import { isAuthenticatedUser, isUserVerified } from "../middleware/auth.js";

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/request/verification").get(isAuthenticatedUser, requestVerification);
router.route("/verify").put(isAuthenticatedUser, verifyUser);
router.route("/logout").get(isAuthenticatedUser, logoutUser);
router.route("/me").get(isAuthenticatedUser, getUserDetails);
router.route("/me/update").put(isAuthenticatedUser, isUserVerified, updateProfile);
router.route("/password/update").put(isAuthenticatedUser, isUserVerified, updatePassword);
router.route("/set/password").put(isAuthenticatedUser, isUserVerified, setPassword);
router.route("/delete/account").delete(isAuthenticatedUser, isUserVerified, deleteAccount);

router.route("/unblock/:id").put(unblockUser);

export default router;