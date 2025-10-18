import React from "react";

export interface SimpleGlassSurfaceProps {
  children?: React.ReactNode;
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  className?: string;
  style?: React.CSSProperties;
}

const SimpleGlassSurface: React.FC<SimpleGlassSurfaceProps> = ({
  children,
  width = 200,
  height = 80,
  borderRadius = 20,
  className = "",
  style = {},
}) => {
  const containerStyles: React.CSSProperties = {
    ...style,
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
    borderRadius: `${borderRadius}px`,
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(12px) saturate(1.8) brightness(1.2)",
    WebkitBackdropFilter: "blur(12px) saturate(1.8) brightness(1.2)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    boxShadow: `
      inset 0 1px 0 0 rgba(255, 255, 255, 0.2),
      inset 0 -1px 0 0 rgba(255, 255, 255, 0.1),
      0 8px 32px 0 rgba(31, 38, 135, 0.2),
      0 2px 16px 0 rgba(31, 38, 135, 0.1)
    `,
  };

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden transition-opacity duration-300 ease-out ${className}`}
      style={containerStyles}
    >
      <div className="w-full h-full flex items-center justify-center p-2 rounded-[inherit] relative z-10">
        {children}
      </div>
    </div>
  );
};

export default SimpleGlassSurface;