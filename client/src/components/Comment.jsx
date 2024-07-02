import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { FaThumbsUp } from 'react-icons/fa';
import { Button, Form } from 'react-bootstrap';
import { useUser } from './UserContext';

/**
 * @Module Comment
 */
/**

/**
 * Componente Comment per visualizzare un singolo commento con funzionalità per mettere "mi piace", modificare e cancellare.
 *
 * @param {Object} props - L'oggetto delle proprietà.
 * @param {Object} props.comment - L'oggetto del commento.
 * @param {string} props.comment._id - L'ID univoco del commento.
 * @param {string} props.comment.content - Il contenuto del commento.
 * @param {string} props.comment.userId - L'ID dell'utente che ha scritto il commento.
 * @param {string} props.comment.createdAt - La data di creazione del commento.
 * @param {number} props.comment.numberOfLikes - Il numero di "mi piace" ricevuti dal commento.
 * @param {Array} props.comment.likes - L'array degli ID degli utenti che hanno messo "mi piace".
 * @param {Function} props.onLike - Funzione chiamata quando si mette "mi piace" al commento.
 * @param {Function} props.onEdit - Funzione chiamata quando si modifica il commento.
 * @param {Function} props.onDelete - Funzione chiamata quando si elimina il commento.
 * @returns {JSX.Element} Il componente JSX del commento.
 */
export default function Comment({ comment, onLike, onEdit, onDelete }) {
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const { currentUser } = useUser(); // Utilizzo del hook useContext invece di useSelector

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/user/${comment.userId}`);
        const data = await res.json();
        if (res.ok) {
          setUser(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getUser();
  }, [comment]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedContent(comment.content);
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/comment/editComment/${comment._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: editedContent,
        }),
      });
      if (res.ok) {
        setIsEditing(false);
        onEdit(comment, editedContent);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
      <div className="d-flex p-4 border-bottom">
        <div className="me-3">
          <img
              className="rounded-circle"
              src={user.profilePicture}
              alt={user.username}
              style={{ width: '50px', height: '50px', objectFit: 'cover' }}
          />
        </div>
        <div className="flex-grow-1">
          <div className="d-flex align-items-center mb-1">
          <span className="fw-bold me-1 text-muted">
            {user ? `@${user.username}` : 'Utente Anonimo'}
          </span>
            <span className="text-muted">
            {moment(comment.createdAt).fromNow()}
          </span>
          </div>
          {isEditing ? (
              <>
                <Form.Control
                    as="textarea"
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    rows={3}
                    className="mb-2"
                />
                <div className="d-flex justify-content-end gap-2">
                  <Button
                      variant="primary"
                      size="sm"
                      onClick={handleSave}
                  >
                    Salva
                  </Button>
                  <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setIsEditing(false)}
                  >
                    Annulla
                  </Button>
                </div>
              </>
          ) : (
              <>
                <p className="text-muted pb-2">{comment.content}</p>
                <div className="d-flex align-items-center pt-2 text-muted">
                  <button
                      type="button"
                      onClick={() => onLike(comment._id)}
                      className={`btn d-flex align-items-center ${
                          currentUser &&
                          comment.likes.includes(currentUser._id) &&
                          'text-primary'
                      }`}
                  >

                    <FaThumbsUp className="me-1" />
                    {comment.numberOfLikes > 0 &&
                        `${comment.numberOfLikes} ${
                            comment.numberOfLikes === 1 ? 'mi piace' : 'mi piacciono'
                        }`}
                  </button>
                  {currentUser &&
                      (currentUser._id === comment.userId || currentUser.isAdmin) && (
                          <>
                            <button
                                type="button"
                                className="btn text-muted"
                                onClick={handleEdit}
                            >
                              Modifica
                            </button>
                            <button
                                type="button"
                                className="btn text-danger"
                                onClick={() => onDelete(comment._id)}
                            >
                              Elimina
                            </button>
                          </>
                      )}
                </div>
              </>
          )}
        </div>
      </div>
  );
}
