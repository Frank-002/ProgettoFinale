import { Link } from 'react-router-dom';
import { BsFacebook, BsInstagram, BsTwitter } from 'react-icons/bs';

/**
 * @Module Footer
 */
/**

/**
 * Componente FooterCom per il footer del sito.
 *
 * @returns {JSX.Element} Il componente JSX per il footer del sito.
 */
export default function FooterCom() {
  return (
      <footer className="bg-white text-dark pt-5 mt-4 border-top ">
        <div className="container">
          <div className="row justify-content-between">
            <div className="col-lg-3 col-md-4 mt-3 text-center text-md-left d-flex align-items-center justify-content-center justify-content-md-start">
              <Link to="/" className="d-flex align-items-center text-dark text-decoration-none ml-3">
                <span
                    className="px-2 py-1 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 rounded-lg text-white ml-1 h4 mb-0">
                Byte
                </span>
                <span className="ml-1 h4 mb-0 text-dark">Beat</span>
              </Link>
            </div>
            <div className="col-lg-4 col-md-6 mt-3">
              <div className="row">
                <div className="col-6 mb-4 text-center">
                  <h5 className="footer-title font-weight-bold">Seguici</h5>
                  <ul className="list-unstyled">
                    <li>
                      <a href="https://www.poliba.it/" target="_blank" rel="noopener noreferrer" className="text-dark text-decoration-none footer-link">
                        Politecnico di Bari
                      </a>
                    </li>
                    <li>
                      <a href="https://www.instagram.com/politecnicodibari/" className="text-dark text-decoration-none footer-link">
                        Instagram
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="col-6 mb-4 text-center">
                  <h5 className="footer-title font-weight-bold">Legale</h5>
                  <ul className="list-unstyled">
                    <li>
                      <a href="#" className="text-dark text-decoration-none footer-link">Privacy Policy</a>
                    </li>
                    <li>
                      <a href="#" className="text-dark text-decoration-none footer-link">Termini & Condizioni</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <hr className="my-4" />
          <div className="d-flex justify-content-between align-items-center py-3">
            <div>
              <small>&copy; {new Date().getFullYear()} Byte Beat</small>
            </div>
            <div className="d-flex">
              <a href="#" className="text-dark me-3">
                <BsFacebook size={24} />
              </a>
              <a href="#" className="text-dark me-3">
                <BsInstagram size={24} />
              </a>
              <a href="#" className="text-dark">
                <BsTwitter size={24} />
              </a>
            </div>
          </div>
        </div>
      </footer>
  );
}
