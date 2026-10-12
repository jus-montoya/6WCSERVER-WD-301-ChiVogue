<template>
  <div>
    <a class="skip-link" href="#main">Skip to content</a>

    <header class="site-header">
      <a class="brand" href="/" aria-label="ChiVogue home">
        <span class="brand-mark">CV</span>
        <span>Chi<span>Vogue</span></span>
      </a>

      <nav
        :class="['main-nav', { open: menuOpen }]"
        aria-label="Main navigation"
      >
        <a :class="{ active: activeNav === 'home' }" data-nav="home" href="/"
          >Home</a
        >
        <a
          :class="{ active: activeNav === 'search' }"
          data-nav="search"
          href="/search"
          >Search Restaurant</a
        >
        <a
          :class="{ active: activeNav === 'best' }"
          data-nav="best"
          href="/best"
          >Best Quality</a
        >
        <a
          :class="{ active: activeNav === 'about' }"
          data-nav="about"
          href="/about"
          >About Us</a
        >
      </nav>

      <button
        class="icon-button menu-button"
        id="menuBtn"
        type="button"
        :aria-expanded="String(menuOpen)"
        :aria-label="menuOpen ? 'Close menu' : 'Open menu'"
        @click="toggleMenu"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>
    </header>

    <main id="main">
      <section class="home-hero">
        <div class="home-copy">
          <p class="eyebrow">A better way to choose where to eat</p>
          <h1>Discover great food,<br /><em>one restaurant</em> at a time.</h1>
          <p class="hero-lead">
            Find your next place to eat with ease. Explore restaurant
            information in one place, based on cuisine, location, and ratings.
          </p>
          <div class="hero-actions">
            <a class="button button-primary" href="/search">
              Explore restaurants <span>→</span>
            </a>
            <a class="button button-light" href="/search">
              Search restaurants
            </a>
          </div>
        </div>

        <div
          class="home-image"
          role="img"
          aria-label="A table set for a shared meal"
        >
          <span>GOOD FOOD, CLOSE BY</span>
        </div>
      </section>

      <section class="popular-section">
        <div class="section-heading">
          <div>
            <p class="eyebrow">Start with a craving</p>
            <h2>Popular cuisines</h2>
          </div>
          <a class="text-link" href="/search">Browse all restaurants →</a>
        </div>

        <div class="popular-grid" id="popularCuisines">
          <a
            class="popular-cuisine cuisine-italian"
            href="/search?cuisine=Italian"
          >
            <span>Italian</span>
          </a>
          <a
            class="popular-cuisine cuisine-japanese"
            href="/search?cuisine=Japanese"
          >
            <span>Japanese</span>
          </a>
          <a
            class="popular-cuisine cuisine-american"
            href="/search?cuisine=American"
          >
            <span>American</span>
          </a>
          <a
            class="popular-cuisine cuisine-chinese"
            href="/search?cuisine=Chinese"
          >
            <span>Chinese</span>
          </a>
          <a
            class="popular-cuisine cuisine-mexican"
            href="/search?cuisine=Mexican"
          >
            <span>Mexican</span>
          </a>
          <a class="popular-cuisine cuisine-thai" href="/search?cuisine=Thai">
            <span>Thai</span>
          </a>
        </div>
      </section>
    </main>

    <footer class="site-footer">
      <div class="footer-inner">
        <div class="footer-intro">
          <a class="brand" href="/" aria-label="ChiVogue home">
            <span class="brand-mark">CV</span>
            <span>Chi<span>Vogue</span></span>
          </a>
          <p>
            A considered guide to memorable meals, standout kitchens, and the
            tables worth booking.
          </p>
          <a class="footer-cta" href="/search"
            >Find your next favorite table <span aria-hidden="true">→</span></a
          >
        </div>
        <nav class="footer-links" aria-label="Footer navigation">
          <div class="footer-column">
            <h2>Discover</h2>
            <a href="/search">Find a restaurant</a>
            <a href="/best">Best quality</a>
            <a href="/">Home</a>
          </div>
          <div class="footer-column">
            <h2>ChiVogue</h2>
            <a href="/about">Our story</a>
            <a href="/about#team">Meet the team</a>
          </div>
        </nav>
      </div>
      <div class="footer-bottom">
        <span>© 2026 ChiVogue. Made for those who love a good table.</span>
        <span>Discover thoughtfully. Dine beautifully.</span>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from "vue";

const menuOpen = ref(false);
const activeNav = "home";

function toggleMenu() {
  menuOpen.value = !menuOpen.value;
}
</script>
