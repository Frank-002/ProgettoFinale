import React, { useEffect, useState } from "react";
import { Button, Modal, Table } from "react-bootstrap";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { FaCheck, FaTimes } from "react-icons/fa";
import { useUser } from './UserContext'; // Importa il contesto utente
import '../css/Table.css'; // Importa il file CSS personalizzato per le modifiche di stile

/**
 * Componente DashUsers per la gestione degli utenti nel dashboard.
 *
 * @returns {JSX.Element} Il componente JSX per la gestione degli utenti.
 */
const DashUsers = () => {
  const { currentUser } = useUser(); // Usa il contesto utente
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState("");

  useEffect(() => {
    /**
     * Funzione per ottenere gli utenti dal server.
     */
    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/user/getusers`);
        const data = await res.json();

        if (res.ok) {
          setUsers(data.users);
          if (data.users.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    if (currentUser.isAdmin) {
      fetchUsers();
    }
  }, [currentUser._id]);

  /**
   * Funzione per gestire il caricamento di più utenti.
   */
  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const res = await fetch(
          `/api/user/getusers?startIndex=${startIndex}`
      );
      const data = await res.json();

      if (res.ok) {
        setUsers((prev) => [...prev, ...data.users]);
        if (data.users.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  /**
   * Funzione per gestire l'eliminazione di un utente.
   */
  const handleDeleteUser = async () => {
    try {
      const res = await fetch(`/api/user/delete/${userIdToDelete}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
        setShowModal(false);
      } else {
        console.log(data.message);
      }

    } catch (error) {
      console.log(error.message);
    }
  };

  return (
      <div className="container my-5">
        {currentUser.isAdmin && users.length > 0 ? (
            <>
              <Table responsive hover bordered className=" custom-table">
                <thead className="bg-primary text-white">
                <tr>
                  <th>Data Creazione </th>
                  <th>Immagine utente</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Admin</th>
                  <th>Elimina</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user) => (
                    <tr key={user._id}>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        <img
                            src={user.profilePicture}
                            alt={user.username}
                            className="img-thumbnail rounded-circle"
                            style={{ width: "50px", height: "auto" }}
                        />
                      </td>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>
                        {user.isAdmin ? (
                            <FaCheck className="text-success" />
                        ) : (
                            <FaTimes className="text-danger" />
                        )}
                      </td>
                      <td>
                        <Button
                            variant="danger"
                            onClick={() => {
                              setShowModal(true);
                              setUserIdToDelete(user._id);
                            }}
                        >
                          Cancella
                        </Button>
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
                    Mostra altro
                  </Button>
              )}
            </>
        ) : (
            <p className="text-center">Nessun utente da mostrare!</p>
        )}

        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Conferma eliminazione</Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center">
            <HiOutlineExclamationCircle className="text-danger mb-4" size={48} />
            <h4 className="mb-4">Sei sicuro di voler eliminare questo utente?</h4>
            <div className="d-flex justify-content-center">
              <Button variant="danger" onClick={handleDeleteUser}>
                Sì, elimina
              </Button>{" "}
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                No, cancella
              </Button>
            </div>
          </Modal.Body>
        </Modal>
      </div>
  );
};

export default DashUsers;
