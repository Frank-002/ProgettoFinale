import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase.js';
import 'react-circular-progressbar/dist/styles.css';
import { Alert, Button, Container, Form, ProgressBar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../components/UserContext';

/**
 * Componente per la creazione di un nuovo post, incluso l'upload di immagini.
 *
 * @returns {JSX.Element} Elemento JSX che rappresenta la pagina di creazione di un post.
 */
const CreatePost = () => {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);

  const { currentUser, isAdmin, loading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin && !loading) {
      setPublishError('Non sei autorizzato a creare un post.');
    }
  }, [isAdmin, loading]);

  /**
   * Gestisce l'upload di un'immagine selezionata dall'utente.
   * Se l'utente non è un amministratore, imposta un errore di autorizzazione.
   */
  const handleImageUpload = async () => {
    if (!isAdmin) {
      setImageUploadError('Non sei autorizzato a caricare immagini.');
      return;
    }

    try {
      if (!file) {
        setImageUploadError('Carica una immagine');
        return;
      }

      setImageUploadError(null);

      const storage = getStorage(app);
      const fileName = new Date().getTime() + '-' + file.name;

      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError('Upload dell \'immagine fallita');
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageUploadError('Upload dell \'immagine fallita');
      setImageUploadProgress(null);
      console.log(error);
    }
  };

  /**
   * Gestisce la sottomissione del form per la creazione del post.
   * Se l'utente non è un amministratore o non è autorizzato, imposta un errore di autorizzazione.
   * Invia i dati del form al backend per creare il post.
   *
   * @param {Event} e Evento di submit del form.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin && !loading) {
      setPublishError('Non sei autorizzato a creare un post.');
      return;
    }

    try {
      const res = await fetch('/api/post/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
      setPublishError('Something went wrong');
    }
  };

  // Se il caricamento è in corso, visualizza un messaggio di caricamento
  if (loading) {
    return <div>Loading...</div>;
  }

  // Se l'utente non è autenticato, mostra un messaggio di errore di autorizzazione
  if (!currentUser) {
    return <div>Non sei autorizzato a creare un post.</div>;
  }

  return (
    <div>
      {/* Jumbotron per il titolo */}
      <div className="jumbotron jumbotron-fluid text-white bg-dark">
        <Container className="text-center">
          <h1 className="display-3">Crea un post</h1>
        </Container>
      </div>

      <Container className="my-5">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8">
            {/* Form per la creazione del post */}
            {isAdmin ? (
              <Form onSubmit={handleSubmit} className="bg-light p-4 rounded shadow-sm">
                <Form.Group controlId="title" className="mb-4">
                  <Form.Label>Titolo</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Titolo"
                    required
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </Form.Group>

                <Form.Group controlId="category" className="mb-4">
                  <Form.Label>Categorie</Form.Label>
                  <Form.Control
                    as="select"
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="uncategorized">Seleziona categoria</option>
                    <option value="sport">Sport</option>
                    <option value="animali">Animali</option>
                    <option value="scienza">Scienza</option>
                    <option value="arte">Arte</option>
                    <option value="notizie">Notizie</option>
                  </Form.Control>
                </Form.Group>

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

                {/* Mostra un messaggio di errore se l'upload dell'immagine fallisce */}
                {imageUploadError && <Alert variant="danger">{imageUploadError}</Alert>}

                {/* Mostra l'immagine caricata */}
                {formData.image && <img src={formData.image} alt="upload" className="img-fluid mb-3" />}

                <Form.Group controlId="content" className="mb-4">
                  <Form.Label>Contenuto</Form.Label>
                  <ReactQuill
                    theme="snow"
                    className="mb-3"
                    required
                    onChange={(value) => {
                      setFormData({ ...formData, content: value });
                    }}
                    style={{ height: '300px' }}
                  />
                </Form.Group>
                <Button type="submit" variant="primary" className="w-100 mt-4">
                  Pubblica
                </Button>

                {/* Mostra un messaggio di errore se la pubblicazione del post fallisce */}
                {publishError && <Alert className="mt-3" variant="danger">{publishError}</Alert>}
              </Form>
            ) : (
              // Mostra un messaggio di errore se l'utente non è autorizzato
              <Alert variant="danger">Non sei autorizzato a creare un post.</Alert>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default CreatePost;
