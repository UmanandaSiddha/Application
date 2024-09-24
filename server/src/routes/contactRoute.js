import express from "express";
import { createContact } from "../controllers/contactController.js";

const router = express.Router();

router.route("/new").post(createContact);

export default router;