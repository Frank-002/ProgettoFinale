import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DashSidebar from '../components/DashSidebar';
import DashProfile from '../components/DashProfile';
import DashPosts from '../components/DashPosts';
import DashUsers from '../components/DashUsers';
import DashComments from '../components/DashComments';
import { useUser } from '../components/UserContext';
import Cookies from "js-cookie";



/**
 * Componente Dashboard per la visualizzazione del pannello di controllo dell'utente.
 * Mostra una barra laterale con le opzioni di navigazione e il contenuto principale in base al tab selezionato.
 * Reindirizza l'utente alla pagina di login se non è autenticato o se il caricamento dell'utente è in corso.
 *
 * @returns {JSX.Element} Elemento JSX che rappresenta il Dashboard.
 */
const Dashboard = () => {
  const location = useLocation(); // Hook di React Router per ottenere l'URL corrente
  const navigate = useNavigate(); // Hook di React Router per la navigazione
  const { currentUser, isAdmin, loading } = useUser(); // Hook personalizzato per ottenere lo stato dell'utente

  const [tab, setTab] = useState(''); // Stato per gestire il tab selezionato

  useEffect(() => {
    // Effettua il parsing dei parametri dell'URL per ottenere il tab selezionato
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    const tabFromCookies = Cookies.get('currentTab');
    
    // Imposta il tab in base alla priorità: URL > Cookie > Default
    if (tabFromUrl) {
      setTab(tabFromUrl);
    } else if (tabFromCookies) {
      setTab(tabFromCookies);
    } else {
      setTab('dash'); // Imposta un valore di default se nessun tab è stato trovato
    }
  }, [location.search]);

  useEffect(() => {
    // Reindirizza alla pagina di login se l'utente non è autenticato
    if (!loading && !currentUser) {
      navigate('/'); // Naviga alla radice del sito
    }
  }, [currentUser, loading, navigate]);

  /**
   * Gestisce il cambio di tab nel pannello di controllo.
   * Imposta il nuovo tab selezionato, salva la selezione nei cookies e aggiorna l'URL.
   * @param {string} newTab Il nuovo tab da selezionare.
   */
  const handleTabChange = (newTab) => {
    setTab(newTab);
    Cookies.set('currentTab', newTab, { expires: 7 }); // Imposta il cookie con scadenza di 7 giorni
    navigate(`?tab=${newTab}`); // Aggiorna l'URL con il nuovo tab selezionato
  };

  // Se il caricamento è in corso, mostra un messaggio di caricamento
  if (loading) {
    return <div>Loading...</div>;
  }

  // Se l'utente non è autenticato, non mostra nulla
  if (!currentUser) {
    return null;
  }

  // Rendering del componente Dashboard
  return (
      <div className="min-h-screen flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="md:w-56">
          <DashSidebar onTabChange={handleTabChange} />
        </div>

        {/* Contenuto principale */}
        <div className="flex-1 p-4">
          {/* Condiziona il rendering in base al tab selezionato e se l'utente è admin */}
          {tab === 'profile' && <DashProfile />}
          {tab === 'posts' && isAdmin && <DashPosts />}
          {tab === 'users' && isAdmin && <DashUsers />}
          {tab === 'comments' && isAdmin && <DashComments />}
        </div>
      </div>
  );
};

export default Dashboard;
