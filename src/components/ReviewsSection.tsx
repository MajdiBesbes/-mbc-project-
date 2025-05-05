import React, { useState } from 'react';
import { Star, ThumbsUp, MessageCircle } from 'lucide-react';
import { useTracking } from '../hooks/useTracking';
import { useAnalytics } from '../hooks/useAnalytics';

interface Review {
  id: string;
  author: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  date: string;
  helpful: number;
  language: string;
  region: string;
  verified: boolean;
}

const reviews: Review[] = [
  {
    id: '1',
    author: 'Karim Benzarti',
    role: 'Fondateur',
    company: 'KB Digital',
    content: "Un accompagnement exceptionnel pour la création de mon entreprise. L'équipe comprend parfaitement les enjeux spécifiques des entrepreneurs franco-maghrébins. Leur expertise en fiscalité internationale m'a permis d'optimiser mon développement entre la France et la Tunisie.",
    rating: 5,
    date: '2025-03-15',
    helpful: 24,
    language: 'fr-FR',
    region: 'Île-de-France',
    verified: true
  },
  {
    id: '2',
    author: 'Leila Mansouri',
    role: 'Directrice',
    company: 'LM Import-Export',
    content: "MBC nous accompagne depuis 3 ans dans notre développement. Leur expertise en comptabilité internationale et leur compréhension des spécificités culturelles sont de vrais atouts. Je recommande particulièrement leur service de gestion de paie qui s'adapte à nos besoins entre la France et le Maghreb.",
    rating: 5,
    date: '2025-03-10',
    helpful: 18,
    language: 'fr-FR',
    region: 'Paris',
    verified: true
  },
  {
    id: '3',
    author: 'Ahmed Bouazizi',
    role: 'Gérant',
    company: 'Saveurs du Maghreb',
    content: "Un cabinet qui allie professionnalisme et proximité. L'équipe bilingue facilite grandement nos échanges et leur connaissance du secteur de la restauration est un vrai plus. Merci pour votre accompagnement au quotidien.",
    rating: 5,
    date: '2025-03-05',
    helpful: 15,
    language: 'ar-TN',
    region: 'Lyon',
    verified: true
  }
];

const ReviewsSection: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [helpfulReviews, setHelpfulReviews] = useState<string[]>([]);
  const { trackCulturalEngagement } = useAnalytics();
  const { trackClick } = useTracking();

  const handleHelpful = (reviewId: string) => {
    if (!helpfulReviews.includes(reviewId)) {
      setHelpfulReviews([...helpfulReviews, reviewId]);
      trackClick('review_helpful');
    }
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    trackCulturalEngagement('review_filter', filter);
  };

  const filteredReviews = activeFilter === 'all' 
    ? reviews 
    : reviews.filter(review => review.region.toLowerCase().includes(activeFilter.toLowerCase()));

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Avis de nos clients
          </h2>
          <p className="text-xl text-gray-600">
            Découvrez les retours d'expérience de nos clients entrepreneurs
          </p>
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={() => handleFilterChange('all')}
              className={`px-4 py-2 rounded-full transition-colors ${
                activeFilter === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              Tous les avis
            </button>
            <button
              onClick={() => handleFilterChange('paris')}
              className={`px-4 py-2 rounded-full transition-colors ${
                activeFilter === 'paris'
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              Paris
            </button>
            <button
              onClick={() => handleFilterChange('île-de-france')}
              className={`px-4 py-2 rounded-full transition-colors ${
                activeFilter === 'île-de-france'
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              Île-de-France
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredReviews.map((review) => (
            <div key={review.id} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {review.author}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {review.role} chez {review.company}
                  </p>
                </div>
                {review.verified && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    Vérifié
                  </span>
                )}
              </div>

              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    className={`w-5 h-5 ${
                      index < review.rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {new Date(review.date).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>

              <p className="text-gray-600 mb-4">{review.content}</p>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <button
                  onClick={() => handleHelpful(review.id)}
                  className={`flex items-center gap-2 px-3 py-1 rounded-full transition-colors ${
                    helpfulReviews.includes(review.id)
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>Utile ({review.helpful})</span>
                </button>
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  <span>Répondre</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;