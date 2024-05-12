import express from "express";
import { isAuthenticatedUser, isUserVerified, authorizeRoles } from "../middleware/auth.js";
import { 
    deleteUser,
    getAllUsers,
    getSingleUser,
    updateCard,
    updateRole
} from "../controllers/adminController.js";
const router = express.Router();

router.route("/admin/users").get(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), getAllUsers);
router.route("/admin/card/:id").put(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), updateCard);
router.route("/admin/user/:id")
    .get(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), getSingleUser)
    .put(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), updateRole)
    .delete(isAuthenticatedUser, isUserVerified, authorizeRoles("admin"), deleteUser);

export default router;