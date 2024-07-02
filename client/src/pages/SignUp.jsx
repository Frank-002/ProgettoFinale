import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, Spinner, Container, Form, Button } from 'react-bootstrap';
import OAuth from '../components/OAuth';


/**
 * Componente per la pagina di registrazione.
 * Gestisce il processo di registrazione dell'utente tramite username, email e password.
 *
 * @returns {JSX.Element} Elemento JSX che rappresenta la pagina di registrazione.
 */
const SignUp = () => {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  /**
   * Gestisce il cambiamento nei campi di input del form.
   * @param {React.ChangeEvent<HTMLInputElement>} e Evento di cambiamento generato dal campo di input.
   */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  /**
   * Gestisce l'invio del form di registrazione.
   * Effettua una richiesta POST al server per la registrazione dell'utente.
   * @param {React.FormEvent<HTMLFormElement>} e Evento di submit del form.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Controllo dei campi username, email e password
    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage('All fields are required!');
    }

    try {
      setLoading(true);
      setErrorMessage(null);

      // Invia la richiesta di registrazione al server
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      // Gestisce la risposta dal server in base al successo o al fallimento della registrazione
      if (data.success === false) {
        setLoading(false);
        return setErrorMessage(data.message);
      }

      setLoading(false);

      // Se la registrazione è avvenuta con successo, reindirizza alla pagina di accesso
      if (res.ok) {
        navigate('/sign-in');
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  // Rendering del componente
  return (
    <div>
      <div className="jumbotron jumbotron-fluid text-white bg-dark">
        <Container className="text-center">
          <h1 className="display-3">Registrati</h1>
          <p className="lead mb-2">
            Benvenuto! Registrati con la tua email e password per entrare nella community.
          </p>
        </Container>
      </div>

      <div className="row justify-content-center align-items-center">
        <div className="col-md-6 pr-6 pl-6">
          <div className="card shadow">
            <div className="card-body">
              <Form onSubmit={handleSubmit}>
                {/* Campo di input per l'username */}
                <Form.Group controlId="username" className="mb-3">
                  <Form.Label>Il tuo username</Form.Label>
                  <Form.Control type="text" placeholder="Username" onChange={handleChange} />
                </Form.Group>

                {/* Campo di input per l'email */}
                <Form.Group controlId="email" className="mb-3">
                  <Form.Label>La tua email</Form.Label>
                  <Form.Control type="email" placeholder="nome@email.com" onChange={handleChange} />
                </Form.Group>

                {/* Campo di input per la password */}
                <Form.Group controlId="password" className="mb-3">
                  <Form.Label>La tua password</Form.Label>
                  <Form.Control type="password" placeholder="Password" onChange={handleChange} />
                </Form.Group>

                {/* Pulsante di submit per la registrazione */}
                <Button variant="primary" type="submit" disabled={loading} className="w-100">
                  {loading ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                      <span className="pl-3">Loading...</span>
                    </>
                  ) : (
                    'Registrati'
                  )}
                </Button>

                {/* Link per la pagina di accesso */}
                <div className="d-flex gap-2 text-sm mt-3">
                  <span>Hai già un account?</span>
                  <Link to="/sign-in" className="text-primary">
                    Accedi
                  </Link>
                </div>

                {/* Messaggio di errore in caso di fallimento della registrazione */}
                {errorMessage && (
                  <Alert variant="danger" className="mt-3">
                    {errorMessage}
                  </Alert>
                )}
              </Form>
            </div>
          </div>

          {/* Integrazione del componente OAuth per la registrazione con Google */}
          <OAuth />
        </div>
      </div>
    </div>
  );
};

export default SignUp;
