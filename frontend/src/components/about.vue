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

    <main id="main" class="page-main about-page">
      <section class="about-hero">
        <div>
          <p class="eyebrow">A little about ChiVogue</p>
          <h1>Discover great food,<br /><em>one restaurant</em> at a time.</h1>
          <p>
            We make it easier to find a place you’ll love. Browse useful
            restaurant details, compare ratings, and choose your next meal with
            confidence.
          </p>
          <div class="hero-actions">
            <a class="button button-primary" href="/search">
              Explore restaurants <span>→</span>
            </a>
            <a class="button button-light" href="/search">Search restaurants</a>
          </div>
        </div>

        <div
          class="about-hero-image image-drop-target"
          :class="{ 'image-drag-over': dragTarget === 'hero' }"
          @dragover.prevent="dragTarget = 'hero'"
          @dragleave.prevent="dragTarget = ''"
          @drop.prevent="dropImage($event, 'hero')"
          aria-label="About page hero photo. Drop or choose an image to replace it."
        >
          <img
            v-if="pageImages.hero"
            class="about-custom-image"
            :src="pageImages.hero"
            alt="Restaurant dining room"
          />
          <span class="image-caption">A GOOD TABLE BRINGS US TOGETHER</span>
        </div>
      </section>

      <section class="purpose-panel">
        <div class="purpose-copy">
          <p class="eyebrow">Our purpose</p>
          <h2>Making restaurant<br />discovery simple.</h2>
          <p>
            ChiVogue was created to make finding restaurants easier and more
            convenient. Instead of searching through different sources, you can
            explore restaurant information in one place based on cuisine,
            location, and ratings.
          </p>
        </div>

        <div
          class="purpose-image image-drop-target"
          :class="{ 'image-drag-over': dragTarget === 'purpose' }"
          @dragover.prevent="dragTarget = 'purpose'"
          @dragleave.prevent="dragTarget = ''"
          @drop.prevent="dropImage($event, 'purpose')"
          aria-label="About page story photo. Drop or choose an image to replace it."
        >
          <img
            v-if="pageImages.purpose"
            class="about-custom-image"
            :src="pageImages.purpose"
            alt="A shared meal at a restaurant"
          />
          <span>FIND A PLACE<br />TO COME TOGETHER</span>
        </div>
        <p v-if="imageError" class="image-upload-error" role="alert">
          {{ imageError }}
        </p>
      </section>

      <section class="why-section">
        <div class="why-heading">
          <div>
            <p class="eyebrow">The ChiVogue difference</p>
            <h2>Dining discoveries,<br /><em>considered.</em></h2>
          </div>
          <p class="why-intro">A thoughtful way to find the right room, the right cuisine, and the right table for the occasion.</p>
        </div>

        <div class="why-grid">
          <article class="why-card">
            <span class="why-number">01</span>
            <p class="why-card-label">Find with intention</p>
            <h3>A more considered search</h3>
            <p>
              Explore restaurants by cuisine and neighborhood, with the essential details gathered in one place.
            </p>
          </article>

          <article class="why-card">
            <span class="why-number">02</span>
            <p class="why-card-label">Choose with confidence</p>
            <h3>Details that matter</h3>
            <p>
              Compare available restaurant information and ratings before settling on where the evening will begin.
            </p>
          </article>

          <article class="why-card">
            <span class="why-number">03</span>
            <p class="why-card-label">Make room for discovery</p>
            <h3>Your next table, closer</h3>
            <p>
              Move from a craving to a considered shortlist, without searching across scattered sources.
            </p>
          </article>
        </div>
      </section>

      <section id="team" class="team-section">
        <div class="section-heading">
          <div>
            <p class="eyebrow">A shared point of view</p>
            <h2>The people behind ChiVogue</h2>
            <p class="section-lead">
              A small team bringing thoughtful restaurant discovery to life.
            </p>
          </div>
        </div>

        <div class="team-grid">
          <article class="team-card" v-for="member in team" :key="member.name">
            <div class="team-card-top">
              <span class="team-card-index">CHIVOGUE <i>·</i> {{ member.initials }}</span>
            </div>
            <div class="team-meta">
              <h3>{{ member.name }}</h3>
              <p>{{ member.role }}</p>
            </div>
            <p class="team-bio">{{ member.bio }}</p>
            <span class="team-card-rule" aria-hidden="true"></span>
          </article>
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
const activeNav = "about";

function toggleMenu() {
  menuOpen.value = !menuOpen.value;
}

const imageStorageKey = "chivogue-about-images";
const pageImages = ref({ hero: "", purpose: "" });
const dragTarget = ref("");
const imageError = ref("");

try {
  const savedImages = JSON.parse(localStorage.getItem(imageStorageKey) || "{}");
  pageImages.value = { ...pageImages.value, ...savedImages };
} catch {
  // Keep the built-in image when saved browser data is unavailable.
}

function selectImage(event, target) {
  readImage(event.target.files?.[0], target);
  event.target.value = "";
}

function dropImage(event, target) {
  dragTarget.value = "";
  readImage(event.dataTransfer.files?.[0], target);
}

function readImage(file, target) {
  imageError.value = "";
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    imageError.value = "Choose an image file.";
    return;
  }
  if (file.size > 10 * 1024 * 1024) {
    imageError.value = "Choose an image smaller than 10 MB.";
    return;
  }

  const reader = new FileReader();
  reader.onerror = () => {
    imageError.value = "The image could not be read. Try another file.";
  };
  reader.onload = () => {
    const source = new Image();
    source.onerror = () => {
      imageError.value = "That image could not be opened.";
    };
    source.onload = () => {
      const scale = Math.min(1, 1800 / source.width, 1200 / source.height);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(source.width * scale);
      canvas.height = Math.round(source.height * scale);
      canvas
        .getContext("2d")
        .drawImage(source, 0, 0, canvas.width, canvas.height);
      const optimized = canvas.toDataURL("image/jpeg", 0.84);
      const nextImages = { ...pageImages.value, [target]: optimized };
      try {
        localStorage.setItem(imageStorageKey, JSON.stringify(nextImages));
        pageImages.value = nextImages;
      } catch {
        imageError.value =
          "Your browser could not save this image. Try a smaller photo.";
      }
    };
    source.src = String(reader.result);
  };
  reader.readAsDataURL(file);
}

// Team Data
// NOTE: Make sure you create a folder named 'public' in your frontend root,
// and inside it create 'images/team/'. Place your images there.
const team = [
  {
    name: "Mikael Rodriguez",
    bio: "Develops the system functionality, database features, and overall website structure.",
  },
  {
    name: "Justine Montoya",
    bio: "Contributes to the system design, documentation, and development of the application.",
  },
  {
    name: "Humer Ramos",
    bio: "Helps develop and organize the system features and restaurant database functionality.",
  },
  {
    name: "Justine Tolentino",
    bio: "Contributes to the user interface, system documentation, and overall project development.",
  },
];
</script>
