import { Alert, Button, Form, ProgressBar, Container } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from '../firebase.js';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../components/UserContext.jsx';

/**
 * Componente per l'aggiornamento di un post esistente.
 * Permette all'utente autenticato di modificare il titolo, la categoria, l'immagine (opzionale) e il contenuto del post.
 * Dopo la modifica, l'utente può salvare il post aggiornato.
 *
 * @returns {JSX.Element} Elemento JSX che rappresenta la pagina di aggiornamento del post.
 */
const UpdatePost = () => {
  const { currentUser } = useUser();
  const navigate = useNavigate();
  const { postId } = useParams();

  const [file, setFile] = useState(null); // Stato per gestire il file di immagine da caricare
  const [imageUploadProgress, setImageUploadProgress] = useState(null); // Progresso di upload dell'immagine
  const [imageUploadError, setImageUploadError] = useState(null); // Eventuali errori durante l'upload dell'immagine
  const [formData, setFormData] = useState({}); // Stato per i dati del form del post
  const [publishError, setPublishError] = useState(null); // Eventuali errori durante il processo di pubblicazione del post

  useEffect(() => {
    // Effettua il fetch dei dati del post da aggiornare
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/post/getposts?postId=${postId}`);
        const data = await res.json();

        if (!res.ok) {
          console.log(data.message);
          setPublishError(data.message);
          return;
        }

        if (res.ok) {
          setPublishError(null);
          setFormData(data.posts[0]);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchPost();
  }, [postId]);

  /**
   * Gestisce l'upload dell'immagine selezionata.
   * Utilizza Firebase Storage per caricare l'immagine e aggiorna lo stato con l'URL di download dell'immagine.
   */
  const handleImageUpload = async () => {
    try {
      if (!file) {
        setImageUploadError('Seleziona un\'immagine da caricare');
        return;
      }

      setImageUploadError(null);

      const storage = getStorage(app);
      const fileName = new Date().getTime() + '-' + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed', (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageUploadProgress(progress.toFixed(0));
      }, (error) => {
        setImageUploadError('Upload dell\'immagine fallito');
        setImageUploadProgress(null);
      }, () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageUploadProgress(null);
          setImageUploadError(null);
          setFormData({ ...formData, image: downloadURL });
        });
      });

    } catch (error) {
      setImageUploadError('Upload dell\'immagine fallito');
      setImageUploadProgress(null);
      console.log(error);
    }
  };

  /**
   * Gestisce l'invio del form di aggiornamento del post.
   * Effettua una richiesta PUT al server per aggiornare il post.
   * Reindirizza l'utente alla pagina del post aggiornato in caso di successo.
   * @param {React.FormEvent<HTMLFormElement>} e Evento di submit del form.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/post/updatepost/${formData._id}/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setPublishError(data.message);
        return;
      }

      if (res.ok) {
        setPublishError(null);
        navigate(`/post/${data.slug}`);
      }

    } catch (error) {
      setPublishError('Qualcosa è andato storto');
    }
  };

  // Rendering del componente
  return (
      <div>
        <div className="jumbotron jumbotron-fluid text-white bg-dark">
          <Container className="text-center">
            <h1 className="display-3">Aggiorna un post</h1>
          </Container>
        </div>

        <Container className="my-5">
          <div className="row justify-content-center">
            <div className="col-lg-6 col-md-8">
              {currentUser ? (
                  <Form onSubmit={handleSubmit} className="bg-light p-4 rounded shadow-sm">
                    {/* Campo di input per il titolo del post */}
                    <Form.Group controlId="title" className="mb-4">
                      <Form.Label>Titolo</Form.Label>
                      <Form.Control
                          type="text"
                          placeholder="Titolo"
                          required
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          value={formData.title}
                      />
                    </Form.Group>

                    {/* Campo di input per la categoria del post */}
                    <Form.Group controlId="category" className="mb-4">
                      <Form.Label>Categorie</Form.Label>
                      <Form.Control as="select" onChange={(e) => setFormData({ ...formData, category: e.target.value })} value={formData.category}>
                        <option value="uncategorized">Seleziona categoria</option>
                        <option value="sport">Sport</option>
                        <option value="animali">Animali</option>
                        <option value="scienza">Scienza</option>
                        <option value="arte">Arte</option>
                        <option value="notizie">Notizie</option>
                      </Form.Control>
                    </Form.Group>

                    {/* Campo di input per l'upload dell'immagine */}
                    <Form.Group controlId="file" className="mb-4">
                      <Form.Label>Upload Immagine</Form.Label>
                      <Form.Control type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
                      <Button variant="primary" onClick={handleImageUpload} className="mt-2 w-100">
                        {imageUploadProgress ? (
                            <ProgressBar now={imageUploadProgress} label={`${imageUploadProgress}%`} />
                        ) : (
                            'Upload Immagine'
                        )}
                      </Button>
                    </Form.Group>

                    {/* Visualizzazione dell'errore di upload dell'immagine */}
                    {imageUploadError && <Alert variant="danger">{imageUploadError}</Alert>}

                    {/* Visualizzazione dell'immagine caricata (se presente) */}
                    {formData.image && <img src={formData.image} alt="upload" className="img-fluid mb-3" />}

                    {/* Campo di input per il contenuto del post */}
                    <Form.Group controlId="content" className="mb-4">
                      <Form.Label>Contenuto</Form.Label>
                      <ReactQuill
                          theme="snow"
                          className="mb-3"
                          required
                          onChange={(value) => setFormData({ ...formData, content: value })}
                          value={formData.content}
                          style={{ height: '300px' }}
                      />
                    </Form.Group>

                    {/* Pulsante di submit per l'aggiornamento del post */}
                    <Button type="submit" variant="primary" className="w-100 mt-4">
                      Aggiorna
                    </Button>

                    {/* Visualizzazione dell'errore durante il processo di aggiornamento */}
                    {publishError && <Alert className="mt-3" variant="danger">{publishError}</Alert>}
                  </Form>
              ) : (
                  <Alert variant="danger">Non sei autorizzato a creare un post.</Alert>
              )}
            </div>
          </div>
        </Container>
      </div>
  );
};

export default UpdatePost;
