import express from "express";
import { 
    createTreeVCard,
    getTreeVCard,
    getUserVcards,
    deleteTreeVCard,
    updateTreeVCard,
    getGeneralVCard
} from "../controllers/treeController.js";
import { isAuthenticatedUser, isUserPaid, isUserVerified } from "../middleware/auth.js";

const router = express.Router();

router.route("/new").post(isAuthenticatedUser, isUserVerified, isUserPaid, createTreeVCard);
router.route("/details/:id").get(getGeneralVCard);
router.route("/detailed/:id").get(isAuthenticatedUser,  isUserVerified, getTreeVCard);
router.route("/userTree").get(isAuthenticatedUser, isUserVerified, getUserVcards);
router.route("/delete/:id")
    .delete(isAuthenticatedUser, isUserVerified, isUserPaid, deleteTreeVCard)
    .put(isAuthenticatedUser, isUserVerified, isUserPaid, updateTreeVCard);

export default router;