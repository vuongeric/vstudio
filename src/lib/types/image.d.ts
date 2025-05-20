// Type definitions for optimized image handling
declare module '*.webp' {
  const value: string;
  export default value;
}

declare module '*.avif' {
  const value: string;
  export default value;
}

declare module '*.jpg' {
  const value: string;
  export default value;
}

declare module '*.jpeg' {
  const value: string;
  export default value;
}

declare module '*.png' {
  const value: string;
  export default value;
}

declare module '*.svg' {
  const value: string;
  export default value;
}

interface OptimizedImage {
  src: string;
  srcSet: string;
  webpSrcSet?: string;
  avifSrcSet?: string;
  isSvg: boolean;
  width?: number;
  height?: number;
}

type ImageFormat = 'webp' | 'avif' | 'jpg' | 'jpeg' | 'png' | 'svg';

type ImageSize = {
  size: string;
  width: number;
};
