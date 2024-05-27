import express from "express";
import { isAuthenticatedUser, isUserVerified, authorizeRoles } from "../middleware/auth.js";
import { 
    deleteUser,
    getUserAccount,
    getAllUsers,
    getSingleUser,
    updateCard,
    updateRole,
    adminLogin
} from "../controllers/adminController.js";
const router = express.Router();

router.route("/login").post(adminLogin);
router.route("/usertype").get(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), getUserAccount);
router.route("/users").get(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), getAllUsers);
router.route("/card/:id").put(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), updateCard);
router.route("/user/:id")
    .get(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), getSingleUser)
    .put(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), updateRole)
    .delete(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), deleteUser);

export default router;