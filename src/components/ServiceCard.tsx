import React from 'react';
import { useTracking } from '../hooks/useTracking';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import LazyImage from './LazyImage';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  id: string;
  illustration?: string;
  isDigital?: boolean;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ 
  title, 
  description, 
  icon, 
  id, 
  illustration,
  isDigital = true 
}) => {
  const { trackClick } = useTracking();
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.2 });

  const handleClick = () => {
    trackClick(`service_card_${id}`);
  };

  return (
    <div 
      ref={ref as React.RefObject<HTMLDivElement>}
      id={id}
      onClick={handleClick}
      className={`
        group relative overflow-hidden rounded-lg transition-all duration-500
        hover:shadow-xl cursor-pointer
        transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
      `}
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        {illustration && (
          <div className="w-full h-full">
            <LazyImage 
              src={illustration} 
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20 transition-opacity duration-500 group-hover:opacity-90" />
      </div>
      
      {isDigital && (
        <div className="absolute top-4 right-4 bg-primary/90 text-white px-3 py-1 rounded-full text-sm font-medium z-20">
          100% Digital
        </div>
      )}
      
      {/* Content */}
      <div className="relative z-10 p-8 min-h-[320px] flex flex-col justify-end text-white">
        <div className="mb-6 transform transition-all duration-500 group-hover:scale-110 group-hover:translate-y-[-10px]">
          {icon}
        </div>
        <h3 className="text-2xl font-bold mb-4 transform transition-all duration-500 group-hover:translate-y-[-10px]">
          {title}
        </h3>
        <p className="text-gray-200 transform transition-all duration-500 group-hover:translate-y-[-10px] opacity-90 group-hover:opacity-100">
          {description}
        </p>

        {/* Hover Effect Overlay */}
        <div className="absolute inset-0 bg-primary/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>
    </div>
  );
};

export default ServiceCard;