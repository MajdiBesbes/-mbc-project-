import React from 'react';
import '../styles/card.css';

interface CardProps {
  title?: string;
  subtitle?: string;
  image?: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined';
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  image,
  children,
  className = '',
  variant = 'default',
  onClick
}) => {
  return (
    <div 
      className={`card card-${variant} ${onClick ? 'card-clickable' : ''} ${className}`}
      onClick={onClick}
    >
      {image && (
        <div className="card-image">
          <img 
            src={image.src} 
            alt={image.alt}
            width={image.width}
            height={image.height}
            loading="lazy"
          />
        </div>
      )}
      <div className="card-content">
        {title && <h3 className="card-title">{title}</h3>}
        {subtitle && <p className="card-subtitle">{subtitle}</p>}
        <div className="card-body">{children}</div>
      </div>
    </div>
  );
};

export default Card; 