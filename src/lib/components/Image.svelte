<script lang="ts">
  import { onMount } from 'svelte';

  export let src: string;
  export let alt: string = '';
  export let width: string = '100%';
  export let height: string = 'auto';
  export let className: string = '';
  export let loading: 'eager' | 'lazy' = 'lazy';
  export let decoding: 'sync' | 'async' | 'auto' = 'async';
  export let sizes: string = '(max-width: 768px) 100vw, 768px';

  // Remove any size suffix from the filename (e.g., -sm, -md, -lg, -xl, -2xl)
  $: basePath = src.replace(/(-sm|-md|-lg|-xl|-2xl)?\.(jpg|jpeg|png|webp|avif)$/i, '');
  $: extension = src.split('.').pop()?.toLowerCase() || 'webp';
  
  // Generate srcset for responsive images
  $: srcset = [
    `${basePath}-sm.${extension} 480w`,
    `${basePath}-md.${extension} 768w`,
    `${basePath}-lg.${extension} 1024w`,
    `${basePath}-xl.${extension} 1280w`,
    `${basePath}-2xl.${extension} 1536w`
  ].join(', ');
  
  // Handle image loading state
  let isLoaded = false;
  let imageEl: HTMLImageElement;

  function onImageLoad() {
    isLoaded = true;
  }

  // Handle cached images that may not fire load event
  function checkImageComplete() {
    if (imageEl?.complete) {
      isLoaded = true;
    }
  }

  // Check on mount in case image is already cached
  onMount(() => {
    checkImageComplete();
  });
</script>

<div class="image-container" class:loaded={isLoaded} style="width: {width}; height: {height};">
  <img
    bind:this={imageEl}
    src={src}
    srcset={srcset}
    sizes={sizes}
    alt={alt}
    loading={loading}
    decoding={decoding}
    on:load={onImageLoad}
    on:loadstart={checkImageComplete}
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
