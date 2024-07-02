import React, { useEffect, useState } from 'react';
import { Spinner, Container, Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import CommentSection from '../components/CommentSection';
import PostCard from '../components/PostCard';

/**
 * @Module PostPage
 */
/**

/**
 * Componente per visualizzare la pagina di un singolo post.
 *
 * Carica e mostra il contenuto del post identificato dallo slug nella URL.
 * Mostra anche una sezione di commenti e articoli recenti.
 *
 * @returns {JSX.Element} Elemento JSX che rappresenta la pagina di un post.
 */
export default function PostPage() {
    const { postSlug } = useParams(); // Ottiene lo slug del post dalla URL
    const [loading, setLoading] = useState(true); // Stato per indicare se il caricamento è in corso
    const [error, setError] = useState(false); // Stato per indicare se si è verificato un errore durante il caricamento
    const [post, setPost] = useState(null); // Stato per memorizzare i dati del post recuperato
    const [recentPosts, setRecentPosts] = useState(null); // Stato per memorizzare i dati degli articoli recenti

    // Effetto per caricare il post identificato dallo slug nella URL
    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
                const data = await res.json();
                if (!res.ok) {
                    setError(true);
                    setLoading(false);
                    return;
                }
                setPost(data.posts[0]);
                setLoading(false);
                setError(false);
            } catch (error) {
                setError(true);
                setLoading(false);
            }
        };
        fetchPost();
    }, [postSlug]);

    // Effetto per caricare gli articoli recenti
    useEffect(() => {
        const fetchRecentPosts = async () => {
            try {
                const res = await fetch(`/api/post/getposts?limit=3`);
                const data = await res.json();
                if (res.ok) {
                    setRecentPosts(data.posts);
                }
            } catch (error) {
                console.log(error.message);
            }
        };
        fetchRecentPosts();
    }, []);

    // Gestione dello stato di caricamento
    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100">
                <Spinner animation="border" role="status" size="xl">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    // Gestione degli errori durante il caricamento
    if (error) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100">
                <h1 className="text-danger">Errore caricamento post</h1>
            </div>
        );
    }

    // Visualizzazione del contenuto del post e articoli recenti
    return (
        <>
            {/* Intestazione principale */}
            <div className="jumbotron jumbotron-fluid text-white bg-dark">
                <Container className="text-center">
                    <h1 className="display-3">{post.title}</h1>
                    <p className="lead mb-2">
                        Categoria: {post.category}
                    </p>
                </Container>
            </div>

            {/* Contenuto principale */}
            <Container className="py-3 min-vh-100">
                <Row className="justify-content-center">
                    <Col md={8} lg={6}>
                        {/* Sezione del singolo post */}
                        <div className="mt-4 p-4 bg-light border rounded shadow-sm d-flex flex-column align-items-center">
                            <img
                                src={post.image}
                                alt={post.title}
                                className="img-fluid rounded mb-4"
                                style={{ maxHeight: '400px', maxWidth: '100%', objectFit: 'cover' }}
                            />
                            {/* Informazioni aggiuntive del post */}
                            <div className="d-flex justify-content-between w-100 mt-3 border-bottom pb-2">
                                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                <span className="fst-italic">
                                    {(post.content.length / 1000).toFixed(0)} minuti letti
                                </span>
                            </div>
                            {/* Contenuto HTML del post */}
                            <div
                                className="mt-4"
                                dangerouslySetInnerHTML={{ __html: post.content }}
                                style={{ maxWidth: '100%', width: '100%' }}
                            ></div>
                        </div>

                        {/* Sezione dei commenti del post */}
                        <CommentSection postId={post._id} />
                    </Col>
                </Row>

                {/* Sezione degli articoli recenti */}
                <Row className="mt-5">
                    <Col>
                        <h2 className="h4 text-center">Articoli recenti</h2>
                        <Row className="justify-content-center mt-3">
                            {/* Mappa degli articoli recenti */}
                            {recentPosts &&
                                recentPosts.map((recentPost) => (
                                    <Col key={recentPost._id} md={4} className="mb-3">
                                        <PostCard post={recentPost} />
                                    </Col>
                                ))}
                        </Row>
                    </Col>
                </Row>
            </Container>
        </>
    );
}
