import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowUp, Bell } from 'lucide-react';
import Footer from './Footer';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';
import NotificationCenter from './NotificationCenter';
import SearchBar from './SearchBar';
import { useAuth } from '../contexts/AuthContext';

const Layout: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      setShowScrollTop(window.scrollY > 300);
    };

    // Appliquer immédiatement pour éviter le saut
    handleScroll();
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900">
      <header 
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled ? 'bg-white dark:bg-gray-800 shadow-md py-2' : 'bg-transparent py-4'
        }`}
        style={{ height: scrolled ? '64px' : '80px' }} // Hauteur fixe pour éviter les sauts
      >
        <div className="container mx-auto px-4 flex justify-between items-center h-full">
          <Link to="/" className="flex items-center">
            <img 
              src="/images/logo.png" 
              alt="MBC" 
              className="h-12 md:h-16 object-contain dark:invert"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://via.placeholder.com/160x80?text=MBC";
                target.onerror = null;
              }}
            />
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex space-x-6">
              <Link to="/" className="nav-link dark:text-gray-200">Accueil</Link>
              <Link to="/about" className="nav-link dark:text-gray-200">MBC</Link>
              <Link to="/services" className="nav-link dark:text-gray-200">Services</Link>
              <Link to="/simulators" className="nav-link dark:text-gray-200">Simulateurs</Link>
              <Link to="/blog" className="nav-link dark:text-gray-200">Blog</Link>
              <Link to="/expert-access" className="nav-link dark:text-gray-200">Connexion</Link>
              <Link to="/contact" className="nav-link dark:text-gray-200">Contact</Link>
            </nav>
            <div className="flex items-center space-x-4">
              <SearchBar />
              {user && <NotificationCenter />}
              <ThemeToggle />
              <LanguageSwitcher />
            </div>
          </div>
          
          <button 
            className="md:hidden text-primary dark:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </header>
      
      {/* Mobile menu */}
      <div className={`fixed inset-0 bg-white dark:bg-gray-900 z-50 transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 md:hidden`}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <img 
              src="/images/logo.png" 
              alt="MBC" 
              className="h-10 object-contain dark:invert"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://via.placeholder.com/160x80?text=MBC";
                target.onerror = null;
              }}
            />
          </Link>
          <button 
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close menu"
          >
            <X size={24} className="text-primary dark:text-white" />
          </button>
        </div>
        <nav className="container mx-auto px-4 py-8 flex flex-col space-y-6">
          <SearchBar mobile />
          <Link to="/" className="text-xl font-medium text-gray-800 dark:text-white hover:text-primary">Accueil</Link>
          <Link to="/about" className="text-xl font-medium text-gray-800 dark:text-white hover:text-primary">MBC</Link>
          <Link to="/services" className="text-xl font-medium text-gray-800 dark:text-white hover:text-primary">Services</Link>
          <Link to="/devis" className="text-xl font-medium text-gray-800 dark:text-white hover:text-primary">Devis</Link>
          <Link to="/simulators" className="text-xl font-medium text-gray-800 dark:text-white hover:text-primary">Simulateurs</Link>
          <Link to="/blog" className="text-xl font-medium text-gray-800 dark:text-white hover:text-primary">Blog</Link>
          <Link to="/creation-entreprise" className="text-xl font-medium text-gray-800 dark:text-white hover:text-primary">Créer mon entreprise</Link>
          <Link to="/expert-access" className="text-xl font-medium text-gray-800 dark:text-white hover:text-primary">Connexion</Link>
          <Link to="/contact" className="text-xl font-medium text-gray-800 dark:text-white hover:text-primary">Contact</Link>
          <div className="pt-4 flex items-center space-x-4">
            {user && <NotificationCenter />}
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
        </nav>
      </div>
      
      {/* Ajout d'un espace pour compenser la hauteur du header fixe */}
      <div className={`${scrolled ? 'h-16' : 'h-20'} transition-all duration-300`}></div>
      
      <main className="flex-grow dark:bg-gray-900 dark:text-white">
        <Outlet />
      </main>
      
      <Footer />
      
      {/* Scroll to top button */}
      <button 
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 bg-primary text-white p-3 rounded-full shadow-lg transition-opacity duration-300 ${
          showScrollTop ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        aria-label="Scroll to top"
      >
        <ArrowUp size={20} />
      </button>
    </div>
  );
};

export default Layout;