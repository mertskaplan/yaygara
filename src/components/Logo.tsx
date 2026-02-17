import React from 'react';
interface LogoProps {
  className?: string;
}
export const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <img
      src="/yaygara.svg"
      alt="Yaygara Logo"
      className={className}
      fetchpriority="high"
      decoding="async"
    />
  );
};