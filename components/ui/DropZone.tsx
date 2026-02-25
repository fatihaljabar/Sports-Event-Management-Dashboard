import { useState, useRef, useCallback } from "react";
import { CheckCircle2 } from "lucide-react";

export interface UploadedFile {
  name: string;
  size: string;
  preview: string | null;
}

interface DropZoneProps {
  label: string;
  sublabel: string;
  icon: React.ReactNode;
  uploaded: UploadedFile | null;
  onUpload: (file: UploadedFile) => void;
  accentColor?: string;
}

// Helper to read file as base64
function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function DropZone({
  label,
  sublabel,
  icon,
  uploaded,
  onUpload,
  accentColor = "#2563EB",
}: DropZoneProps) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(
    async (file: File) => {
      // Validate file extension
      const ext = file.name.split(".").pop()?.toLowerCase() || "";
      const allowedExts = ["png", "jpg", "jpeg", "webp"];
      if (!allowedExts.includes(ext)) {
        alert(`Invalid file type: ${ext}\n\nPlease use: PNG, JPG, JPEG, or WEBP\nSVG is not supported.`);
        return;
      }

      try {
        const base64 = await readFileAsBase64(file);
        onUpload({
          name: file.name,
          size: `${(file.size / 1024).toFixed(0)} KB`,
          preview: base64,
        });
      } catch (error) {
        console.error("Error reading file:", error);
        // Fallback to null if reading fails
        onUpload({
          name: file.name,
          size: `${(file.size / 1024).toFixed(0)} KB`,
          preview: null,
        });
      }
    },
    [onUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) {
        processFile(file);
      }
    },
    [processFile]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className="relative rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-all"
      style={{
        border: dragging
          ? `2px dashed ${accentColor}`
          : uploaded
          ? `2px solid ${accentColor}30`
          : "2px dashed #CBD5E1",
        backgroundColor: dragging
          ? `${accentColor}06`
          : uploaded
          ? `${accentColor}04`
          : "#FAFBFC",
        minHeight: "110px",
        padding: "16px 12px",
        transition: "all 0.15s",
        boxShadow: dragging ? `0 0 0 3px ${accentColor}12` : "none",
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={handleChange}
      />

      {uploaded ? (
        <div className="flex flex-col items-center gap-1.5 w-full">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              backgroundColor: `${accentColor}12`,
              border: `1.5px solid ${accentColor}25`,
            }}
          >
            <CheckCircle2
              className="w-5 h-5"
              strokeWidth={2}
              style={{ color: accentColor }}
            />
          </div>
          <p
            style={{
              color: "#1E293B",
              fontSize: "0.75rem",
              fontWeight: 600,
              fontFamily: '"Inter", sans-serif',
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "100%",
            }}
          >
            {uploaded.name}
          </p>
          <p
            style={{
              color: "#94A3B8",
              fontSize: "0.65rem",
              fontFamily: '"Inter", sans-serif',
            }}
          >
            {uploaded.size} · Click to replace
          </p>
          <div
            className="rounded-full px-2 py-0.5 mt-0.5"
            style={{
              backgroundColor: `${accentColor}12`,
              color: accentColor,
              fontSize: "0.7rem",
              fontWeight: 500,
            }}
          >
            Uploaded
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{
              backgroundColor: `${accentColor}08`,
              color: accentColor,
            }}
          >
            {icon}
          </div>
          <div>
            <p
              style={{
                color: "#1E293B",
                fontSize: "0.8rem",
                fontWeight: 600,
                fontFamily: '"Inter", sans-serif',
              }}
            >
              {label}
            </p>
            <p
              style={{
                color: "#94A3B8",
                fontSize: "0.7rem",
                fontFamily: '"Inter", sans-serif',
                marginTop: "2px",
              }}
            >
              {sublabel}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
