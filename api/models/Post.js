import mongoose from "mongoose";

/**
 * Schema per il modello dei post.
 */
const postSchema = new mongoose.Schema(
  {
    /**
     * ID dell'utente che ha creato il post.
     */
    userId: {
      type: String,
      required: true,
    },
    /**
     * Contenuto del post.
     */
    content: {
      type: String,
      required: true,
    },
    /**
     * Titolo del post.
     */
    title: {
      type: String,
      required: true,
    },
    /**
     * URL dell'immagine associata al post.
     * Default: un'immagine di default nel caso in cui non sia specificata un'immagine personalizzata.
     */
    image: {
      type: String,
      default:
        "https://www.salepepe.it/files/2017/06/scritta-di-sale-Too-much-salt.jpg",
    },
    /**
     * Categoria del post.
     * Default: "uncategorized" se non specificata.
     */
    category: {
      type: String,
      default: "uncategorized",
    },
    /**
     * Slug del post, utilizzato per creare URL amichevoli.
     * Deve essere unico.
     */
    slug: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

/**
 * Modello Mongoose per i post.
 */
const Post = mongoose.model("Post", postSchema);

export default Post;
