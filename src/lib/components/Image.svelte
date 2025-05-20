<script lang="ts">
  export let src: string;
  export let alt: string = '';
  export let width: string = '100%';
  export let height: string = 'auto';
  export let className: string = '';
  export let loading: 'eager' | 'lazy' = 'lazy';
  
  // Ensure the path is correctly formatted
  $: normalizedSrc = src.startsWith('/') ? src : `/${src}`;
  
  // Handle image loading state
  let isLoaded = false;
  
  function onImageLoad() {
    isLoaded = true;
  }
</script>

<div class="image-container" class:loaded={isLoaded} style="width: {width}; height: {height};">
  <img
    src={normalizedSrc}
    alt={alt}
    loading={loading}
    on:load={onImageLoad}
    class={className}
  />
  
  {#if !isLoaded}
    <div class="image-placeholder"></div>
  {/if}
</div>

<style>
  .image-container {
    position: relative;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
  
  .image-container img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .image-container.loaded img {
    opacity: 1;
  }
  
  .image-placeholder {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #f0f0f0;
    z-index: -1;
  }
</style>
