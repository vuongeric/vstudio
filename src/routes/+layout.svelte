<script>
  import { page } from '$app/stores';
  import { base } from '$app/paths';
  import { onMount } from 'svelte';

  let mobileMenuOpen = false;
  const navItems = [
    { name: 'Portfolio', href: `${base}/` },
    { name: 'Kit', href: `${base}/kit` }
  ];

  $: currentPath = $page.url.pathname;
  
  // Close mobile menu when navigating
  $: if (mobileMenuOpen && $page) {
    mobileMenuOpen = false;
  }
</script>

<div class="app">
  <nav class="nav">
    <div class="nav-container">
      <a href={`${base}/`} class="logo">eric vuong</a>
      
      <!-- Desktop Navigation -->
      <div class="desktop-nav">
        {#each navItems as item}
          <a 
            href={item.href}
            class:active={currentPath === item.href}
          >
            {item.name}
          </a>
        {/each}
      </div>

      <!-- Mobile menu button -->
      <button 
        class="mobile-menu-button"
        on:click={() => (mobileMenuOpen = !mobileMenuOpen)}
        aria-expanded="false"
      >
        <span class="sr-only">Menu</span>
        <div class={mobileMenuOpen ? 'hamburger open' : 'hamburger'}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>
    </div>

    <!-- Mobile menu -->
    {#if mobileMenuOpen}
      <div class="mobile-menu">
        {#each navItems as item}
          <a 
            href={item.href}
            class:active={currentPath === item.href}
          >
            {item.name}
          </a>
        {/each}
      </div>
    {/if}
  </nav>

  <main>
    <slot />
  </main>
  
  <footer class="footer">
    <div class="footer-content">
      <p>all media (c) eric vuong</p>
    </div>
  </footer>
</div>

<style>
  :global(*) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :global(html) {
    font-size: 16px;
    scroll-behavior: smooth;
    overflow-y: scroll; /* Always show scrollbar to prevent layout shift */
  }

  :global(body) {
    margin: 0;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: #1a1a1a;
    background-color: #f8f9fa;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .footer {
    margin-top: auto;
    padding: 1.5rem 2rem;
    text-align: center;
    font-family: 'Courier New', Courier, monospace;
    font-size: 0.875rem;
    color: #666;
    border-top: 1px solid #eee;
    background-color: #fff;
  }

  .footer-content {
    max-width: 1200px;
    margin: 0 auto;
  }

  @media (max-width: 768px) {
    .footer {
      padding: 1rem;
      font-size: 0.8rem;
    }
  }

  /* Navigation */
  .nav {
    background: transparent;
    position: relative;
    z-index: 10;
  }

  .nav-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1.5rem;
    height: 4rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .logo {
    font-family: 'Courier New', Courier, monospace;
    font-size: 1.2rem;
    font-weight: 600;
    letter-spacing: 1px;
    color: #333;
    text-decoration: none;
    transition: all 0.2s ease;
    text-transform: lowercase;
  }

  .logo:hover {
    color: #000;
  }

  .desktop-nav {
    display: none;
    gap: 2rem;
  }

  .desktop-nav a {
    color: #1a1a1a;
    text-decoration: none;
    font-size: 0.9375rem;
    font-family: 'Courier New', Courier, monospace;
    font-weight: 500;
    position: relative;
    padding: 0.5rem 0;
    opacity: 0.7;
    transition: opacity 0.2s ease;
    text-transform: lowercase;
  }

  .desktop-nav a:hover,
  .desktop-nav a.active {
    opacity: 1;
  }

  /* Mobile menu button */
  .mobile-menu-button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .hamburger {
    width: 24px;
    height: 16px;
    position: relative;
    transform: rotate(0deg);
    transition: .5s ease-in-out;
    cursor: pointer;
  }

  .hamburger span {
    display: block;
    position: absolute;
    height: 2px;
    width: 100%;
    background: #1a1a1a;
    border-radius: 2px;
    opacity: 1;
    left: 0;
    transform: rotate(0deg);
    transition: .25s ease-in-out;
  }

  .hamburger span:nth-child(1) {
    top: 0px;
  }

  .hamburger span:nth-child(2),
  .hamburger span:nth-child(3) {
    top: 7px;
  }

  .hamburger span:nth-child(4) {
    top: 14px;
  }

  .hamburger.open span:nth-child(1) {
    top: 7px;
    width: 0%;
    left: 50%;
  }

  .hamburger.open span:nth-child(2) {
    transform: rotate(45deg);
  }

  .hamburger.open span:nth-child(3) {
    transform: rotate(-45deg);
  }

  .hamburger.open span:nth-child(4) {
    top: 7px;
    width: 0%;
    left: 50%;
  }

  /* Mobile menu */
  .mobile-menu {
    display: flex;
    flex-direction: column;
    background: white;
    padding: 0.5rem 0;
    border-top: 1px solid #e5e7eb;
  }

  .mobile-menu a {
    padding: 0.75rem 1.5rem;
    color: #4b5563;
    font-family: 'Courier New', Courier, monospace;
    text-decoration: none;
    transition: all 0.2s ease;
    text-transform: lowercase;
  }

  .mobile-menu a:hover,
  .mobile-menu a.active {
    background-color: #f3f4f6;
    color: #1e40af;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  /* Main content */
  main {
    flex: 1;
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
    padding: 2rem 1.5rem;
  }

  /* Responsive */
  @media (min-width: 768px) {
    .desktop-nav {
      display: flex;
    }

    .mobile-menu-button {
      display: none;
    }

    .mobile-menu {
      display: none;
    }
  }
</style>
