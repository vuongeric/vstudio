<script>
  import ImageTile from '$lib/components/ImageTile.svelte';
  import { images } from '$lib/data/images.ts';
</script>

<div class="gallery">
  <div class="image-grid">
    {#each images as image}
      <ImageTile 
        imagePath={image.path}
        title={image.title}
        altText={image.alt}
      />
    {/each}
  </div>
</div>

<style>
  .gallery {
    max-width: 1800px;
    margin: 0 auto;
    padding: 1rem 1rem 2rem;
  }

  .image-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
    gap: 1.5rem;
    margin-top: 1rem;
  }

  @media (max-width: 768px) {
    .image-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
    
    h1 {
      font-size: 2rem;
    }
    
    .subtitle {
      font-size: 1.1rem;
    }
  }

  @media (min-width: 1200px) {
    .image-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style>
