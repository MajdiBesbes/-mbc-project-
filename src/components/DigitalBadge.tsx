import React from 'react';
import { Smartphone, Zap, Lock, Clock } from 'lucide-react';

interface DigitalBadgeProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const DigitalBadge: React.FC<DigitalBadgeProps> = ({ 
  className = '', 
  showText = true,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };
  
  const iconSize = {
    sm: 12,
    md: 16,
    lg: 20
  };

  return (
    <div className={`inline-flex items-center bg-primary/90 text-white rounded-full font-medium ${sizeClasses[size]} ${className}`}>
      <Smartphone size={iconSize[size]} className="mr-1" />
      {showText && <span>100% Digital</span>}
    </div>
  );
};

export const DigitalFeatureBadge: React.FC<{ 
  icon: 'speed' | 'security' | 'anytime';
  text: string;
  className?: string;
}> = ({ icon, text, className = '' }) => {
  const getIcon = () => {
    switch (icon) {
      case 'speed':
        return <Zap className="w-4 h-4 mr-1" />;
      case 'security':
        return <Lock className="w-4 h-4 mr-1" />;
      case 'anytime':
        return <Clock className="w-4 h-4 mr-1" />;
      default:
        return <Smartphone className="w-4 h-4 mr-1" />;
    }
  };

  return (
    <div className={`inline-flex items-center bg-gray-100 text-primary rounded-full px-3 py-1 text-sm font-medium ${className}`}>
      {getIcon()}
      <span>{text}</span>
    </div>
  );
};

export default DigitalBadge;