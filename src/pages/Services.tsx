import React from 'react';
import LazyImage from '../components/LazyImage';
import MainLayout from '../layouts/MainLayout';
import '../styles/services.css';

const Services: React.FC = () => {
  return (
    <MainLayout
      title="Nos Services - MBC High Value Business Consulting"
      description="Découvrez nos services de conseil en stratégie, transformation digitale et optimisation des processus pour votre entreprise."
    >
      <main className="services-page">
        <section className="hero">
          <LazyImage
            src="/images/services-hero.jpg"
            alt="Nos services de conseil"
            width={1920}
            height={600}
            placeholder="/images/services-hero-placeholder.jpg"
          />
          <div className="hero-content">
            <h1>Nos Services</h1>
            <p>Des solutions sur mesure pour votre réussite</p>
          </div>
        </section>

        <section className="services-grid">
          <div className="service-card">
            <LazyImage
              src="/images/strategy.jpg"
              alt="Conseil en stratégie"
              width={400}
              height={300}
              placeholder="/images/strategy-placeholder.jpg"
            />
            <h2>Conseil en Stratégie</h2>
            <p>Développez une vision claire et des objectifs mesurables</p>
          </div>

          <div className="service-card">
            <LazyImage
              src="/images/digital.jpg"
              alt="Transformation digitale"
              width={400}
              height={300}
              placeholder="/images/digital-placeholder.jpg"
            />
            <h2>Transformation Digitale</h2>
            <p>Accélérez votre transition vers le numérique</p>
          </div>

          <div className="service-card">
            <LazyImage
              src="/images/process.jpg"
              alt="Optimisation des processus"
              width={400}
              height={300}
              placeholder="/images/process-placeholder.jpg"
            />
            <h2>Optimisation des Processus</h2>
            <p>Améliorez l'efficacité et la productivité de votre entreprise</p>
          </div>
        </section>
      </main>
    </MainLayout>
  );
};

export default Services; 