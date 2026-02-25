"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-center"
      style={
        {
          "--normal-bg": "#FFFFFF",
          "--normal-text": "#0F172A",
          "--normal-border": "#E2E8F0",
          "--success-bg": "#F0FDF4",
          "--success-text": "#15803D",
          "--success-border": "#86EFAC",
          "--error-bg": "#FEF2F2",
          "--error-text": "#DC2626",
          "--error-border": "#FECACA",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "border-2 shadow-lg",
          title: "font-semibold text-sm",
          description: "text-sm",
          actionButton: "bg-blue-600 text-white hover:bg-blue-700",
          cancelButton: "bg-gray-100 text-gray-800 hover:bg-gray-200",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
