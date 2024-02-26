import express from "express";
import { 
    createAnimalVCard, 
    deleteAnimalVCard, 
    getAnimalVCard, 
    getGeneralVCard, 
    getUserVcards, 
    updateAnimalVCard 
} from "../controllers/animalController.js";
import { isAuthenticatedUser, isUserPaid, isUserVerified } from "../middleware/auth.js";

const router = express.Router();

router.route("/new").post(isAuthenticatedUser, isUserVerified, isUserPaid, createAnimalVCard);
router.route("/details/:id").get(getGeneralVCard);
router.route("/detailed/:id").get(isAuthenticatedUser,  isUserVerified, getAnimalVCard);
router.route("/userAnimal").get(isAuthenticatedUser, isUserVerified, getUserVcards);
router.route("/delete/:id")
    .delete(isAuthenticatedUser, isUserVerified, isUserPaid, deleteAnimalVCard)
    .put(isAuthenticatedUser, isUserVerified, isUserPaid, updateAnimalVCard);

export default router;