import React, { useEffect, useRef, useState } from "react";
import { Alert, Button, Modal } from "react-bootstrap"; // Importa componenti di Bootstrap
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useUser } from "./UserContext"; // Importa il contesto utente
import { Link, useNavigate } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

/**
 * Componente DashProfile per la gestione del profilo utente.
 *
 * @returns {JSX.Element} Il componente JSX per la gestione del profilo.
 */
const DashProfile = () => {
  const {
    currentUser,
    loading,
    updateStart,
    updateSuccess,
    updateFailure,
    deleteStart,
    deleteSuccess,
    deleteFailure,
    signOutSuccess
  } = useUser(); // Usa il contesto utente
  const filePickerRef = useRef();

  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [formData, setFormData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  /**
   * Gestisce il cambiamento dell'immagine di profilo.
   *
   * @param {Object} e - L'evento del cambiamento dell'input file.
   */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  /**
   * Carica l'immagine di profilo su Firebase Storage.
   */
  const uploadImage = async () => {
    setImageFileUploading(true);
    setImageFileUploadError(null);

    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError(
          "Non è stato possibile caricare l'immagine (Il file deve essere inferiore a 2MB)"
        );
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploadProgress(null);
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
          setImageFileUploadProgress(null);
          setImageFileUploading(false);
        });
      }
    );
  };

  /**
   * Gestisce il cambiamento degli input del form.
   *
   * @param {Object} e - L'evento del cambiamento dell'input.
   */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  /**
   * Gestisce l'invio del form per l'aggiornamento del profilo utente.
   *
   * @param {Object} e - L'evento dell'invio del form.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    setUpdateUserError(null);
    setUpdateUserSuccess(null);

    if (Object.keys(formData).length === 0) {
      setUpdateUserError("Nessun aggiornamento effettuato");
      return;
    }

    if (imageFileUploading) {
      setUpdateUserError("Attendi il caricamento dell'immagine");
      return;
    }

    try {
      updateStart();

      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        updateFailure(data.message);
        setUpdateUserError(data.message);
      } else {
        updateSuccess(data);
        setUpdateUserSuccess("Profilo aggiornato con successo");
      }
    } catch (error) {
      updateFailure(error.message);
      setUpdateUserError(error.message);
    }
  };

  /**
   * Gestisce l'eliminazione dell'account utente.
   */
  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      deleteStart();
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        deleteFailure(data.message);
      } else {
        deleteSuccess();
      }
    } catch (error) {
      deleteFailure(error.message);
    }
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
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <h1 className="mb-4 text-center">Profilo</h1>
              <form onSubmit={handleSubmit}>
                <div className="d-flex justify-content-center mb-4">
                  <div className="position-relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      ref={filePickerRef}
                      className="d-none"
                    />
                    <label
                      htmlFor="fileInput"
                      className="cursor-pointer"
                      onClick={() => filePickerRef.current.click()}
                    >
                      <div className="rounded-circle border border-light p-1 bg-light position-relative">
                        {imageFileUploadProgress && (
                          <CircularProgressbar
                            value={imageFileUploadProgress || 0}
                            text={`${imageFileUploadProgress}%`}
                            strokeWidth={5}
                            styles={{
                              root: {
                                width: "100%",
                                height: "100%",
                                position: "absolute",
                                top: 0,
                                left: 0,
                              },
                              path: {
                                stroke: `rgba(62, 152, 199, ${
                                  imageFileUploadProgress / 100
                                })`,
                              },
                              trail: { stroke: "rgba(0,0,0,0.1)" },
                              text: {
                                fill: "#000",
                                fontSize: "16px",
                              },
                            }}
                          />
                        )}
                        <img
                          src={imageFileUrl || currentUser.profilePicture}
                          alt="profile pic"
                          className="rounded-circle border border-light img-fluid"
                          style={{ width: "150px", height: "150px", objectFit: "cover" }}
                        />
                      </div>
                    </label>
                  </div>
                </div>

                {imageFileUploadError && (
                  <Alert variant="danger" className="mb-3">
                    {imageFileUploadError}
                  </Alert>
                )}

                <div className="mb-3">
                  <input
                    type="text"
                    id="username"
                    placeholder="Username"
                    defaultValue={currentUser.username}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    id="email"
                    placeholder="Email"
                    defaultValue={currentUser.email}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading || imageFileUploading}
                  className="w-100 mb-3"
                >
                  {loading ? "Loading..." : "Aggiorna"}
                </Button>

                {currentUser.isAdmin && (
                  <Link to={"/create-post"} className="text-decoration-none">
                    <Button
                      type="button"
                      className="btn btn-primary w-100"
                    >
                      Crea Post
                    </Button>
                  </Link>
                )}
              </form>
            </div>
            <div className="card-footer d-flex justify-content-between">
              <span
                className="text-danger cursor-pointer"
                onClick={() => setShowModal(true)}
              >
                Cancella Account
              </span>
              <span
                className="text-danger cursor-pointer"
                onClick={handleSignOut}
              >
                Logout
              </span>
            </div>
          </div>
        </div>
      </div>

      {updateUserSuccess && (
        <Alert variant="success" className="mt-3">
          {updateUserSuccess}
        </Alert>
      )}

      {updateUserError && (
        <Alert variant="danger" className="mt-3">
          {updateUserError}
        </Alert>
      )}

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        dialogClassName="modal-dialog-centered"
      >
        <Modal.Header closeButton />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-3 text-lg text-gray-500 dark:text-gray-400">
              Sei sicuro di voler eliminare l'account?
            </h3>
            <div className="d-flex justify-content-center gap-3">
              <Button variant="danger" onClick={handleDeleteUser}>
                Si, sono sicuro
              </Button>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                No, annulla
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DashProfile;
