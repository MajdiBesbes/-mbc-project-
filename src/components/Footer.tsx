import React from 'react';
import { Link } from 'react-router-dom';
import { Linkedin, Instagram, Facebook, TiktokLogo } from './SocialIcons';
import LazyImage from './LazyImage';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <img 
              src="/images/logo.png" 
              alt="MBC High Value Business Consulting" 
              className="h-16 mb-4 brightness-0 invert"
              loading="lazy"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://via.placeholder.com/160x80?text=MBC";
                target.onerror = null;
              }}
            />
            <p className="mb-4 text-gray-300">Expert-comptable inscrit au tableau de l'OEC Île-de-France</p>
            <p className="mb-4 text-gray-300">N° inscription : 140002898701</p>
            <div className="flex space-x-4">
              <a href="https://www.linkedin.com/company/mbc-consulting" target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary transition-colors" aria-label="LinkedIn">
                <Linkedin />
              </a>
              <a href="https://www.instagram.com/mbc.consulting" target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary transition-colors" aria-label="Instagram">
                <Instagram />
              </a>
              <a href="https://www.tiktok.com/@mbc.consulting" target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary transition-colors" aria-label="TikTok">
                <TiktokLogo />
              </a>
              <a href="https://www.facebook.com/mbcconsulting" target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary transition-colors" aria-label="Facebook">
                <Facebook />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Liens rapides</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Accueil</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors">MBC</Link></li>
              <li><Link to="/services" className="text-gray-300 hover:text-white transition-colors">Services</Link></li>
              <li><Link to="/devis" className="text-gray-300 hover:text-white transition-colors">Devis</Link></li>
              <li><Link to="/blog" className="text-gray-300 hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Nos services</h4>
            <ul className="space-y-2">
              <li><Link to="/services#comptabilite" className="text-gray-300 hover:text-white transition-colors">Comptabilité</Link></li>
              <li><Link to="/services#fiscalite" className="text-gray-300 hover:text-white transition-colors">Fiscalité</Link></li>
              <li><Link to="/services#conseil" className="text-gray-300 hover:text-white transition-colors">Conseil</Link></li>
              <li><Link to="/services#paie" className="text-gray-300 hover:text-white transition-colors">Externalisation paie</Link></li>
              <li><Link to="/services#previsionnel" className="text-gray-300 hover:text-white transition-colors">Prévisionnel financier</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <address className="not-italic text-gray-300">
              <p className="mb-2">39 Avenue des Sablons Brouillants</p>
              <p className="mb-4">77100 Meaux</p>
              <p className="mb-2">Mobile : <a href="tel:+33676570097" className="hover:text-white">06 76 57 00 97</a></p>
              <p className="mb-2">Fixe : <a href="tel:+33422138447" className="hover:text-white">04 22 13 84 47</a></p>
              <p>Email : <a href="mailto:majdi.besbes@gmail.com" className="hover:text-white">majdi.besbes@gmail.com</a></p>
            </address>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {currentYear} MBC High Value Business Consulting. Tous droits réservés.
          </p>
          <div className="flex space-x-6">
            <Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">Politique de confidentialité</Link>
            <Link to="/legal" className="text-gray-400 hover:text-white text-sm transition-colors">Mentions légales</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;