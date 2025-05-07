import React from 'react';
import '../styles/loader.css';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({
  size = 'medium',
  color = 'var(--primary-color)',
  className = ''
}) => {
  return (
    <div 
      className={`loader loader-${size} ${className}`}
      style={{ '--loader-color': color } as React.CSSProperties}
    >
      <div className="loader-spinner">
        <div className="loader-circle"></div>
        <div className="loader-circle"></div>
        <div className="loader-circle"></div>
      </div>
    </div>
  );
};

export default React.memo(Loader); 