import React, { useState } from 'react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackTitle?: string;
}

export function SafeImage({
  src,
  alt,
  className = '',
  fallbackTitle,
  ...rest
}: SafeImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-[#FFFFFF] text-[#777777] border border-[#EAEAEA] p-4 text-center ${className}`}
        role="img"
        aria-label={alt || fallbackTitle || 'QASIDA couture image'}
      >
        <span className="font-serif text-lg tracking-widest uppercase text-[#242424]">
          QASIDA
        </span>
        {fallbackTitle && (
          <span className="mt-1 text-xs text-[#777777] max-w-[180px] truncate">
            {fallbackTitle}
          </span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
      {...rest}
    />
  );
}
