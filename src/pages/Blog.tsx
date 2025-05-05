import React from 'react';
import BlogPost from '../components/BlogPost';
import CallToAction from '../components/CallToAction';

const Blog: React.FC = () => {
  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Blog & Actualités</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez nos articles et vidéos sur l'actualité comptable, fiscale et entrepreneuriale, spécialement adaptés aux entrepreneurs franco-maghrébins
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <BlogPost
            id="creation-entreprise-france-maghreb"
            title="Guide complet : Créer son entreprise en France pour les entrepreneurs maghrébins"
            excerpt="Toutes les étapes pour réussir votre projet entrepreneurial en France, avec les spécificités pour les entrepreneurs d'origine maghrébine."
            date="2025-01-15"
            category="Création"
            thumbnail="https://images.pexels.com/photos/7681091/pexels-photo-7681091.jpeg"
          />
          <BlogPost
            id="optimisation-fiscale-internationale"
            title="Optimisation fiscale France-Maghreb : les bonnes pratiques"
            excerpt="Comment optimiser sa fiscalité légalement dans un contexte d'activité entre la France et le Maghreb."
            date="2025-01-08"
            category="Fiscalité"
            thumbnail="https://images.pexels.com/photos/7821788/pexels-photo-7821788.jpeg"
          />
          <BlogPost
            id="gestion-tresorerie-tpe"
            title="Gestion de trésorerie pour les TPE"
            excerpt="Conseils pratiques pour une gestion efficace de votre trésorerie et le développement de votre entreprise."
            date="2024-12-22"
            category="Gestion"
            thumbnail="https://images.pexels.com/photos/8297452/pexels-photo-8297452.jpeg"
          />
          <BlogPost
            id="webinaire-developpement-international"
            title="Développer son activité entre la France et le Maghreb"
            excerpt="Replay de notre webinaire sur les opportunités et les aspects pratiques du développement international."
            date="2024-12-15"
            category="International"
            thumbnail="https://images.pexels.com/photos/7821486/pexels-photo-7821486.jpeg"
            isVideo={true}
            videoUrl="https://www.youtube.com/watch?v=example2"
          />
          <BlogPost
            id="tuto-comptabilite-tpe"
            title="Maîtrisez votre comptabilité d'entreprise"
            excerpt="Guide vidéo pratique pour comprendre et gérer efficacement votre comptabilité."
            date="2024-12-10"
            category="Formation"
            thumbnail="https://images.pexels.com/photos/8867431/pexels-photo-8867431.jpeg"
            isVideo={true}
            videoUrl="https://www.youtube.com/watch?v=example3"
          />
          <BlogPost
            id="success-stories"
            title="Success Stories d'entrepreneurs franco-maghrébins"
            excerpt="Découvrez les parcours inspirants d'entrepreneurs qui ont réussi leur développement en France."
            date="2024-12-05"
            category="Témoignages"
            thumbnail="https://images.pexels.com/photos/7681960/pexels-photo-7681960.jpeg"
          />
        </div>

        <CallToAction />
      </div>
    </div>
  );
};

export default Blog;