import express from "express";
import { 
    createCard,
    getCard,
    getUserCards,
    deleteCard,
    updateCard,
    getGeneralCard
} from "../controllers/cardsController.js";
import { isAuthenticatedUser, isUserPaid, isUserVerified } from "../middleware/auth.js";

const router = express.Router();

router.route("/new").post(isAuthenticatedUser, isUserVerified, isUserPaid, createCard);
router.route("/details/:id").get(getGeneralCard);
router.route("/detailed/:id").get(isAuthenticatedUser,  isUserVerified, getCard);
router.route("/user").get(isAuthenticatedUser, isUserVerified, getUserCards);
router.route("/edit/:id")
    .delete(isAuthenticatedUser, isUserVerified, isUserPaid, deleteCard)
    .put(isAuthenticatedUser, isUserVerified, isUserPaid, updateCard);

export default router;
