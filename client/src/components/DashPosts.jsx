import React, { useEffect, useState } from "react";
import { Button, Modal, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useUser } from "./UserContext"; // Importa il contesto utente
import "../css/Table.css";

/**
 * Componente DashPosts per visualizzare e gestire i post nel pannello di amministrazione.
 *
 * @returns {JSX.Element} Il componente JSX per la gestione dei post.
 */
const DashPosts = () => {
  const { currentUser } = useUser(); // Usa il contesto utente
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState("");

  /**
   * Effettua il fetch dei post all'inizializzazione del componente.
   */
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`);
        const data = await res.json();

        if (res.ok) {
          setUserPosts(data.posts);
          if (data.posts.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    if (currentUser && currentUser.isAdmin) {
      fetchPosts();
    }
  }, [currentUser]);

  /**
   * Gestisce la visualizzazione di ulteriori post.
   */
  const handleShowMore = async () => {
    const startIndex = userPosts.length;
    try {
      const res = await fetch(
        `/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`
      );
      const data = await res.json();

      if (res.ok) {
        setUserPosts((prev) => [...prev, ...data.posts]);
        if (data.posts.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  /**
   * Gestisce l'eliminazione di un post.
   */
  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `/api/post/deletepost/${postIdToDelete}/${currentUser._id}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();

      if (!res.ok) {
        console.log(data.message);
      } else {
        setUserPosts((prev) =>
          prev.filter((post) => post._id !== postIdToDelete)
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="container my-5">
      {currentUser && currentUser.isAdmin && userPosts.length > 0 ? (
        <>
          <Table responsive hover bordered className="custom-table">
            <thead className="custom-thead">
              <tr>
                <th>Data Pubblicazione</th>
                <th>Immagine</th>
                <th>Titolo</th>
                <th>Categoria</th>
                <th>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {userPosts.map((post) => (
                <tr key={post._id}>
                  <td>{new Date(post.updatedAt).toLocaleDateString()}</td>
                  <td>
                    <Link to={`/post/${post.slug}`}>
                      <img
                        src={post.image}
                        alt={post.title}
                        className="img-thumbnail"
                        style={{ width: "100px", height: "auto" }}
                      />
                    </Link>
                  </td>
                  <td>
                    <Link to={`/post/${post.slug}`} className="text-dark">
                      {post.title}
                    </Link>
                  </td>
                  <td>{post.category}</td>
                  <td>
                    <div className="d-flex">
                      <Button
                        variant="danger"
                        className="mr-2"
                        onClick={() => {
                          setShowModal(true);
                          setPostIdToDelete(post._id);
                        }}
                      >
                        Cancella
                      </Button>
                      <Link
                        to={`/update-post/${post._id}`}
                        className="btn btn-outline-info"
                      >
                        Modifica
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {showMore && (
            <Button
              variant="outline-info"
              className="w-100 mt-4"
              onClick={handleShowMore}
            >
              Mostra di più
            </Button>
          )}
        </>
      ) : (
        <p className="text-center">Non hai ancora creato alcun post.</p>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Conferma Eliminazione</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <HiOutlineExclamationCircle className="text-danger mb-4" size={48} />
          <h4 className="mb-4">Sei sicuro di voler eliminare questo post?</h4>
          <div className="d-flex justify-content-center">
            <Button variant="danger" onClick={handleDeletePost}>
              Sì, elimina
            </Button>{" "}
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Annulla
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DashPosts;
