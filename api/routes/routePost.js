import express from 'express';
import { verificaUtente } from '../utils/verificaUtente.js';
import { creaPost, eliminaPost, getPosts, aggiornaPost } from '../controllers/controllerPost.js';

const router = express.Router();

/**
 * @route POST /api/posts/create
 * @desc Crea un nuovo post
 * @access Private (verificaUtente middleware)
 */
router.post('/create', verificaUtente, creaPost);

/**
 * @route GET /api/posts/getposts
 * @desc Ottiene tutti i post
 * @access Public
 */
router.get('/getposts', getPosts);

/**
 * @route DELETE /api/posts/deletepost/:postId/:userId
 * @desc Elimina un post specificato
 * @access Private (verificaUtente middleware)
 */
router.delete('/deletepost/:postId/:userId', verificaUtente, eliminaPost);

/**
 * @route PUT /api/posts/updatepost/:postId/:userId
 * @desc Aggiorna un post specificato
 * @access Private (verificaUtente middleware)
 */
router.put('/updatepost/:postId/:userId', verificaUtente, aggiornaPost);

export default router;
