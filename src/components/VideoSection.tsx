import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { useTracking } from '../hooks/useTracking';
import { Play, Clock, Share2, ThumbsUp } from 'lucide-react';
import LazyImage from './LazyImage';

interface Video {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  category: string;
  duration: string;
  views: number;
  likes: number;
}

const videos: Video[] = [
  {
    id: '1',
    title: 'Comprendre son bilan comptable en 1 minute - Guide rapide pour entrepreneurs',
    description: 'Explication simple et claire des éléments clés d\'un bilan comptable pour les entrepreneurs non-initiés.',
    url: 'https://www.youtube.com/watch?v=example1',
    thumbnail: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg',
    category: 'comptabilité',
    duration: '1:15',
    views: 1250,
    likes: 87
  },
  {
    id: '2',
    title: 'Tout savoir sur la TVA en 2025 - Nouveaux taux et obligations déclaratives',
    description: 'Les dernières actualités sur la TVA en 2025, les changements de taux et les obligations pour les entreprises.',
    url: 'https://www.youtube.com/watch?v=example2',
    thumbnail: 'https://images.pexels.com/photos/3183153/pexels-photo-3183153.jpeg',
    category: 'fiscalité',
    duration: '2:30',
    views: 980,
    likes: 65
  },
  {
    id: '3',
    title: 'Guide URSSAF 2025 pour les indépendants - Simplifiez vos démarches',
    description: 'Comprendre et gérer vos cotisations sociales efficacement avec les nouvelles règles 2025.',
    url: 'https://www.youtube.com/watch?v=example3',
    thumbnail: 'https://images.pexels.com/photos/3183165/pexels-photo-3183165.jpeg',
    category: 'urssaf',
    duration: '3:45',
    views: 750,
    likes: 42
  },
  {
    id: '4',
    title: 'Optimisation fiscale France-Tunisie - Stratégies légales pour entrepreneurs',
    description: 'Comment structurer votre activité entre la France et la Tunisie pour une fiscalité optimisée et conforme.',
    url: 'https://www.youtube.com/watch?v=example4',
    thumbnail: 'https://images.pexels.com/photos/7567562/pexels-photo-7567562.jpeg',
    category: 'international',
    duration: '4:20',
    views: 1820,
    likes: 124
  },
  {
    id: '5',
    title: 'Créer sa SAS en 2025 - Procédure complète et coûts réels',
    description: 'Guide étape par étape pour créer votre SAS en 2025, avec tous les coûts et démarches expliqués.',
    url: 'https://www.youtube.com/watch?v=example5',
    thumbnail: 'https://images.pexels.com/photos/8867431/pexels-photo-8867431.jpeg',
    category: 'création',
    duration: '5:10',
    views: 2450,
    likes: 178
  },
  {
    id: '6',
    title: 'Dividendes vs Rémunération - Quelle stratégie pour le dirigeant en 2025?',
    description: 'Analyse comparative entre versement de dividendes et rémunération pour optimiser vos revenus de dirigeant.',
    url: 'https://www.youtube.com/watch?v=example6',
    thumbnail: 'https://images.pexels.com/photos/7821788/pexels-photo-7821788.jpeg',
    category: 'fiscalité',
    duration: '3:55',
    views: 1680,
    likes: 103
  }
];

const VideoSection: React.FC = () => {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { trackVideoInteraction } = useTracking();
  const videoRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const categories = [
    { id: 'all', label: 'Tous' },
    { id: 'comptabilité', label: 'Comptabilité' },
    { id: 'fiscalité', label: 'Fiscalité' },
    { id: 'urssaf', label: 'URSSAF' },
    { id: 'création', label: 'Création d\'entreprise' },
    { id: 'international', label: 'International' }
  ];

  const filteredVideos = selectedCategory === 'all' 
    ? videos 
    : videos.filter(video => video.category === selectedCategory);

  const handleVideoStart = (videoId: string) => {
    trackVideoInteraction(videoId, 'play');
  };

  const handleVideoEnd = (videoId: string) => {
    trackVideoInteraction(videoId, 'complete');
  };

  const handleLike = (videoId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    trackVideoInteraction(videoId, 'like');
  };

  const handleShare = (videoId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    // Créer l'URL de partage
    const shareUrl = `${window.location.origin}/videos/${videoId}`;
    
    // Vérifier si l'API Web Share est disponible
    if (navigator.share) {
      navigator.share({
        title: videos.find(v => v.id === videoId)?.title || 'Vidéo MBC Consulting',
        text: videos.find(v => v.id === videoId)?.description || 'Regardez cette vidéo de MBC Consulting',
        url: shareUrl
      }).catch(err => {
        console.error('Erreur lors du partage:', err);
      });
    } else {
      // Fallback: copier l'URL dans le presse-papier
      navigator.clipboard.writeText(shareUrl).then(() => {
        alert('Lien copié dans le presse-papier !');
      }).catch(err => {
        console.error('Erreur lors de la copie:', err);
      });
    }
  };

  // Scroll vers la vidéo active
  useEffect(() => {
    if (activeVideo && videoRefs.current[activeVideo]) {
      videoRefs.current[activeVideo]?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  }, [activeVideo]);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            VIDÉOS PÉDAGOGIQUES
          </span>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Comprendre la comptabilité et la fiscalité en quelques minutes
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Des explications simples et claires pour maîtriser les concepts essentiels de la gestion d'entreprise
          </p>
        </div>

        <div className="flex justify-center mb-8 space-x-4 overflow-x-auto pb-4 scrollbar-hide">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full transition-colors ${
                selectedCategory === category.id
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredVideos.map((video) => (
            <div 
              key={video.id} 
              className="bg-white rounded-lg overflow-hidden shadow-lg group"
              ref={el => videoRefs.current[video.id] = el}
            >
              <div className="relative aspect-w-16 aspect-h-9">
                {activeVideo === video.id ? (
                  <ReactPlayer
                    url={video.url}
                    width="100%"
                    height="100%"
                    controls
                    playing
                    onStart={() => handleVideoStart(video.id)}
                    onEnded={() => handleVideoEnd(video.id)}
                    config={{
                      youtube: {
                        playerVars: { 
                          origin: window.location.origin,
                          rel: 0
                        }
                      }
                    }}
                  />
                ) : (
                  <button
                    onClick={() => setActiveVideo(video.id)}
                    className="w-full h-full group"
                    aria-label={`Lire la vidéo: ${video.title}`}
                  >
                    <LazyImage
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110">
                        <Play className="w-8 h-8 text-primary ml-1" />
                      </div>
                    </div>
                    <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {video.duration}
                    </div>
                  </button>
                )}
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs">
                    {video.category.charAt(0).toUpperCase() + video.category.slice(1)}
                  </span>
                  <div className="flex items-center text-gray-500 text-xs">
                    <span className="mr-2">{video.views.toLocaleString()} vues</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-primary transition-colors cursor-pointer" onClick={() => setActiveVideo(video.id)}>
                  {video.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{video.description}</p>
                <div className="flex justify-between items-center">
                  <button 
                    className="flex items-center text-gray-500 hover:text-primary transition-colors"
                    onClick={(e) => handleLike(video.id, e)}
                    aria-label="J'aime cette vidéo"
                  >
                    <ThumbsUp className="w-4 h-4 mr-1" />
                    <span className="text-sm">{video.likes}</span>
                  </button>
                  <button 
                    className="flex items-center text-gray-500 hover:text-primary transition-colors"
                    onClick={(e) => handleShare(video.id, e)}
                    aria-label="Partager cette vidéo"
                  >
                    <Share2 className="w-4 h-4 mr-1" />
                    <span className="text-sm">Partager</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a 
            href="https://www.youtube.com/channel/UC_example_channel" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 border-2 border-primary text-primary font-medium rounded-md hover:bg-primary hover:text-white transition-colors"
          >
            Voir toutes nos vidéos
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;