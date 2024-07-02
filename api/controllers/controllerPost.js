import Post from "../models/Post.js";
import { errorHandler } from "../utils/error.js";

/**
 * Crea un nuovo post.
 * 
 * @param {Object} req - L'oggetto della richiesta contenente i dati del post nel corpo.
 * @param {Object} res - L'oggetto della risposta utilizzato per inviare la risposta al client.
 * @param {Function} next - La funzione middleware successiva nello stack.
 */
export const creaPost = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "...Non sei autorizzato a creare un post..."));
  }

  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, "...Titolo e contenuto sono richiesti..."));
  }

  const slug = req.body.title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "");

  const newPost = new Post({
    ...req.body,
    slug,
    userId: req.user.id,
  });

  try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    next(error);
  }
};

/**
 * Elimina un post.
 * 
 * @param {Object} req - L'oggetto della richiesta contenente postId come parametro.
 * @param {Object} res - L'oggetto della risposta utilizzato per inviare la risposta al client.
 * @param {Function} next - La funzione middleware successiva nello stack.
 */
export const eliminaPost = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(
      errorHandler(403, "...Non sei autorizzato a eliminare il post...")
    );
  }

  try {
    await Post.findByIdAndDelete(req.params.postId);
    res.status(200).json("...Post eliminato correttamente...");
  } catch (error) {
    next(error);
  }
};

/**
 * Aggiorna un post.
 * 
 * @param {Object} req - L'oggetto della richiesta contenente postId come parametro e i dati aggiornati nel corpo.
 * @param {Object} res - L'oggetto della risposta utilizzato per inviare la risposta al client.
 * @param {Function} next - La funzione middleware successiva nello stack.
 */
export const aggiornaPost = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(
      errorHandler(403, "...Non sei autorizzato ad aggiornare il post...")
    );
  }

  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          category: req.body.category,
          image: req.body.image,
        },
      },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
};

/**
 * Recupera i post.
 * 
 * @param {Object} req - L'oggetto della richiesta contenente parametri di query opzionali per filtraggio, paginazione e ordinamento.
 * @param {Object} res - L'oggetto della risposta utilizzato per inviare la risposta al client.
 * @param {Function} next - La funzione middleware successiva nello stack.
 */
export const getPosts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;

    const limit = parseInt(req.query.limit) || 9;

    const sortDirection = req.query.order === "asc" ? 1 : -1;

    const posts = await Post.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
        .sort({ updatedAt: sortDirection })
        .skip(startIndex)
        .limit(limit);

    const totalPosts = await Post.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate()
    );

    const lastMonthPosts = await Post.find({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      posts,
      totalPosts,
      lastMonthPosts,
    });
  } catch (error) {
    next(error);
  }
};
