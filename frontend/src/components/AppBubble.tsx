interface Props {
  initial: string;
  color: string;
  bg: string;
  size?: number;
  radius?: number;
  fontSize?: number;
  overlap?: boolean;
}

export function AppBubble({ initial, color, bg, size = 22, radius = 6, fontSize = 10, overlap = false }: Props) {
  return (
    <div
      className="flex items-center justify-center font-extrabold shrink-0"
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: bg,
        color,
        fontSize,
        marginLeft: overlap ? -6 : 0,
        border: overlap ? '2px solid #fff' : undefined,
      }}
    >
      {initial}
    </div>
  );
}
