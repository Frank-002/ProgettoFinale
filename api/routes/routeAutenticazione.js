import express from "express";
import { google, login, registrazione } from "../controllers/Autenticazione.js";

const router = express.Router();

/**
 * @route POST /api/auth/signup
 * @desc Registrazione di un nuovo utente
 * @access Public
 */
router.post("/signup", registrazione);

/**
 * @route POST /api/auth/signin
 * @desc Login di un utente esistente
 * @access Public
 */
router.post("/signin", login);

/**
 * @route POST /api/auth/google
 * @desc Login o registrazione tramite Google OAuth
 * @access Public
 */
router.post("/google", google);

export default router;
