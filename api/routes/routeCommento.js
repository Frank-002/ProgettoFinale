import express from 'express';
import { verificaUtente } from '../utils/verificaUtente.js';
import { creaCommento, eliminaCommento, modificaCommento, getComments, getPostCommento, likeCommento } from '../controllers/controllerCommenti.js';

const router = express.Router();

/**
 * @route POST /api/comments/create
 * @desc Crea un nuovo commento
 * @access Private (verificaUtente middleware)
 */
router.post('/create', verificaUtente, creaCommento);

/**
 * @route GET /api/comments/getPostComments/:postId
 * @desc Ottiene i commenti di un post specificato
 * @access Public
 */
router.get('/getPostComments/:postId', getPostCommento);

/**
 * @route PUT /api/comments/likeComment/:commentId
 * @desc Gestisce il like/dislike di un commento
 * @access Private (verificaUtente middleware)
 */
router.put('/likeComment/:commentId', verificaUtente, likeCommento);

/**
 * @route PUT /api/comments/editComment/:commentId
 * @desc Modifica un commento esistente
 * @access Private (verificaUtente middleware)
 */
router.put('/editComment/:commentId', verificaUtente, modificaCommento);

/**
 * @route DELETE /api/comments/deleteComment/:commentId
 * @desc Elimina un commento esistente
 * @access Private (verificaUtente middleware)
 */
router.delete('/deleteComment/:commentId', verificaUtente, eliminaCommento);

/**
 * @route GET /api/comments/getComments
 * @desc Ottiene tutti i commenti (utilizzato per scopi amministrativi)
 * @access Private (verificaUtente middleware)
 */
router.get('/getComments', verificaUtente, getComments);

export default router;
