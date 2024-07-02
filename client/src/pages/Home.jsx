import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Container, Row } from "react-bootstrap";
import "../css/Home.css";

/**
 * @Module Home
 */
/**

/**
 * Componente principale della pagina Home del blog.
 *
 * Mostra un'intestazione, i più recenti articoli pubblicati e un pulsante per visualizzare tutti gli articoli.
 *
 * @returns {JSX.Element} Elemento JSX che rappresenta la pagina Home del blog.
 */
export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Funzione per recuperare gli articoli dal backend all'avvio del componente
    const fetchPosts = async () => {
      const res = await fetch('/api/post/getPosts');
      const data = await res.json();
      setPosts(data.posts);
    };
    fetchPosts();
  }, []);

  return (
    <div>
      {/* Intestazione principale */}
      <div className="jumbotron jumbotron-fluid text-white bg-dark">
        <Container className="text-center">
          <h1 className="display-3">Benvenuti nel nostro Blog!</h1>
          <p className="lead mb-2">
            Qui troverete una varietà di articoli su diversi argomenti!
          </p>
          {/* Link per visualizzare tutti gli articoli */}
          <Link to="/search" className="btn btn-info bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white border border-black">
            Visualizza tutti gli articoli
          </Link>
        </Container>
      </div>

      {/* Contenuto principale */}
      <Container className="my-5">
        {posts && posts.length > 0 && (
          <div>
            <h2 className="text-center mb-4">Ultimi Articoli</h2>
            {/* Griglia di articoli */}
            <Row className="justify-content-center">
              {posts.map((post) => (
                <Col key={post._id} xs={12} md={6} lg={4} className="mb-4 d-flex align-items-center justify-content-center">
                  <PostCard post={post} />
                </Col>
              ))}
            </Row>
            {/* Pulsante per visualizzare tutti gli articoli */}
            <div className="text-center mt-4">
              <Link to="/search" className="btn btn-info bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white border border-transparent">
                Visualizza tutti gli articoli
              </Link>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
