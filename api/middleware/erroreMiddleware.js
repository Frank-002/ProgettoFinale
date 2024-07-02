/**
 * Middleware per la gestione degli errori.
 * Questo middleware intercetta tutti gli errori che si verificano nell'applicazione e
 * invia una risposta JSON con il messaggio di errore e, in modalità di sviluppo, lo stacktrace.
 * 
 * @param {Object} err - L'oggetto errore generato.
 * @param {Object} req - L'oggetto richiesta HTTP.
 * @param {Object} res - L'oggetto risposta HTTP.
 * @param {Function} next - La funzione next() per passare il controllo al middleware successivo.
 */
const erroreMiddleware = (err, req, res, next) => {
    console.log('ERRORE MIDDLEWARE!!!');
    const statusCode = res.statusCode ? res.statusCode : 500;
    res.status(statusCode);
    res.json({message: err.message, stack: process.env.NODE_ENV === "development" ? err.stack : null});
}

export default erroreMiddleware;
