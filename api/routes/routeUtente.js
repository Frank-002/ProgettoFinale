import express from "express";
const router = express.Router();
import { eliminaUtente, getUser, getUsers, signOut, test, aggiornaUtente } from "../controllers/controllerUtente.js";
import { verificaUtente } from "../utils/verificaUtente.js";

/**
 * @route GET /api/users/test
 * @desc Test endpoint per controllare il funzionamento delle API
 * @access Public
 */
router.get("/test", test);

/**
 * @route PUT /api/users/update/:userId
 * @desc Aggiorna le informazioni di un utente
 * @access Private (verificaUtente middleware)
 */
router.put("/update/:userId", verificaUtente, aggiornaUtente);

/**
 * @route DELETE /api/users/delete/:userId
 * @desc Elimina un utente
 * @access Private (verificaUtente middleware)
 */
router.delete("/delete/:userId", verificaUtente, eliminaUtente);

/**
 * @route POST /api/users/signout
 * @desc Scollega l'utente, cancellando il cookie di accesso
 * @access Public
 */
router.post("/signout", signOut);

/**
 * @route GET /api/users/getusers
 * @desc Ottiene tutti gli utenti
 * @access Private (verificaUtente middleware)
 */
router.get("/getusers", verificaUtente, getUsers);

/**
 * @route GET /api/users/:userId
 * @desc Ottiene le informazioni di un utente specifico
 * @access Public
 */
router.get("/:userId", getUser);

export default router;
