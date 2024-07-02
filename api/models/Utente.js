import mongoose from 'mongoose';

/**
 * Schema per il modello degli utenti.
 */
const userSchema = new mongoose.Schema(
    {
        /**
         * Nome utente dell'utente.
         */
        username: {
            type: String,
            required: true,
            unique: true,
        },
        /**
         * Email dell'utente.
         */
        email: {
            type: String,
            required: true,
            unique: true,
        },
        /**
         * Password dell'utente.
         */
        password: {
            type: String,
            required: true,
        },
        /**
         * URL dell'immagine del profilo dell'utente.
         * Default: immagine di profilo predefinita nel caso in cui non sia specificata un'immagine personalizzata.
         */
        profilePicture: {
            type: String,
            default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
        },
        /**
         * Flag che indica se l'utente è un amministratore.
         * Default: false se non specificato.
         */
        isAdmin: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true, // Aggiunge campi createdAt e updatedAt automaticamente
    }
);

/**
 * Modello Mongoose per gli utenti.
 */
const User = mongoose.model("User", userSchema);

export default User;
