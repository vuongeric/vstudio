<script>
  export let imagePath;
  export let title = '';
  export let altText = title || 'Image';
</script>

<div class="image-container">
  <img 
    src={imagePath} 
    alt={altText} 
    loading="lazy"
  />
  {#if title}
    <div class="image-title">
      {title}
    </div>
  {/if}
</div>

<style>
  .image-container {
    position: relative;
    width: 100%;
    padding-bottom: 66.67%; /* 3:2 aspect ratio */
    overflow: hidden;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    background: #f5f5f5;
  }

  .image-container:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  }

  .image-container img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  .image-container:hover img {
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
