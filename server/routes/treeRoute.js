import express from "express";
import { 
    createTreeVCard,
    getTreeVCard,
    getUserVcards,
    deleteTreeVCard,
    updateTreeVCard
} from "../controllers/treeController.js";
import { isAuthenticatedUser, isUserPaid, isUserVerified } from "../middleware/auth.js";

const router = express.Router();

router.route("/new").post(isAuthenticatedUser, isUserVerified, isUserPaid, createTreeVCard);
router.route("/details/:id").get(getTreeVCard);
router.route("/userTree").get(isAuthenticatedUser, isUserVerified, isUserPaid, getUserVcards);
router.route("/delete/:id")
    .delete(isAuthenticatedUser, isUserVerified, isUserPaid, deleteTreeVCard)
    .put(isAuthenticatedUser, isUserVerified, isUserPaid, updateTreeVCard);

export default router;