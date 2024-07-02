import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Header from './components/Header';
import FooterCom from './components/Footer';
import CreatePost from './pages/CreatePost';
import UpdatePost from './pages/UpdatePost';
import PostPage from './pages/PostPage';
import ScrollToTop from './components/ScrollToTop';
import Search from './pages/Search';
import { UserProvider } from './components/UserContext';
import 'bootstrap/dist/css/bootstrap.min.css';

/**
 * Componente principale dell'applicazione React.
 * 
 * @returns {JSX.Element} Elemento JSX che rappresenta l'intera applicazione.
 */
const App = () => {
  return (
    <UserProvider>
      <ScrollToTop />
      <Header />
      <Routes>
        {/* Rotte per i diversi percorsi dell'applicazione */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/search" element={<Search />} />
        <Route path="/post/:postSlug" element={<PostPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/update-post/:postId" element={<UpdatePost />} />
      </Routes>
      <FooterCom />
    </UserProvider>
  );
};

export default App;
