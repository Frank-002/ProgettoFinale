import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, Button, Form, Spinner, Container } from 'react-bootstrap';
import { useUser } from '../components/UserContext.jsx';
import OAuth from '../components/OAuth'; // Importazione corretta del componente OAuth

/**
 * Componente per la pagina di accesso.
 * Gestisce il processo di autenticazione dell'utente tramite email e password.
 *
 * @returns {JSX.Element} Elemento JSX che rappresenta la pagina di accesso.
 */
const SignIn = () => {
  const { loading, error, signInStart, signInSuccess, signInFailure } = useUser();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });

  /**
   * Gestisce il cambiamento nei campi di input del form.
   * @param {React.ChangeEvent<HTMLInputElement>} e Evento di cambiamento generato dal campo di input.
   */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  /**
   * Gestisce l'invio del form di accesso.
   * Effettua una richiesta POST al server per l'autenticazione.
   * @param {React.FormEvent<HTMLFormElement>} e Evento di submit del form.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Controllo dei campi email e password
    if (!formData.email || !formData.password) {
      return signInFailure("Si prega di compilare tutti i campi");
    }

    try {
      signInStart();

      // Invia la richiesta di accesso al server
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      // Gestisce la risposta dal server in base al successo o al fallimento dell'autenticazione
      if (data.success === false) {
        signInFailure(data.message);
      }

      if (res.ok) {
        signInSuccess(data);
        navigate("/");
      }
    } catch (error) {
      signInFailure(error.message);
    }
  };

  // Rendering del componente
  return (
    <div>
      <div className="jumbotron jumbotron-fluid text-white bg-dark">
        <Container className="text-center">
          <h1 className="display-3">Accedi</h1>
          <p className="lead mb-2">
            Benvenuto! Accedi con la tua email e password o usa il login con Google.
          </p>
        </Container>
      </div>

      <div className="row justify-content-center align-items-center mr-0">
        <div className="col-md-6 pl-6">
          <div className="card shadow">
            <div className="card-body">
              <Form className="d-flex flex-column gap-4" onSubmit={handleSubmit}>
                {/* Campo di input per l'email */}
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>La tua email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="nome@email.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </Form.Group>

                {/* Campo di input per la password */}
                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>La tua password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="********"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </Form.Group>

                {/* Pulsante di submit per l'accesso */}
                <Button
                  variant="primary"
                  type="submit"
                  disabled={loading}
                  className="btn btn-info bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white border border-black"
                >
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Caricamento...
                    </>
                  ) : (
                    "Accedi"
                  )}
                </Button>
              </Form>

              {/* Link per la registrazione */}
              <div className="d-flex gap-2 text-sm mt-3">
                <span>Non hai un account?</span>
                <Link to="/sign-up" className="text-primary">
                  Registrati
                </Link>
              </div>

              {/* Messaggio di errore in caso di fallimento dell'autenticazione */}
              {error && (
                <Alert variant="danger" className="mt-3 text-center">
                  {error}
                </Alert>
              )}
            </div>
          </div>

          {/* Integrazione del componente OAuth per il login con Google */}
          <div className="text-center mt-4">
            <OAuth />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
