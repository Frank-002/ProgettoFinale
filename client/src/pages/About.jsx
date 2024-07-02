import {Col, Container, Row} from "react-bootstrap";

import Image1 from '../public/Imm12.jpeg';
import Image2 from '../public/imm2.jpeg';
import Image3 from '../public/imm31.jpeg';
/**
 * @Module About
 */
/**

/**
 * Componente per la pagina "Chi siamo?" che fornisce informazioni sulla comunità.
 *
 * @returns {JSX.Element} Elemento JSX che rappresenta la pagina "Chi siamo?".
 */
export default function About() {
  return (
      <div>
        {/* Jumbotron con informazioni principali */}
        <div className='jumbotron jumbotron-fluid text-white bg-dark'>
          <div className='container text-center'>
            <h1 className='display-4'>Chi siamo?</h1>
            <p className='lead'>
              Siamo un gruppo appassionato di studenti che si impegna a condividere conoscenze, esperienze e risorse con la nostra comunità di lettori.

            </p>
          </div>
        </div>

        {/* Contenuto principale della pagina */}
        <Container className="my-5">
          <div>
            {/* Griglia di articoli statici */}
            <Row className="justify-content-center">
              {/* Prima Card */}
              <Col xs={12} md={6} lg={4} className="mb-4">
                <div className="post-card position-relative border border-teal-500 overflow-hidden rounded-lg transition-all">
                  <div className="post-image">
                    <img src={Image1} alt="Immagine predefinita 1" className="post-image w-100 object-cover transition-all duration-300" />
                  </div>
                  <div className="p-3 d-flex flex-column gap-2">
                    <h3 className="text-lg font-weight-semibold text-truncate">Girolamo Impagnatiello</h3>
                    <span className="font-italic text-sm">Studente di Ingegneria Informatica presso il Politecnico di Bari</span>
                  </div>
                </div>
              </Col>

              {/* Seconda Card */}
              <Col xs={12} md={6} lg={4} className="mb-4">
                <div className="post-card position-relative border border-teal-500 overflow-hidden rounded-lg transition-all">
                  <div className="post-image">
                    <img src={Image2} alt="Immagine predefinita 1" className="post-image w-100 object-cover transition-all duration-300" />
                  </div>
                  <div className="p-3 d-flex flex-column gap-2">
                    <h3 className="text-lg font-weight-semibold text-truncate">Michelangelo Bratta</h3>
                    <span className="font-italic text-sm">Studente di Ingegneria Informatica presso il Politecnico di Bari</span>
                  </div>
                </div>
              </Col>

              {/* Terza Cardcd */}
              <Col xs={12} md={6} lg={4} className="mb-4">
                <div className="post-card position-relative border border-teal-500 overflow-hidden rounded-lg transition-all">
                  <div className="post-image">
                    <img src={Image3} alt="Immagine predefinita 1" className="post-image w-100 object-fit-cover transition-all duration-300" />
                  </div>
                  <div className="p-3 d-flex flex-column gap-2">
                    <h3 className="text-lg font-weight-semibold text-truncate">Francesco Pio Taronna</h3>
                    <span className="font-italic text-sm">Studente di Ingegneria Informatica presso il Politecnico di Bari</span>

                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
  );
}
