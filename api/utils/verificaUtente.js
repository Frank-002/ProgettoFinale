import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';

/**
 * Middleware per verificare l'autenticazione dell'utente utilizzando JSON Web Token (JWT).
 * 
 * @param {Object} req - L'oggetto richiesta HTTP.
 * @param {Object} res - L'oggetto risposta HTTP.
 * @param {Function} next - La funzione next() per passare il controllo al middleware successivo.
 */
export const verificaUtente = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
        // Se non c'è il token, chiamiamo il middleware errorHandler per gestire l'errore 401 (Non autorizzato).
        return next(errorHandler(401, '...Non autorizzato...'));
    }

    // Verifica il token utilizzando la chiave segreta JWT definita nell'ambiente.
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            // Se c'è un errore durante la verifica del token, chiamiamo il middleware errorHandler per gestire l'errore 401 (Non autorizzato).
            return next(errorHandler(401, '...Non autorizzato...'));
        }

        // Se la verifica è riuscita, aggiungiamo l'utente decodificato alla richiesta.
        req.user = user;
        next();
    });
};
