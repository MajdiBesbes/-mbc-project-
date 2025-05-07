import React from 'react';
import { Link } from 'react-router-dom';
import { FaLinkedin, FaTwitter, FaFacebook, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import '../styles/footer.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Section Contact */}
          <div className="footer-section">
            <h3 className="footer-title">Contact</h3>
            <div className="footer-contact">
              <div className="contact-item">
                <FaMapMarkerAlt className="contact-icon" />
                <span>123 Rue de l'Innovation, 75000 Paris</span>
              </div>
              <div className="contact-item">
                <FaPhone className="contact-icon" />
                <span>+33 1 23 45 67 89</span>
              </div>
              <div className="contact-item">
                <FaEnvelope className="contact-icon" />
                <span>contact@mbc-consulting.fr</span>
              </div>
            </div>
          </div>

          {/* Section Liens Rapides */}
          <div className="footer-section">
            <h3 className="footer-title">Liens Rapides</h3>
            <nav className="footer-nav">
              <Link to="/services" className="footer-link">Services</Link>
              <Link to="/about" className="footer-link">À Propos</Link>
              <Link to="/contact" className="footer-link">Contact</Link>
              <Link to="/mentions-legales" className="footer-link">Mentions Légales</Link>
            </nav>
          </div>

          {/* Section Réseaux Sociaux */}
          <div className="footer-section">
            <h3 className="footer-title">Suivez-nous</h3>
            <div className="social-links">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <FaLinkedin />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <FaTwitter />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <FaFacebook />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright">
            © {currentYear} MBC High Value Business Consulting. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default React.memo(Footer); 