/// <reference types="@sveltejs/kit" />

// This file contains global type declarations for your project

declare namespace svelteHTML {
  interface HTMLAttributes<T> {
    [key: string]: any;
  }
  
  interface SVGAttributes<T> {
    [key: string]: any;
  }
  
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

// This allows TypeScript to understand our image imports
declare module '*.webp' {
  const value: string;
  export default value;
}

declare module '*.avif' {
  const value: string;
  export default value;
}

declare module '*.png' {
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

declare module '*.svg' {
  const value: string;
  export default value;
}
