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
    fetchBlocked,
    updateBillingInfo,
    updateOrganisationDetails,
} from "../controllers/userController.js";
import { checkCancellation, checkDeactivated, isAuthenticatedUser, isUserVerified } from "../middleware/auth.js";

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/request/verification").get(isAuthenticatedUser, requestVerification);
router.route("/verify").put(isAuthenticatedUser, verifyUser);
router.route("/login").post(loginUser);
router.route("/block/:id").get(fetchBlocked);
router.route("/unblock/:id").get(unblockUser);
router.route("/logout").get(isAuthenticatedUser, logoutUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/set/password").put(isAuthenticatedUser, isUserVerified, checkDeactivated, setPassword);
router.route("/me").get(isAuthenticatedUser, checkDeactivated, checkCancellation, getUserDetails);
router.route("/billing/update").put(isAuthenticatedUser, isUserVerified, checkDeactivated, updateBillingInfo);
router.route("/org/update").put(isAuthenticatedUser, isUserVerified, checkDeactivated, updateOrganisationDetails);
router.route("/password/update").put(isAuthenticatedUser, isUserVerified, checkDeactivated, updatePassword);
router.route("/me/update").put(isAuthenticatedUser, isUserVerified, checkDeactivated, updateProfile);
router.route("/delete/account").delete(isAuthenticatedUser, isUserVerified, checkDeactivated, deleteAccount);

export default router;