import { ICONS } from '@/lib/icons';

/** A Softstroke icon as inline SVG (decorative). */
export default function Icon({ name, size = 22, stroke = 1.5 }: { name: string; size?: number; stroke?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" dangerouslySetInnerHTML={{ __html: ICONS[name] ?? '' }} />
  );
}
