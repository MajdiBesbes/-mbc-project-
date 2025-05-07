import React from 'react';
import LazyImage from '../components/LazyImage';
import MainLayout from '../layouts/MainLayout';
import '../styles/a-propos.css';

const APropos: React.FC = () => {
  return (
    <MainLayout
      title="À propos - MBC High Value Business Consulting"
      description="Découvrez l'histoire et les valeurs de MBC Consulting, votre partenaire de confiance pour la réussite de votre entreprise."
    >
      <main className="a-propos-page">
        <section className="hero">
          <LazyImage
            src="/images/about-hero.jpg"
            alt="Notre équipe"
            width={1920}
            height={600}
            placeholder="/images/about-hero-placeholder.jpg"
          />
          <div className="hero-content">
            <h1>À propos de nous</h1>
            <p>Une expertise au service de votre réussite</p>
          </div>
        </section>

        <section className="about-content">
          <div className="container">
            <div className="about-grid">
              <div className="about-text">
                <h2>Notre Histoire</h2>
                <p>
                  Fondée en 2010, MBC Consulting s'est imposée comme un acteur majeur 
                  du conseil en entreprise. Notre mission est d'accompagner les 
                  organisations dans leur développement et leur transformation.
                </p>
                <p>
                  Avec plus de 10 ans d'expérience, nous avons développé une expertise 
                  unique dans l'accompagnement des entreprises de toutes tailles.
                </p>
              </div>
              <div className="about-image">
                <LazyImage
                  src="/images/office.jpg"
                  alt="Nos bureaux"
                  width={600}
                  height={400}
                  placeholder="/images/office-placeholder.jpg"
                />
              </div>
            </div>

            <div className="values-section">
              <h2>Nos Valeurs</h2>
              <div className="values-grid">
                <div className="value-card">
                  <div className="value-icon">🎯</div>
                  <h3>Excellence</h3>
                  <p>Nous visons l'excellence dans chaque mission que nous entreprenons.</p>
                </div>
                <div className="value-card">
                  <div className="value-icon">🤝</div>
                  <h3>Confiance</h3>
                  <p>La confiance de nos clients est notre plus grande récompense.</p>
                </div>
                <div className="value-card">
                  <div className="value-icon">💡</div>
                  <h3>Innovation</h3>
                  <p>Nous repoussons les limites pour trouver des solutions créatives.</p>
                </div>
              </div>
            </div>

            <div className="team-section">
              <h2>Notre Équipe</h2>
              <div className="team-grid">
                <div className="team-member">
                  <LazyImage
                    src="/images/team-1.jpg"
                    alt="Directeur"
                    width={300}
                    height={300}
                    placeholder="/images/team-1-placeholder.jpg"
                  />
                  <h3>Jean Dupont</h3>
                  <p>Directeur</p>
                </div>
                <div className="team-member">
                  <LazyImage
                    src="/images/team-2.jpg"
                    alt="Consultant Senior"
                    width={300}
                    height={300}
                    placeholder="/images/team-2-placeholder.jpg"
                  />
                  <h3>Marie Martin</h3>
                  <p>Consultant Senior</p>
                </div>
                <div className="team-member">
                  <LazyImage
                    src="/images/team-3.jpg"
                    alt="Expert Digital"
                    width={300}
                    height={300}
                    placeholder="/images/team-3-placeholder.jpg"
                  />
                  <h3>Pierre Durand</h3>
                  <p>Expert Digital</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </MainLayout>
  );
};

export default APropos; 