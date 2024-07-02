import { Link } from 'react-router-dom';
import '../css/PostCard.css'; // Assicurati di creare questo file CSS

/**
 * @Module PostCard
 */
/**

/**
 * Componente per visualizzare un singolo post in formato card.
 *
 * @param {object} props - Le proprietà del componente.
 * @param {object} props.post - Oggetto che rappresenta i dati del post da visualizzare.
 * @param {string} props.post.slug - Slug del post per generare il link.
 * @param {string} props.post.image - URL dell'immagine di copertina del post.
 * @param {string} props.post.title - Titolo del post.
 * @param {string} props.post.category - Categoria del post.
 * @returns {JSX.Element} Elemento JSX che rappresenta la card del post.
 */
export default function PostCard({ post }) {
    return (
        <div className='post-card position-relative border border-teal-500 overflow-hidden rounded-lg transition-all'>
            {/* Link alla pagina del post */}
            <Link to={`/post/${post.slug}`}>
                {/* Immagine di copertina del post */}
                <img
                    src={post.image}
                    alt='post cover'
                    className='post-image w-100 object-cover transition-all duration-300'
                />
            </Link>
            <div className='p-3 d-flex flex-column gap-2'>
                {/* Titolo del post */}
                <p className='text-lg font-weight-semibold text-truncate'>{post.title}</p>
                {/* Categoria del post */}
                <span className='font-italic text-sm'>{post.category}</span>
                {/* Link per leggere l'articolo completo */}
                <Link
                    to={`/post/${post.slug}`}
                    className='btn btn-outline-teal btn-block position-absolute transition-all duration-300 text-center py-2 rounded-0 read-article-link'
                >
                    Leggi articolo
                </Link>
            </div>
        </div>
    );
}
