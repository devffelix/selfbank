import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  classNameSvg?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', className = '', classNameSvg = '' }) => {
  const sizes = {
    sm: "w-6 h-6 p-1",
    md: "w-10 h-10 p-2",
    lg: "w-16 h-16 p-3",
    xl: "w-32 h-32 p-6"
  };

  return (
    <div className={`relative flex items-center justify-center bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl text-white shadow-emerald-500/20 shadow-lg ${sizes[size]} ${className}`}>
        <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className={`w-full h-full ${classNameSvg}`}
        >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
    </div>
  );
};

export const LogoPath = "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5";