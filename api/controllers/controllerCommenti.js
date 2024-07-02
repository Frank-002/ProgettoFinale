import Comment from "../models/Commento.js";
import { errorHandler } from "../utils/error.js";

/**
 * Crea un nuovo commento.
 * 
 * @param {Object} req - L'oggetto della richiesta contenente content, postId e userId nel corpo.
 * @param {Object} res - L'oggetto della risposta utilizzato per inviare la risposta al client.
 * @param {Function} next - La funzione middleware successiva nello stack.
 */
export const creaCommento = async (req, res, next) => {
  try {
    const { content, postId, userId } = req.body;

    if (userId !== req.user.id) {
      return next(errorHandler(403, "...Non sei autorizzato a commentare..."));
    }

    const newComment = new Comment({
      content,
      postId,
      userId,
    });

    await newComment.save();

    res.status(200).json(newComment);
  } catch (error) {
    next(error);
  }
};

/**
 * Recupera i commenti di un post.
 * 
 * @param {Object} req - L'oggetto della richiesta contenente postId come parametro.
 * @param {Object} res - L'oggetto della risposta utilizzato per inviare la risposta al client.
 * @param {Function} next - La funzione middleware successiva nello stack.
 */
export const getPostCommento = async (req, res, next) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({
      createdAt: -1,
    });

    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

/**
 * Gestisce i like sui commenti.
 * 
 * @param {Object} req - L'oggetto della richiesta contenente commentId come parametro.
 * @param {Object} res - L'oggetto della risposta utilizzato per inviare la risposta al client.
 * @param {Function} next - La funzione middleware successiva nello stack.
 */
export const likeCommento = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return next(errorHandler(404, "...Commento non trovato..."));
    }

    const userIndex = comment.likes.indexOf(req.user.id);

    if (userIndex === -1) {
      comment.numberOfLikes += 1;
      comment.likes.push(req.user.id);
    } else {
      comment.numberOfLikes -= 1;
      comment.likes.splice(userIndex, 1);
    }

    await comment.save();

    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};

/**
 * Modifica un commento.
 * 
 * @param {Object} req - L'oggetto della richiesta contenente commentId come parametro e content nel corpo.
 * @param {Object} res - L'oggetto della risposta utilizzato per inviare la risposta al client.
 * @param {Function} next - La funzione middleware successiva nello stack.
 */
export const modificaCommento = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return next(errorHandler(404, "...Commento non trovato..."));
    }

    if (comment.userId !== req.user.id && !req.user.isAdmin) {
      return next(
        errorHandler(403, "...Non sei autorizzato a modificare questo commento...")
      );
    }

    const editedComment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      {
        content: req.body.content,
      },
      { new: true }
    );

    res.status(200).json(editedComment);
  } catch (error) {
    next(error);
  }
};

/**
 * Elimina un commento.
 * 
 * @param {Object} req - L'oggetto della richiesta contenente commentId come parametro.
 * @param {Object} res - L'oggetto della risposta utilizzato per inviare la risposta al client.
 * @param {Function} next - La funzione middleware successiva nello stack.
 */
export const eliminaCommento = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, "...Commento non trovato..."));
    }
    if (comment.userId !== req.user.id && !req.user.isAdmin) {
      return next(
        errorHandler(403, "...Non sei autorizzato ad eliminare questo commento...")
      );
    }
    await Comment.findByIdAndDelete(req.params.commentId);
    res.status(200).json("...Commento eliminato...");
  } catch (error) {
    next(error);
  }
};

/**
 * Recupera tutti i commenti (solo per amministratori).
 * 
 * @param {Object} req - L'oggetto della richiesta contenente parametri di query opzionali per paginazione e ordinamento.
 * @param {Object} res - L'oggetto della risposta utilizzato per inviare la risposta al client.
 * @param {Function} next - La funzione middleware successiva nello stack.
 */
export const getComments = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(
      errorHandler(403, "...Non sei autorizzato...")
    );
  }

  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "desc" ? -1 : 1;

    const comments = await Comment.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalComments = await Comment.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const commentsInLastMonth = await Comment.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({ comments, totalComments, commentsInLastMonth });
  } catch (error) {
    next(error);
  }
};
