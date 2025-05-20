<script>
  const kitItems = [
    {
      name: 'camera',
      model: 'fujifilm x100vi',
      description: 'pocket-size  travel photography and videography with ibis',
      image: '/camera-placeholder.jpg'
    },
    {
      name: 'camera',
      model: 'sony a7sii',
      description: 'professional videography, corporate events, ads',
      image: '/camera2-placeholder.jpg'
    },
    {
      name: 'editing',
      model: 'davinci resolve',
      description: 'heavy color grading',
      image: '/davinci-placeholder.jpg'
    },
    {
      name: 'editing',
      model: 'adobe lightroom',
      description: 'light post processing',
      image: '/lightroom-placeholder.jpg'
    }
  ];
</script>

<div class="kit">
  {#each kitItems as item, i}
    <div class="kit-item {i % 2 === 1 ? 'reverse' : ''}">
      <div class="kit-image">
        <div class="placeholder">
          <span>{item.name}</span>
        </div>
      </div>
      <div class="kit-text">
        <div class="name">{item.name} {item.model}</div>
        <div class="description">{item.description}</div>
      </div>
    </div>
  {/each}
</div>

<style>
  .kit {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }

  .kit-item {
    display: flex;
    margin-bottom: 3rem;
    gap: 2rem;
    align-items: center;
  }

  .kit-item.reverse {
    flex-direction: row-reverse;
  }

  .kit-image {
    width: 40%;
  }

  .placeholder {
    width: 100%;
    padding-top: 66.67%; /* 3:2 aspect ratio */
    background: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #888;
    font-family: 'Courier New', Courier, monospace;
    font-size: 0.9rem;
  }

  .kit-text {
    width: 60%;
    font-family: 'Courier New', Courier, monospace;
    color: #444;
  }

  .name {
    margin-bottom: 0.5rem;
    font-weight: bold;
  }

  .description {
    font-size: 0.9rem;
    line-height: 1.5;
  }

  
  @media (max-width: 640px) {
    .kit-item,
    .kit-item.reverse {
      flex-direction: column;
      gap: 1rem;
    }

    .kit-image,
    .kit-text {
      width: 100%;
    }
  }
</style>
