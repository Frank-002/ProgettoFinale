import { useState, useEffect } from 'react';
import { Col, Container, Nav, Row } from 'react-bootstrap';
import { HiUser, HiArrowSmRight, HiDocumentText, HiOutlineUserGroup, HiAnnotation } from 'react-icons/hi';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';

/**
 * Componente DashSidebar per la gestione della sidebar del dashboard.
 *
 * @param {Object} props - Le proprietà del componente.
 * @param {function} props.onTabChange - Funzione chiamata quando la scheda cambia.
 * @returns {JSX.Element} Il componente JSX per la sidebar del dashboard.
 */
const DashSidebar = ({ onTabChange }) => {
    const { currentUser, signOutSuccess } = useUser(); // Usa il contesto dell'utente
    const location = useLocation();
    const navigate = useNavigate();

    const [tab, setTab] = useState('');

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get('tab');
        if (tabFromUrl) {
            setTab(tabFromUrl);
        }
    }, [location.search]);

    /**
     * Gestisce il clic sulla scheda per cambiare la scheda attiva.
     *
     * @param {string} newTab - Il nome della nuova scheda.
     */
    const handleTabClick = (newTab) => {
        setTab(newTab);
        onTabChange(newTab);
    };

    /**
     * Gestisce il logout dell'utente.
     */
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
                navigate('/'); // Reindirizza alla homepage o alla pagina di login
            }

        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <Container fluid>
            <Row
                className="d-flex flex-column flex-md-row border-2 rounded mt-2 mr-2 ml-2 border-primary justify-content-center justify-content-md-start">
                <Col xs={12} className="d-flex flex-column align-items-center align-items-md-start p-2">
                    <Nav className="flex-column flex-md-row pb-1 pt-1 w-100">
                        <Nav.Item className="mb-2 mb-md-0 me-md-2">
                            <Nav.Link
                                active={tab === 'profile'}
                                onClick={() => handleTabClick('profile')}
                                className={`d-flex align-items-center justify-content-center justify-content-md-start ${tab === 'profile' ? 'text-primary' : 'text-secondary'}`}
                                style={{ cursor: 'pointer' }}
                            >
                                <HiUser className="me-2" />
                                Profilo {currentUser.isAdmin ? 'Admin' : 'Utente'}
                            </Nav.Link>
                        </Nav.Item>

                        {currentUser.isAdmin && (
                            <Nav.Item className="mb-2 mb-md-0 me-md-2">
                                <Nav.Link
                                    active={tab === 'posts'}
                                    onClick={() => handleTabClick('posts')}
                                    className={`d-flex align-items-center justify-content-center justify-content-md-start ${tab === 'posts' ? 'text-primary' : 'text-secondary'}`}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <HiDocumentText className="me-2" />
                                    Post
                                </Nav.Link>
                            </Nav.Item>
                        )}

                        {currentUser.isAdmin && (
                            <>
                                <Nav.Item className="mb-2 mb-md-0 me-md-2">
                                    <Nav.Link
                                        active={tab === 'users'}
                                        onClick={() => handleTabClick('users')}
                                        className={`d-flex align-items-center justify-content-center justify-content-md-start ${tab === 'users' ? 'text-primary' : 'text-secondary'}`}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <HiOutlineUserGroup className="me-2" />
                                        Utenti iscritti
                                    </Nav.Link>
                                </Nav.Item>

                                <Nav.Item className="mb-2 mb-md-0 me-md-2">
                                    <Nav.Link
                                        active={tab === 'comments'}
                                        onClick={() => handleTabClick('comments')}
                                        className={`d-flex align-items-center justify-content-center justify-content-md-start ${tab === 'comments' ? 'text-primary' : 'text-secondary'}`}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <HiAnnotation className="me-2" />
                                        Commenti
                                    </Nav.Link>
                                </Nav.Item>
                            </>
                        )}

                        <Nav.Item className="mt-auto mt-md-0 me-md-2">
                            <Nav.Link
                                onClick={handleSignOut}
                                className="d-flex align-items-center justify-content-center justify-content-md-start text-secondary text-danger"
                                style={{ cursor: 'pointer' }}
                            >
                                <HiArrowSmRight className="me-2" />
                                Logout
                            </Nav.Link>
                        </Nav.Item>
                    </Nav>
                </Col>
            </Row>
        </Container>
    );
}
export default DashSidebar;
