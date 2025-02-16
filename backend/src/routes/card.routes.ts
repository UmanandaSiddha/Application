import express from "express";
import { hasAccess, isAuthenticatedUser, isUserVerified } from "../middleware/auth.middleware.js";
import {
    createBatchCards,
    createCard,
    deleteCard,
    getDisplayCard,
    getGeneralCard,
    getUserCards,
    updateCard
} from "../controllers/card.controller.js";

const router = express.Router();

// router.route("/short/:id").get(getCardIdByShortCode);
router.route("/new").post(isAuthenticatedUser, isUserVerified, hasAccess, createCard);
router.route("/new/batch").post(isAuthenticatedUser, isUserVerified, hasAccess, createBatchCards);
router.route("/details/:id").get(getDisplayCard);
router.route("/detailed/:id").get(isAuthenticatedUser, isUserVerified, getGeneralCard);
router.route("/user").get(isAuthenticatedUser, isUserVerified, getUserCards);
router.route("/edit/:id")
    .delete(isAuthenticatedUser, isUserVerified, hasAccess, deleteCard)
    .put(isAuthenticatedUser, isUserVerified, hasAccess, updateCard);

export default router;
