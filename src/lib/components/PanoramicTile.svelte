<script lang="ts">
  import Image from './Image.svelte';
  
  export let imagePath: string;
  export let title = '';
  export let altText = title || 'Panoramic image';
  export let className = '';
  
  // Ensure the image path is correctly formatted
  $: src = imagePath.startsWith('/') ? imagePath : imagePath.startsWith('images/') ? `/${imagePath}` : `images/${imagePath}`;
</script>

<div class="panoramic-container">
  <div class="image-wrapper">
    <Image 
      src={src}
      alt={altText}
      width="100%"
      height="100%"
      className={className}
      loading="lazy"
    />
    {#if title}
      <div class="image-title">
        {title}
      </div>
    {/if}
  </div>
</div>

<style>
  .panoramic-container {
    position: relative;
    width: 100%;
    padding: 2rem 0; /* Top and bottom padding */
    padding-bottom: calc(43.14% + 4rem); /* Maintain aspect ratio with padding */
    overflow: hidden;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    background: #f5f5f5;
  }

  .image-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  
  .panoramic-container :global(.image) {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  .panoramic-container:hover :global(.image) {
    transform: scale(1.01);
  }

  .image-title {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 1rem;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
    color: white;
    font-size: 1rem;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .panoramic-container:hover .image-title {
    opacity: 1;
  }
</style>
