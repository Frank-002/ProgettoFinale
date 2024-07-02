import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { useUser } from './UserContext.jsx';
import { Navbar, Button, Dropdown, Image, InputGroup, FormControl } from 'react-bootstrap';
import '../css/Header.css'; // Importa il file CSS per le modifiche di stile del header

/**
 * Componente Header per la barra di navigazione superiore del sito.
 *
 * @returns {JSX.Element} Il componente JSX per l'header del sito.
 */
const Header = () => {
  const { currentUser, signOutSuccess } = useUser(); // Usa il contesto utente per ottenere l'utente corrente
  const location = useLocation(); // Ottiene l'oggetto location per gestire la posizione corrente
  const navigate = useNavigate(); // Funzione di navigazione utilizzata per reindirizzare l'utente

  const [searchTerm, setSearchTerm] = useState(''); // Stato per il termine di ricerca nella barra di ricerca

  // Effetto per gestire il termine di ricerca dalla query string dell'URL
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');

    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  // Funzione per gestire il logout dell'utente
  const handleSignOut = async () => {
    try {
      const res = await fetch(`/api/user/signout`, {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        console.log(data.message);
      } else {
        signOutSuccess();
        navigate('/');
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // Funzione per gestire l'invio del form di ricerca
  const handleSubmit = (e) => {
    e.preventDefault();

    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  return (
    <Navbar className="border-b-2">
      <div className="container mx-auto">
        {/* Logo */}
        <Link to="/" className="d-flex align-items-center text-dark text-decoration-none ml-4">
          <span className="px-2 py-1 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 rounded-lg text-white ml-1 h4 mb-0">
            Byte
          </span>
          <span className="ml-1 h4 mb-0 text-dark d-none d-lg-inline">Beat</span>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSubmit} className="flex-grow-1 mx-auto max-w-lg">
          <InputGroup className="">
            <FormControl
              type="text"
              placeholder="Ricerca..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control"
              aria-label="Search"
            />
            <div className="input-group-append">
              <button className="btn btn-outline-primary" type="submit">
                <AiOutlineSearch />
              </button>
            </div>
          </InputGroup>
        </form>

        {/* Links and User Menu */}
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className={`text-sm ${location.pathname === '/' ? 'text-blue-600 border-b-2 border-blue-600 hover:no-underline' : 'text-gray-700 hover:no-underline'}`}
          >
            Home
          </Link>
          <Link
            to="/about"
            className={`text-sm ${location.pathname === '/about' ? 'text-blue-600 border-b-2 border-blue-600 hover:no-underline' : 'text-gray-700  hover:no-underline' }`}
          >
            Chi siamo?
          </Link>

          {/* Dropdown per il profilo utente o pulsante per accedere */}
          {currentUser ? (
            <Dropdown>
              <Dropdown.Toggle
                variant="link"
                id="dropdown-basic"
                className="mr-1 d-flex align-items-center custom-dropdown-toggle"
              >
                <Image
                  src={currentUser.profilePicture}
                  alt="user"
                  roundedCircle
                  className="d-block rounded-circle"
                  style={{ width: '40px', height: '40px' }}
                />
              </Dropdown.Toggle>

              <Dropdown.Menu className="custom-dropdown-menu">
                <Dropdown.Header>
                  <span className="block text-sm" style={{ color: 'black' }}>@{currentUser.username}</span>
                  <span className="block text-sm font-medium truncate" style={{ color: 'black' }}>{currentUser.email}</span>
                </Dropdown.Header>
                <Dropdown.Item href="/dashboard?tab=profile" style={{ color: 'black' }}>Profilo</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleSignOut} style={{ color: 'black' }}>Esci</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <Link to="/sign-in" style={{ textDecoration: 'none' }}>
              <Button gradientDuoTone="purpleToBlue" className="mr-3">
                Accedi
              </Button>
            </Link>
          )}
        </div>
      </div>
    </Navbar>
  );
};

export default Header;
