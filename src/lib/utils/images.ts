/**
 * Get the optimized image URL
 * @param path - Path to the original image (e.g., '/images/photo.jpg')
 * @returns Object containing src and srcSet for the image
 */
export function getOptimizedImage(path: string) {
  // Extract filename and extension
  const parts = path.split('/');
  const fileNameWithExt = parts.pop() || '';
  const basePath = parts.join('/');
  const [fileName, ext] = fileNameWithExt.split('.');
  
  // Skip processing for SVGs
  if (ext?.toLowerCase() === 'svg') {
    return {
      src: path,
      srcSet: '',
      isSvg: true
    };
  }
  
  // Define sizes for responsive images
  const sizes = [
    { size: 'sm', width: 640 },
    { size: 'md', width: 768 },
    { size: 'lg', width: 1024 },
    { size: 'xl', width: 1280 },
    { size: '2xl', width: 1920 },
  ];
  
  // Generate srcSet for different formats
  const formats = ['webp', 'avif'];
  const srcSet: Record<string, string> = {};
  
  formats.forEach(format => {
    srcSet[format] = sizes
      .map(({ size, width }) => {
        const imgPath = `${basePath}/${fileName}-${size}.${format}`;
        return `${imgPath} ${width}w`;
      })
      .concat(`${basePath}/${fileName}.${format} 1x`)
      .join(', ');
  });
  
  // Original format srcSet
  const originalSrcSet = sizes
    .map(({ size, width }) => {
      const imgPath = `${basePath}/${fileName}-${size}.${ext}`;
      return `${imgPath} ${width}w`;
    })
    .concat(`${path} 1x`)
    .join(', ');
  
  return {
    src: path,
    srcSet: originalSrcSet,
    webpSrcSet: srcSet.webp,
    avifSrcSet: srcSet.avif,
    isSvg: false
  };
}

/**
 * Preload an image to improve loading performance
 * @param src - Image source URL
 */
export function preloadImage(src: string): void {
  if (typeof document === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = src;
  
  // Add to document head
  document.head.appendChild(link);
}

/**
 * Get image dimensions
 * @param src - Image source URL
 * @returns Promise with image dimensions
 */
export function getImageDimensions(src: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    if (typeof Image === 'undefined') {
      resolve({ width: 0, height: 0 });
      return;
    }
    
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = reject;
    img.src = src;
  });
}
