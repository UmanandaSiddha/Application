import express from "express";
import { 
    createCard,
    getDisplayCard,
    getUserCards,
    deleteCard,
    updateCard,
    getGeneralCard,
    getCardIdByShortCode,
    createBatchCards
} from "../controllers/cardsController.js";
import { isAuthenticatedUser, isUserPaid, isUserVerified } from "../middleware/auth.js";

const router = express.Router();

router.route("/short/:id").get(getCardIdByShortCode);
router.route("/new").post(isAuthenticatedUser, isUserVerified, isUserPaid, createCard);
router.route("/new/batch").post(isAuthenticatedUser, isUserVerified, isUserPaid, createBatchCards);
router.route("/details/:id").get(getDisplayCard);
router.route("/detailed/:id").get(isAuthenticatedUser,  isUserVerified, getGeneralCard);
router.route("/user").get(isAuthenticatedUser, isUserVerified, getUserCards);
router.route("/edit/:id")
    .delete(isAuthenticatedUser, isUserVerified, isUserPaid, deleteCard)
    .put(isAuthenticatedUser, isUserVerified, isUserPaid, updateCard);

export default router;
