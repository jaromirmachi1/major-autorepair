import React, { useState, useEffect } from "react";

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
  const [supportsBackdropFilter, setSupportsBackdropFilter] = useState(true);

  useEffect(() => {
    // Check if backdrop-filter is supported
    if (typeof window !== "undefined") {
      const testElement = document.createElement("div");
      testElement.style.backdropFilter = "blur(10px)";
      const supported = testElement.style.backdropFilter !== "";
      setSupportsBackdropFilter(supported);
    }
  }, []);
  const containerStyles: React.CSSProperties = {
    ...style,
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
    borderRadius: `${borderRadius}px`,
    background: "rgba(255, 255, 255, 0.15)",
    backdropFilter: "blur(16px) saturate(2) brightness(1.1)",
    WebkitBackdropFilter: "blur(16px) saturate(2) brightness(1.1)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    boxShadow: `
      inset 0 1px 0 0 rgba(255, 255, 255, 0.4),
      inset 0 -1px 0 0 rgba(255, 255, 255, 0.2),
      0 8px 32px 0 rgba(0, 0, 0, 0.3),
      0 2px 16px 0 rgba(0, 0, 0, 0.2),
      0 0 0 1px rgba(255, 255, 255, 0.1)
    `,
    position: "relative",
  };

  // Fallback for browsers that don't support backdrop-filter
  const fallbackStyles: React.CSSProperties = {
    ...containerStyles,
    background: "rgba(255, 255, 255, 0.25)",
    backdropFilter: "none",
    WebkitBackdropFilter: "none",
    border: "1px solid rgba(255, 255, 255, 0.4)",
    boxShadow: `
      inset 0 1px 0 0 rgba(255, 255, 255, 0.5),
      inset 0 -1px 0 0 rgba(255, 255, 255, 0.3),
      0 8px 32px 0 rgba(0, 0, 0, 0.4),
      0 2px 16px 0 rgba(0, 0, 0, 0.3)
    `,
  };

  const finalStyles = supportsBackdropFilter ? containerStyles : fallbackStyles;

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden transition-opacity duration-300 ease-out ${className}`}
      style={finalStyles}
    >
      {/* Glass reflection overlay */}
      <div 
        className="absolute inset-0 rounded-[inherit] pointer-events-none"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.1) 100%)",
          borderRadius: "inherit"
        }}
      />
      <div className="w-full h-full flex items-center justify-center p-2 rounded-[inherit] relative z-10">
        {children}
      </div>
    </div>
  );
};

export default SimpleGlassSurface;