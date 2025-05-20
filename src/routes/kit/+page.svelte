<script lang="ts">
  const kitItems = [
    {
      name: 'camera',
      model: 'fujifilm x100vi',
      description: 'pocket-size travel photography and videography with ibis'
    },
    {
      name: 'camera',
      model: 'sony a7sii',
      description: 'professional videography, corporate events, ads'
    },
    {
      name: 'video editing',
      model: 'davinci resolve',
      description: 'heavy color grading'
    },
    {
      name: 'photo editing',
      model: 'adobe lightroom',
      description: 'light post processing'
    }
  ];
</script>

<div class="kit">
  <div class="kit-items">
    {#each kitItems as item}
      <div class="kit-item">
        <div class="name">{item.name} {item.model}</div>
        <div class="description">{item.description}</div>
      </div>
    {/each}
  </div>
</div>

<style>
  .kit {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem 1.5rem;
    font-family: 'Courier New', Courier, monospace;
  }

  h1 {
    font-size: 2rem;
    margin-bottom: 2rem;
    font-weight: normal;
    text-align: center;
    color: #333;
  }

  .kit-items {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .kit-item {
    padding: 1.5rem;
    border: 1px solid #eee;
    border-radius: 4px;
    transition: all 0.2s ease;
  }

  .kit-item:hover {
    background: #f9f9f9;
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  }

  .name {
    font-weight: bold;
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
    color: #222;
    text-transform: capitalize;
  }

  .description {
    color: #555;
    line-height: 1.5;
  }

  @media (max-width: 640px) {
    .kit {
      padding: 1.5rem 1rem;
    }
    
    .kit-item {
      padding: 1.25rem;
    }
    
    h1 {
      font-size: 1.75rem;
      margin-bottom: 1.5rem;
    }
  }
</style>
