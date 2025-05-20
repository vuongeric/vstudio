/// <reference types="@sveltejs/kit" />

// This file contains global type declarations for Svelte components
declare namespace svelte.JSX {
  interface HTMLAttributes<T> {
    [key: string]: any;
  }
  
  interface SVGProps<T> {
    [key: string]: any;
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
