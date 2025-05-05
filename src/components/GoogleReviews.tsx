import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, ExternalLink } from 'lucide-react';

interface GoogleReview {
  id: string;
  author_name: string;
  rating: number;
  text: string;
  time: number;
  profile_photo_url: string;
}

const GoogleReviews: React.FC = () => {
  const [reviews, setReviews] = useState<GoogleReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      // Normalement, cette requête serait faite via une Edge Function pour protéger la clé API
      // Pour la démo, on utilise des données fictives
      
      // Simuler un délai de chargement
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockReviews: GoogleReview[] = [
        {
          id: '1',
          author_name: 'Karim Benzarti',
          rating: 5,
          text: "Un accompagnement exceptionnel pour la création de mon entreprise. L'équipe comprend parfaitement les enjeux spécifiques des entrepreneurs franco-maghrébins. Leur expertise en fiscalité internationale m'a permis d'optimiser mon développement entre la France et la Tunisie.",
          time: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 jours avant
          profile_photo_url: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1'
        },
        {
          id: '2',
          author_name: 'Leila Mansouri',
          rating: 5,
          text: "MBC nous accompagne depuis 3 ans dans notre développement. Leur expertise en comptabilité internationale et leur compréhension des spécificités culturelles sont de vrais atouts. Je recommande particulièrement leur service de gestion de paie qui s'adapte à nos besoins entre la France et le Maghreb.",
          time: Date.now() - 14 * 24 * 60 * 60 * 1000, // 14 jours avant
          profile_photo_url: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1'
        },
        {
          id: '3',
          author_name: 'Ahmed Bouazizi',
          rating: 5,
          text: "Un cabinet qui allie professionnalisme et proximité. L'équipe bilingue facilite grandement nos échanges et leur connaissance du secteur de la restauration est un vrai plus. Merci pour votre accompagnement au quotidien.",
          time: Date.now() - 21 * 24 * 60 * 60 * 1000, // 21 jours avant
          profile_photo_url: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1'
        },
        {
          id: '4',
          author_name: 'Sophie Dubois',
          rating: 4,
          text: "Très satisfaite des services de MBC pour la gestion comptable de mon entreprise. Réactivité et professionnalisme au rendez-vous. Je retire une étoile uniquement car j'aurais aimé plus de conseils sur la stratégie fiscale, mais pour le reste c'est parfait.",
          time: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30 jours avant
          profile_photo_url: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1'
        },
        {
          id: '5',
          author_name: 'Mohammed El Amrani',
          rating: 5,
          text: "Excellent cabinet d'expertise comptable, spécialisé dans l'accompagnement des entrepreneurs franco-marocains. Ils m'ont aidé à structurer mon activité entre la France et le Maroc de façon optimale. Je recommande vivement !",
          time: Date.now() - 45 * 24 * 60 * 60 * 1000, // 45 jours avant
          profile_photo_url: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1'
        }
      ];
      
      setReviews(mockReviews);
      
      // Calculer la note moyenne
      const totalRating = mockReviews.reduce((sum, review) => sum + review.rating, 0);
      setAverageRating(totalRating / mockReviews.length);
      
    } catch (err) {
      console.error('Erreur lors du chargement des avis Google:', err);
      setError('Impossible de charger les avis Google. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('fr-FR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <img 
              src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" 
              alt="Google" 
              className="h-8 object-contain"
            />
            <span className="ml-2 text-lg font-medium">Avis clients</span>
          </div>
          
          <div className="flex items-center justify-center mb-4">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-8 h-8 ${
                    star <= Math.round(averageRating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 text-2xl font-bold">{averageRating.toFixed(1)}</span>
            <span className="ml-2 text-gray-500">({reviews.length} avis)</span>
          </div>
          
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez ce que nos clients disent de nos services d'expertise comptable et fiscale
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <img 
                  src={review.profile_photo_url} 
                  alt={review.author_name} 
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="ml-3">
                  <h3 className="font-semibold text-gray-900">{review.author_name}</h3>
                  <p className="text-xs text-gray-500">{formatDate(review.time)}</p>
                </div>
              </div>
              
              <div className="flex mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= review.rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              
              <p className="text-gray-600 mb-4 line-clamp-4">{review.text}</p>
              
              <div className="flex justify-between items-center">
                <button className="text-gray-500 hover:text-primary transition-colors flex items-center">
                  <ThumbsUp className="w-4 h-4 mr-1" />
                  <span className="text-sm">Utile</span>
                </button>
                <a 
                  href="https://g.page/r/example-review-link" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center text-sm"
                >
                  <span>Voir sur Google</span>
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <a 
            href="https://g.page/r/example-review-link" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <img 
              src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" 
              alt="Google" 
              className="h-5 mr-2"
            />
            Laisser un avis sur Google
          </a>
        </div>
      </div>
    </section>
  );
};

export default GoogleReviews;