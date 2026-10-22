import Link from 'next/link';

type Props = {
  /** Size of the mark in px. */
  size?: number;
  className?: string;
};

/**
 * Signature mark: a minimal map pin whose lower half is a roofline,
 * sitting on a horizon line. Custom wordmark alongside.
 */
export function LogoMark({ size = 36, className = '' }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {/* Horizon */}
      <line
        x1="3"
        y1="30"
        x2="33"
        y2="30"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.35"
      />
      {/* Pin outline with roofline notch */}
      <path
        d="M18 4C12.2 4 7.5 8.7 7.5 14.5c0 7.2 8.3 13.4 10 14.6.3.2.7.2 1 0 1.7-1.2 10-7.4 10-14.6C28.5 8.7 23.8 4 18 4Z"
        fill="currentColor"
        opacity="0.14"
      />
      <path
        d="M18 4C12.2 4 7.5 8.7 7.5 14.5c0 7.2 8.3 13.4 10 14.6.3.2.7.2 1 0 1.7-1.2 10-7.4 10-14.6C28.5 8.7 23.8 4 18 4Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Roofline inside the pin */}
      <path
        d="M12.5 16.5 18 11l5.5 5.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Logo({
  size = 36,
  className = '',
  href = '/',
}: Props & { href?: string }) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-2.5 ${className}`}
      aria-label="Accueil InfosVilles"
    >
      <span className="text-primary transition-soft group-hover:scale-105">
        <LogoMark size={size} />
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-lg font-semibold tracking-tight text-foreground">
          Infos
          <span className="text-primary">Villes</span>
        </span>
        <span className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Cadre de vie
        </span>
      </span>
    </Link>
  );
}
