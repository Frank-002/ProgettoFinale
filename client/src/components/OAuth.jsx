import React from 'react';
import { Button } from 'flowbite-react'; // Importa il componente Button da flowbite-react
import { AiFillGoogleCircle } from 'react-icons/ai'; // Importa l'icona di Google da react-icons/ai
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'; // Importa le funzioni di autenticazione di Firebase
import { useUser } from './UserContext.jsx'; // Importa il contesto utente da UserContext.jsx
import { app } from '../firebase'; // Importa l'istanza di Firebase app
import { useNavigate } from 'react-router-dom'; // Hook per la navigazione nella libreria react-router-dom
import "../css/OAuth.css"; // Importa il file CSS per le modifiche di stile del componente OAuth

/**
 * Componente OAuth per l'autenticazione con Google.
 *
 * @returns {JSX.Element} Il componente JSX per l'autenticazione OAuth con Google.
 */
const OAuth = () => {
    const auth = getAuth(app); // Ottiene l'istanza di autenticazione da Firebase
    const { signInSuccess } = useUser(); // Utilizza il contesto UserProvider per gestire l'autenticazione utente
    const navigate = useNavigate(); // Funzione di navigazione per reindirizzare l'utente

    /**
     * Gestisce il clic sul pulsante "Continua con Google".
     * Utilizza Firebase per l'autenticazione con Google e invia i dati al backend per la registrazione o l'accesso.
     */
    const handleGoogleClick = async () => {
        const provider = new GoogleAuthProvider(); // Crea un nuovo provider di autenticazione Google
        provider.setCustomParameters({ prompt: "select_account" }); // Imposta il prompt per selezionare l'account Google

        try {
            // Effettua l'autenticazione con popup usando il provider Google
            const resultsFromGoogle = await signInWithPopup(auth, provider);

            // Invia i dati dell'utente autenticato al backend tramite API
            const res = await fetch("/api/auth/google", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: resultsFromGoogle.user.displayName,
                    email: resultsFromGoogle.user.email,
                    googlePhotoUrl: resultsFromGoogle.user.photoURL,
                }),
            });

            const data = await res.json(); // Ottiene la risposta JSON dal backend

            // Se la richiesta è andata a buon fine, gestisce il successo del login
            if (res.ok) {
                signInSuccess(data); // Chiama il metodo di contesto per gestire il successo del login
                navigate("/"); // Reindirizza l'utente alla homepage
            }

        } catch (error) {
            console.error(error); // Gestisce gli errori stampandoli sulla console
        }
    };

    return (
        <div className="d-flex justify-content-center mt-3">
            {/* Pulsante per l'autenticazione con Google */}
            <Button type="button" gradientDuoTone="pinkToOrange" onClick={handleGoogleClick}
                    className="button-no-hover-effect">
                <AiFillGoogleCircle className="w-6 h-6 mr-2"/> {/* Icona di Google */}
                Continua con Google
            </Button>
        </div>
    );
};

export default OAuth;
