import mongoose from 'mongoose';

/**
 * Schema per il modello dei commenti.
 */
const commentSchema = new mongoose.Schema(
    {
        /**
         * Contenuto del commento.
         */
        content: {
            type: String,
            required: true,
        }, 
        /**
         * ID del post a cui è associato il commento.
         */
        postId: {
            type: String,
            required: true,
        },
        /**
         * ID dell'utente che ha creato il commento.
         */
        userId: {
            type: String,
            required: true,
        },
        /**
         * Array contenente gli ID degli utenti che hanno messo "like" al commento.
         */
        likes: {
            type: [String],
            default: [],
        },
        /**
         * Numero totale di "like" ricevuti dal commento.
         */
        numberOfLikes: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

/**
 * Modello Mongoose per i commenti.
 */
const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
