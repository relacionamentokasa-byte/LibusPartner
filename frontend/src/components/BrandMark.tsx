import React from 'react';

interface BrandMarkProps {
  variant?: 'sidebar' | 'header' | 'document' | 'monogram';
  contrast?: 'light' | 'dark';
  className?: string;
}

const variantStyles = {
  sidebar: {
    frame: 'px-3 py-2.5 rounded-2xl',
    image: 'h-14 w-auto',
  },
  header: {
    frame: 'px-2 py-1 rounded-xl',
    image: 'h-9 w-auto',
  },
  document: {
    frame: 'px-3 py-2 rounded-xl',
    image: 'h-16 w-auto',
  },
};

export const BrandMark: React.FC<BrandMarkProps> = ({
  variant = 'header',
  contrast = 'dark',
  className = '',
}) => {
  if (variant === 'monogram') {
    return (
      <span
        aria-label="Alves Planejados"
        className={`inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#C5A265] bg-[#1B1410] font-sans text-[11px] font-extrabold tracking-tight text-[#C5A265] shadow-sm ${className}`}
      >
        AP
      </span>
    );
  }

  const styles = variantStyles[variant];
  const frameClass = contrast === 'light'
    ? 'bg-white shadow-sm'
    : 'bg-[#F7F3EE] shadow-inner';

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center ${styles.frame} ${frameClass} ${className}`}
    >
      <img
        src="/alves_logo.png"
        alt="Alves Planejados"
        className={`${styles.image} object-contain`}
      />
    </span>
  );
};
