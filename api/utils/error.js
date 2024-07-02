/**
 * Funzione per la creazione di un oggetto errore personalizzato.
 * 
 * @param {number} statusCode - Il codice di stato HTTP da assegnare all'errore.
 * @param {string} message - Il messaggio di errore da assegnare all'oggetto errore.
 * @returns {Error} - Ritorna un oggetto Error con il codice di stato e il messaggio specificati.
 */
export const errorHandler = (statusCode, message) => {
    const error = new Error();
    error.statusCode = statusCode;
    error.message = message;
    return error;
}
