import React from "react";

export interface SimpleGlassSurfaceProps {
  children?: React.ReactNode;
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  blur?: number;
  backgroundOpacity?: number;
  saturation?: number;
  className?: string;
  style?: React.CSSProperties;
}

const SimpleGlassSurface: React.FC<SimpleGlassSurfaceProps> = ({
  children,
  width = 200,
  height = 80,
  borderRadius = 20,
  blur = 15,
  backgroundOpacity = 0.2,
  saturation = 1.2,
  className = "",
  style = {},
}) => {
  const containerStyles: React.CSSProperties = {
    ...style,
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
    borderRadius: `${borderRadius}px`,
    background: `rgba(0, 0, 0, ${backgroundOpacity})`,
    backdropFilter: `blur(${blur}px) saturate(${saturation})`,
    WebkitBackdropFilter: `blur(${blur}px) saturate(${saturation})`,
    border: "1px solid rgba(255, 255, 255, 0.2)",
    boxShadow: `
      0 8px 32px rgba(0, 0, 0, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.2),
      inset 0 -1px 0 rgba(255, 255, 255, 0.1)
    `,
  };

  return (
    <div className={`relative ${className}`} style={containerStyles}>
      <div className="w-full h-full flex items-center justify-center p-2 rounded-[inherit] relative z-10">
        {children}
      </div>
    </div>
  );
};

export default SimpleGlassSurface;
