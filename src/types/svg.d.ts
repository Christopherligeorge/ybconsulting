declare module '*.svg' {
  import React from 'react';
  const SVG: React.FC<React.SVGProps<SVGSVGElement> & { className?: string }>;
  export default SVG;
}

declare module '@/public/svgs/*.svg' {
  import React from 'react';
  const SVG: React.FC<React.SVGProps<SVGSVGElement> & { className?: string }>;
  export default SVG;
} 