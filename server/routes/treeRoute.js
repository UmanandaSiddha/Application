import express from "express";
import { 
    createTreeVCard,
    getTreeVCard,
    getUserVcards,
    deleteTreeVCard,
    updateTreeVCard
} from "../controllers/treeController.js";
import { isAuthenticatedUser, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

router.route("/new").post(isAuthenticatedUser, createTreeVCard);
router.route("/details/:id").get(getTreeVCard);
router.route("/userTree").get(isAuthenticatedUser, getUserVcards);
router.route("/delete/:id").delete(isAuthenticatedUser, deleteTreeVCard).put(isAuthenticatedUser, updateTreeVCard);

export default router;