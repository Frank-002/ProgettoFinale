import React, { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';



// Creazione del contesto per l'utente
export const UserContext = createContext();

/**
 * @Module UserContext
 */
/**

/**
 * Hook personalizzato per utilizzare il contesto dell'utente.
 *
 * @returns {object} Oggetto contenente i dati dell'utente e le funzioni di gestione dello stato.
 */
export const useUser = () => useContext(UserContext);

/**
 * Provider del contesto utente che gestisce lo stato dell'utente, le azioni di autenticazione e l'interazione con i cookies.
 *
 * @param {object} props Proprietà del componente che includono i figli da renderizzare.
 * @returns {JSX.Element} Componente Provider che incapsula l'applicazione e i suoi figli con il contesto utente.
 */
export const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null); // Stato corrente dell'utente
    const [isAdmin, setIsAdmin] = useState(false); // Flag che indica se l'utente è un amministratore
    const [error, setError] = useState(null); // Eventuali errori durante le operazioni
    const [loading, setLoading] = useState(true); // Flag che indica lo stato di caricamento

    /**
     * Salva i dati dell'utente nei cookies.
     *
     * @param {object} user Dati dell'utente da salvare nei cookies.
     */
    const saveUserToCookies = (user) => {
        Cookies.set('currentUser', JSON.stringify(user), { expires: 7 }); // Scadenza impostata a 7 giorni
    };

    /**
     * Rimuove i dati dell'utente dai cookies.
     */
    const removeUserFromCookies = () => {
        Cookies.remove('currentUser');
    };

    /**
     * Carica i dati dell'utente dai cookies quando il componente si monta.
     */
    const loadUserFromCookies = () => {
        const user = Cookies.get('currentUser');
        if (user) {
            const parsedUser = JSON.parse(user);
            setCurrentUser(parsedUser);
            setIsAdmin(parsedUser.isAdmin);
        }
        setLoading(false);
    };

    // Carica i dati dell'utente dai cookies al montaggio del componente
    useEffect(() => {
        loadUserFromCookies();
    }, []);

    /**
     * Azione di inizio di accesso.
     */
    const signInStart = () => {
        setLoading(true);
        setError(null);
    };

    /**
     * Azione di successo di accesso.
     *
     * @param {object} user Dati dell'utente che ha effettuato l'accesso.
     */
    const signInSuccess = (user) => {
        setCurrentUser(user);
        setIsAdmin(user.isAdmin);
        saveUserToCookies(user);
        setLoading(false);
        setError(null);
    };

    /**
     * Azione di fallimento di accesso.
     *
     * @param {object} error Errore verificatosi durante l'accesso.
     */
    const signInFailure = (error) => {
        setLoading(false);
        setError(error);
    };

    /**
     * Azione di inizio di aggiornamento dei dati utente.
     */
    const updateStart = () => {
        setLoading(true);
        setError(null);
    };

    /**
     * Azione di successo di aggiornamento dei dati utente.
     *
     * @param {object} user Dati dell'utente aggiornati.
     */
    const updateSuccess = (user) => {
        setCurrentUser(user);
        setIsAdmin(user.isAdmin);
        saveUserToCookies(user);
        setLoading(false);
    };

    /**
     * Azione di fallimento di aggiornamento dei dati utente.
     *
     * @param {object} error Errore verificatosi durante l'aggiornamento dei dati utente.
     */
    const updateFailure = (error) => {
        setLoading(false);
        setError(error);
    };

    /**
     * Azione di inizio di eliminazione dell'utente.
     */
    const deleteStart = () => {
        setLoading(true);
        setError(null);
    };

    /**
     * Azione di successo di eliminazione dell'utente.
     */
    const deleteSuccess = () => {
        setCurrentUser(null);
        setIsAdmin(false);
        removeUserFromCookies();
        setLoading(false);
    };

    /**
     * Azione di fallimento di eliminazione dell'utente.
     *
     * @param {object} error Errore verificatosi durante l'eliminazione dell'utente.
     */
    const deleteFailure = (error) => {
        setLoading(false);
        setError(error);
    };

    /**
     * Azione di successo di logout dell'utente.
     */
    const signOutSuccess = () => {
        setCurrentUser(null);
        setIsAdmin(false);
        removeUserFromCookies();
        setLoading(false);
        setError(null);
    };

    return (
        <UserContext.Provider
            value={{
                currentUser,
                isAdmin,
                error,
                loading,
                signInStart,
                signInSuccess,
                signInFailure,
                updateStart,
                updateSuccess,
                updateFailure,
                deleteStart,
                deleteSuccess,
                deleteFailure,
                signOutSuccess,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};
