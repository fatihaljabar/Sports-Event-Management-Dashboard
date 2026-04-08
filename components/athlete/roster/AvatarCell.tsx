import { ImageWithFallback } from "@/components/figma/ImageWithFallback";

interface AvatarCellProps {
  photo: string | null;
  initials: string;
  color: string;
  name: string;
}

export function AvatarCell({ photo, initials, color, name }: AvatarCellProps) {
  if (photo) {
    return (
      <ImageWithFallback
        src={photo}
        alt={name}
        className="w-9 h-9 rounded-full object-cover shrink-0"
        style={{}}
      />
    );
  }
  return (
    <div
      className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
      style={{ backgroundColor: color + "22", color }}
    >
      <span
        style={{
          fontSize: "12px",
          fontWeight: 700,
          fontFamily: "Inter, sans-serif",
        }}
      >
        {initials}
      </span>
    </div>
  );
}
