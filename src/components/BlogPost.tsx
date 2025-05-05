import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import ReactPlayer from 'react-player';
import LazyImage from './LazyImage';

interface BlogPostProps {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  thumbnail: string;
  isVideo?: boolean;
  videoUrl?: string;
}

const BlogPost: React.FC<BlogPostProps> = ({
  id,
  title,
  excerpt,
  date,
  category,
  thumbnail,
  isVideo = false,
  videoUrl
}) => {
  const [showVideo, setShowVideo] = useState(false);
  const [imageError, setImageError] = useState(false);

  const fallbackImage = "https://images.pexels.com/photos/6476254/pexels-photo-6476254.jpeg";

  return (
    <article className="bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg">
      <div className="relative">
        {showVideo && videoUrl ? (
          <div className="aspect-w-16 aspect-h-9">
            <ReactPlayer
              url={videoUrl}
              width="100%"
              height="100%"
              controls
              playing
              config={{
                youtube: {
                  playerVars: { 
                    origin: window.location.origin,
                    rel: 0
                  }
                }
              }}
            />
          </div>
        ) : (
          <>
            <LazyImage 
              src={imageError ? fallbackImage : thumbnail} 
              alt={title} 
              className="w-full h-48 object-cover"
              onError={() => setImageError(true)}
            />
            {isVideo && (
              <button
                onClick={() => setShowVideo(true)}
                className="absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity hover:bg-black/40"
                aria-label={`Lire la vidéo: ${title}`}
              >
                <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center transition-transform hover:scale-110">
                  <Play className="w-8 h-8 text-primary ml-1" />
                </div>
              </button>
            )}
          </>
        )}
        <div className="absolute top-4 right-4 bg-primary text-white text-xs font-semibold px-2 py-1 rounded">
          {category}
        </div>
      </div>
      
      <div className="p-5">
        <time dateTime={date} className="text-sm text-gray-500">{date}</time>
        <h3 className="text-xl font-semibold mt-2 mb-3 text-gray-800">{title}</h3>
        <p className="text-gray-600 mb-4">{excerpt}</p>
        <Link 
          to={`/blog/${id}`}
          className="inline-flex items-center text-primary font-medium hover:underline"
        >
          {isVideo ? 'Regarder la vidéo' : 'Lire la suite'}
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </article>
  );
};

export default BlogPost;