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
    getAllUsers,
    getSingleUser,
    deleteUser,
    updateRole, 
    verifyUser,
    requestVerification,
    deleteAccount
} from "../controllers/userController.js";
import { isAuthenticatedUser, isUserVerified, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/request/verification").get(isAuthenticatedUser, requestVerification);
router.route("/verify/:token").put(verifyUser);
router.route("/logout").get(isAuthenticatedUser, logoutUser);
router.route("/me").get(isAuthenticatedUser, getUserDetails);
router.route("/me/update").put(isAuthenticatedUser, isUserVerified, updateProfile);
router.route("/password/update").put(isAuthenticatedUser, isUserVerified, updatePassword);
router.route("/delete/account").delete(isAuthenticatedUser, isUserVerified, deleteAccount);
router.route("/admin/users").get(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), getAllUsers);
router.route("/admin/user/:id")
    .get(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), getSingleUser)
    .put(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), updateRole)
    .delete(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), deleteUser);

export default router;