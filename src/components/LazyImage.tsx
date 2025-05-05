import React, { useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

const LazyImage: React.FC<LazyImageProps> = ({ src, alt, className, width, height }) => {
  const [error, setError] = useState(false);
  const fallbackSrc = "https://via.placeholder.com/800x600?text=Image+non+disponible";
  
  return (
    <LazyLoadImage
      src={error ? fallbackSrc : src}
      alt={alt}
      effect="blur"
      className={className}
      wrapperClassName="w-full h-full"
      width={width}
      height={height}
      onError={() => setError(true)}
      threshold={200}
      placeholderSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='none' d='M0 0h24v24H0z'/%3E%3Cpath d='M4.828 21l-.02.02-.021-.02H2.992A.993.993 0 0 1 2 20.007V3.993A1 1 0 0 1 2.992 3h18.016c.548 0 .992.445.992.993v16.014a1 1 0 0 1-.992.993H4.828zM20 15V5H4v14L14 9l6 6zm0 2.828l-6-6L6.828 19H20v-1.172zM8 11a2 2 0 1 1 0-4 2 2 0 0 1 0 4z' fill='rgba(0,0,0,0.2)'/%3E%3C/svg%3E"
    />
  );
};

export default LazyImage;