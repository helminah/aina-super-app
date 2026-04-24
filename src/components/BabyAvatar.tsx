import type { ChildProfile } from '@/types/child';

/**
 * BabyAvatar — affiche la photo de l'enfant si disponible, sinon emoji fallback
 * (boy 👦 / girl 👧). Utilisé dans Dashboard hero, Profile, switcher bébés.
 *
 * Sizes en rem : 40 / 56 / 80 / 96 pixels (xs/sm/md/lg).
 */
interface Props {
  baby: Pick<ChildProfile, 'sex' | 'photoDataUrl' | 'name'>;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  ring?: boolean;
  className?: string;
}

const SIZE_CLASS: Record<NonNullable<Props['size']>, string> = {
  xs: 'w-10 h-10 text-lg',
  sm: 'w-14 h-14 text-2xl',
  md: 'w-20 h-20 text-4xl',
  lg: 'w-24 h-24 text-5xl',
};

export function BabyAvatar({ baby, size = 'sm', ring, className = '' }: Props) {
  const cls = SIZE_CLASS[size];
  const ringCls = ring ? 'ring-2 ring-white/60 ring-offset-2 ring-offset-transparent' : '';

  if (baby.photoDataUrl) {
    return (
      <img
        src={baby.photoDataUrl}
        alt={baby.name}
        className={`${cls} rounded-full object-cover ${ringCls} ${className}`}
      />
    );
  }

  return (
    <div
      className={`${cls} rounded-full bg-white/25 backdrop-blur flex items-center justify-center ${ringCls} ${className}`}
      aria-label={baby.name}
    >
      <span>{baby.sex === 'boy' ? '👦' : '👧'}</span>
    </div>
  );
}
