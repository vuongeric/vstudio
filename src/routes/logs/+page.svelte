<script>
  import ImageTile from '$lib/components/ImageTile.svelte';
  import PanoramicTile from '$lib/components/PanoramicTile.svelte';
  
  const portraitImages = [
    { id: 1, path: '/DSCF7478.jpg', title: '', alt: 'Portrait image 1' },
    { id: 2, path: '/DSCF7578.jpg', title: '', alt: 'Portrait image 2' },
    { id: 3, path: '/DSCF7619.jpg', title: '', alt: 'Portrait image 3' }
  ];
  
  const panoImage = { 
    id: 4, 
    path: '/DSCF6986-Pano.jpg', 
    title: '', 
    alt: 'Panoramic image' 
  };
</script>

<div class="gallery">
  <!-- Portrait Images -->
  <section class="mb-16">
    <div class="image-grid">
      {#each portraitImages as image}
        <ImageTile 
          imagePath={image.path}
          title=""
          altText=""
        />
      {/each}
    </div>
  </section>
  
  <!-- Panoramic Image -->
  <section class="mt-16">
    <div class="w-full">
      <PanoramicTile 
        imagePath={panoImage.path}
        title=""
        altText=""
      />
    </div>
  </section>
</div>

<style>
  .gallery {
    max-width: 1800px;
    margin: 0 auto;
    padding: 2rem 2rem 3rem; /* Increased padding */
  }

  .image-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 3rem; /* Increased gap between grid items */
    margin: 2rem 0; /* Added vertical margin */
  }

  @media (max-width: 1200px) {
    .image-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 768px) {
    .image-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
