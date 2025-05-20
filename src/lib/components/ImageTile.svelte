<script lang="ts">
  import Image from './Image.svelte';
  
  export let imagePath: string;
  export let title = '';
  export let altText = title || 'Image';
  export let className = '';
  export let aspectRatio: 'portrait' | 'landscape' = 'landscape';
  
  $: paddingBottom = aspectRatio === 'portrait' 
    ? 'calc(129.41% + 3rem)' // 8.5:11 with padding
    : 'calc(66.67% + 3rem)';  // 3:2 with padding
  
  // Ensure the image path is correctly formatted
  $: src = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
</script>

<div class="image-container" style="--padding-bottom: {paddingBottom};">
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
  .image-container {
    position: relative;
    width: 100%;
    padding: 1.5rem 0; /* Top and bottom padding */
    padding-bottom: var(--padding-bottom, calc(129.41% + 3rem));
    overflow: hidden;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    background: #f5f5f5;
  }

  .image-container:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  }

  .image-container:hover :global(.image) {
    transform: scale(1.02);
  }

  .image-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  
  .image-container :global(.image) {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  .image-container:hover :global(.image) {
    transform: scale(1.03);
  }

  .image-title {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
    color: white;
    padding: 1.5rem 1rem 0.75rem;
    font-size: 0.9rem;
    text-align: center;
    opacity: 0;
    transform: translateY(10px);
    transition: opacity 0.3s ease, transform 0.3s ease;
  }

  .image-container:hover .image-title {
    opacity: 1;
    transform: translateY(0);
  }
</style>
