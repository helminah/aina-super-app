/**
 * AinaLogo — le PNG a un canal alpha transparent (préprocessé), donc plus
 * besoin de canvas/clip. Simple <img>, rendu net et léger.
 */
export function AinaLogo({
  size = 96,
  className = '',
  style = {},
}: {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <img
      src="/aina-logo.png"
      alt="AINA"
      width={size}
      height={size}
      style={{ width: size, height: size, display: 'block', ...style }}
      className={className}
      draggable={false}
    />
  );
}
