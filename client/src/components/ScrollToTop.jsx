import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Componente per il ritorno automatico in cima alla pagina quando la posizione dell'URL cambia.
 *
 * @returns {null} Ritorna null perché non ha elementi di rendering visibili.
 */
const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        // Scrolla automaticamente fino all'inizio della pagina quando pathname cambia
        window.scrollTo(0, 0);
    }, [pathname]);
  
    return null; // Non renderizza nessun elemento visibile
};

export default ScrollToTop;
