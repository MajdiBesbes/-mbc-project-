import React from 'react';
import MainLayout from '../layouts/MainLayout';
import '../styles/mentions-legales.css';

const MentionsLegales: React.FC = () => {
  return (
    <MainLayout
      title="Mentions Légales - MBC High Value Business Consulting"
      description="Consultez les mentions légales de MBC Consulting, incluant les informations légales, la politique de confidentialité et les conditions d'utilisation."
    >
      <main className="mentions-legales-page">
        <div className="container">
          <h1>Mentions Légales</h1>
          
          <section className="legal-section">
            <h2>Informations Légales</h2>
            <div className="legal-content">
              <h3>Éditeur du site</h3>
              <p>
                MBC High Value Business Consulting<br />
                123 rue de Paris<br />
                75000 Paris<br />
                France
              </p>
              <p>
                Téléphone : +33 1 23 45 67 89<br />
                Email : contact@mbc-consulting.fr
              </p>
              <p>
                SAS au capital de 10 000 €<br />
                RCS Paris B 123 456 789<br />
                N° TVA intracommunautaire : FR 12 345678901
              </p>
            </div>
          </section>

          <section className="legal-section">
            <h2>Hébergement</h2>
            <div className="legal-content">
              <p>
                Ce site est hébergé par :<br />
                Vercel Inc.<br />
                340 S Lemon Ave #4133<br />
                Walnut, CA 91789<br />
                États-Unis
              </p>
            </div>
          </section>

          <section className="legal-section">
            <h2>Propriété Intellectuelle</h2>
            <div className="legal-content">
              <p>
                L'ensemble de ce site relève de la législation française et internationale 
                sur le droit d'auteur et la propriété intellectuelle. Tous les droits de 
                reproduction sont réservés, y compris pour les documents téléchargeables 
                et les représentations iconographiques et photographiques.
              </p>
              <p>
                La reproduction de tout ou partie de ce site sur un support électronique 
                quel qu'il soit est formellement interdite sauf autorisation expresse 
                du directeur de la publication.
              </p>
            </div>
          </section>

          <section className="legal-section">
            <h2>Protection des Données Personnelles</h2>
            <div className="legal-content">
              <p>
                Conformément à la loi "Informatique et Libertés" du 6 janvier 1978 modifiée, 
                et au Règlement Général sur la Protection des Données (RGPD), vous disposez 
                d'un droit d'accès, de rectification et de suppression des données vous 
                concernant.
              </p>
              <p>
                Pour exercer ce droit, vous pouvez nous contacter par email à 
                privacy@mbc-consulting.fr ou par courrier à l'adresse mentionnée ci-dessus.
              </p>
            </div>
          </section>

          <section className="legal-section">
            <h2>Cookies</h2>
            <div className="legal-content">
              <p>
                Notre site utilise des cookies pour améliorer votre expérience de navigation. 
                Vous pouvez à tout moment désactiver l'utilisation de cookies en sélectionnant 
                les paramètres appropriés de votre navigateur.
              </p>
            </div>
          </section>
        </div>
      </main>
    </MainLayout>
  );
};

export default MentionsLegales; 