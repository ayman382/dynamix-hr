import { useId, type AnchorHTMLAttributes, type CSSProperties, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface BlobCTAButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
  icon?: ReactNode;
  size?: 'header' | 'section';
}

export default function BlobCTAButton({
  children,
  className,
  icon,
  size = 'header',
  ...anchorProps
}: BlobCTAButtonProps) {
  const filterId = useId().replace(/:/g, '');

  return (
    <a
      {...anchorProps}
      className={cn(
        'blob-cta',
        size === 'header' ? 'blob-cta--header' : 'blob-cta--section',
        className,
      )}
    >
      <span className="blob-cta__label">
        {icon}
        <span>{children}</span>
      </span>

      <span className="blob-cta__inner" aria-hidden="true">
        <span className="blob-cta__blobs" style={{ filter: `url(#${filterId})` }}>
          {[0, 1, 2, 3].map((blobIndex) => (
            <span
              key={blobIndex}
              className="blob-cta__blob"
              style={{ ['--blob-index' as string]: blobIndex } as CSSProperties}
            />
          ))}
        </span>
      </span>

      <svg
        className="blob-cta__filter"
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <filter id={filterId}>
            <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="10" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 21 -7"
              result="goo"
            />
            <feBlend in2="goo" in="SourceGraphic" result="mix" />
          </filter>
        </defs>
      </svg>
    </a>
  );
}
