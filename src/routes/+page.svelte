<script lang="ts">
  import ImageTile from '$lib/components/ImageTile.svelte';
  import PanoramicTile from '$lib/components/PanoramicTile.svelte';
  import { base } from '$app/paths';
  import { onMount } from 'svelte';

  let videoWrapper: HTMLDivElement;
  let videoIframe: HTMLIFrameElement;
  let hasPlayed = false;

  function playVideo() {
    if (hasPlayed || !videoIframe) return;

    hasPlayed = true;

    // Update the iframe src to enable autoplay
    const currentSrc = videoIframe.src;
    if (!currentSrc.includes('autoplay=1')) {
      const newSrc = currentSrc.includes('?')
        ? currentSrc + '&autoplay=1'
        : currentSrc + '?autoplay=1';
      videoIframe.src = newSrc;
    }
  }

  onMount(() => {
    if (!videoWrapper || !videoIframe) return;

    const crop = 150; // 150px total crop (75px top + 75px bottom)
    const halfCrop = crop / 2;

    // Update wrapper
    videoWrapper.style.paddingBottom = `calc(56.25% - ${crop}px)`;
    videoWrapper.style.margin = `${halfCrop}px 0`;

    // Update iframe
    videoIframe.style.top = `-${halfCrop}px`;
    videoIframe.style.height = `calc(100% + ${crop}px)`;

    // Option A: Play on any pointer interaction
    const pointerHandler = () => playVideo();
    document.addEventListener('mousemove', pointerHandler);
    document.addEventListener('click', pointerHandler);
    document.addEventListener('touchstart', pointerHandler);

    // Option B: Play when video enters viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            playVideo();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(videoWrapper);

    return () => {
      document.removeEventListener('mousemove', pointerHandler);
      document.removeEventListener('click', pointerHandler);
      document.removeEventListener('touchstart', pointerHandler);
      observer.disconnect();
    };
  });

  const portraitImages = [
    { id: 1, path: `${base}/images/DSCF7478.webp`, title: '', alt: 'Portrait image 1' },
    { id: 2, path: `${base}/images/DSCF7578.webp`, title: '', alt: 'Portrait image 2' },
    { id: 3, path: `${base}/images/DSCF7619.webp`, title: '', alt: 'Portrait image 3' }
  ];

  const panoImage = {
    id: 4,
    path: `${base}/images/DSCF6986-Pano.webp`,
    title: '',
    alt: 'Panoramic image'
  };
</script>

<div class="gallery">
  <!-- YouTube Video -->
  <section class="video-container mb-16">
    <div class="video-wrapper" bind:this={videoWrapper}>
      <iframe
        bind:this={videoIframe}
        src="https://www.youtube.com/embed/0YwiDPpI7k8?controls=0&disablekb=1&fs=0&loop=1&modestbranding=1&rel=0&showinfo=0"
        title="Sounds of Japan | 4K Cinematic Travel Video"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen>
      </iframe>
    </div>
  </section>

  <!-- Portrait Images -->
  <section class="mb-16">
    <div class="image-grid">
      {#each portraitImages as image}
        <ImageTile
          imagePath={image.path}
          aspectRatio="portrait"
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
    padding: 2rem 2rem 3rem;
  }

  .video-container {
    width: 100%;
    margin-bottom: 4rem;
  }

  .video-wrapper {
    position: relative;
    padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
    height: 0;
    overflow: hidden;
    max-width: 100%;
    background: #000;
    border-radius: 12px;
    margin: 0;
    transition: all 0.3s ease;
  }

  .video-wrapper iframe {
    position: absolute;
    top: -50px; /* Crop 100px from top (50px from top and bottom) */
    left: 0;
    width: 100%;
    height: calc(100% + 100px); /* Extend height to compensate for crop */
    border: none;
    border-radius: 12px;
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
