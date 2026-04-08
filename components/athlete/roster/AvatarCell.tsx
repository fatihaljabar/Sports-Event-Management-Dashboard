"use client";

import { ImageWithFallback } from "@/components/figma/ImageWithFallback";

export function AvatarCell({
  photo,
  initials,
  color,
  name,
}: {
  photo: string | null;
  initials: string;
  color: string;
  name: string;
}) {
  if (photo) {
    return (
      <ImageWithFallback
        src={photo}
        alt={name}
        className="w-9 h-9 rounded-full object-cover shrink-0"
        style={{ boxShadow: "0 0 0 2px #f3f4f6" }}
      />
    );
  }
  return (
    <div
      className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
      style={{
        backgroundColor: color + "22",
        color,
        boxShadow: "0 0 0 2px white",
      }}
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
