<div class="about-container">
  <div class="content-wrapper">
    <!-- Left Column - Text -->
    <div class="text-column">
      <div class="text-content">
        <p>exploring cinematography and photography through the lens of japan</p>
      </div>
    </div>
    
    <!-- Right Column - Image -->
    <div class="image-column">
      <img 
        src="/IMG_1925.jpg" 
        alt="Eric Vuong" 
        class="profile-image"
      />
    </div>
  </div>
</div>

<style>
  .about-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    background-color: #f8f8f8;
  }

  .content-wrapper {
    display: flex;
    max-width: 1200px;
    width: 100%;
    gap: 4rem;
    align-items: center;
  }

  .text-column {
    flex: 1;
  }

  .text-content {
    font-family: 'Courier New', Courier, monospace;
    line-height: 1.8;
    color: #444;
    white-space: pre-line;
  }

  .text-content p {
    margin-bottom: 1rem;
  }

  .image-column {
    flex: 1;
    display: flex;
    justify-content: center;
  }

  .profile-image {
    width: 100%;
    max-width: 400px;
    height: auto;
    aspect-ratio: 8.5 / 11;
    object-fit: cover;
    border-radius: 4px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  /* Responsive design */
  @media (max-width: 768px) {
    .content-wrapper {
      flex-direction: column-reverse;
      gap: 2rem;
    }
    
    .text-column, .image-column {
      width: 100%;
    }
    
    .image-placeholder {
      max-width: 100%;
    }
  }
</style>
