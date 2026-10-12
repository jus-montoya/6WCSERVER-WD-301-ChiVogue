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
        <a
          :class="{ active: activeNav === 'home' }"
          data-nav="home"
          href="/"
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

    <main id="main" class="page-main best-page">
      <div class="page-title">
        <p class="eyebrow">A little help choosing</p>
        <h1>Best quality</h1>
        <p>
          Restaurants with the highest average ratings, ranked from the live
          directory.
        </p>
      </div>

      <section class="best-content">
        <div class="best-section-heading">
          <div>
            <p class="eyebrow">Highest rated</p>
            <h2>Top rated restaurants</h2>
            <p>Our best tables, ranked by their average rating.</p>
          </div>
          <span class="quality-stamp">TOP<br /><b>TABLES</b><br />✦</span>
        </div>

        <div class="table-wrap">
          <table class="best-table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Restaurant</th>
                <th scope="col">Cuisine</th>
                <th scope="col">Borough</th>
                <th scope="col">Average rating</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(restaurant, index) in topRestaurants" :key="restaurant._id || restaurant.name">
                <td class="rank">{{ String(index + 1).padStart(2, "0") }}</td>
                <td class="restaurant-name">{{ restaurant.name }}</td>
                <td>{{ restaurant.cuisine }}</td>
                <td>{{ restaurant.borough }}</td>
                <td class="best-rating-cell">
                  <span class="best-rating-value"><strong>{{ Number(restaurant.rating || 0).toFixed(1) }}</strong><small>/ 5</small></span>
                  <span class="rating-stars" role="img" :aria-label="`Rating ${Number(restaurant.rating || 0).toFixed(1)} out of 5`">
                    <span class="rating-stars-empty">★★★★★</span>
                    <span class="rating-stars-fill" :style="{ width: `${ratingWidth(restaurant.rating)}%` }">★★★★★</span>
                  </span>
                </td>
              </tr>
              <tr v-if="loading"><td colspan="5" class="rating-state">Loading restaurant ratings…</td></tr>
              <tr v-else-if="ratingError"><td colspan="5" class="rating-state rating-error">{{ ratingError }}</td></tr>
              <tr v-else-if="topRestaurants.length === 0"><td colspan="5" class="rating-state">No restaurant ratings yet.</td></tr>
            </tbody>
          </table>
        </div>

        <div class="cuisine-rating-section">
          <div class="best-section-heading">
            <div>
              <p class="eyebrow">Find your kind of good</p>
              <h2>Average rating by cuisine</h2>
              <p>Compare ratings across the cuisines in our directory.</p>
            </div>
          </div>

          <div class="cuisine-rating-list">
            <div
              v-for="item in cuisineRatings"
              :key="item.name"
              class="cuisine-rating-row"
            >
              <span class="cuisine-name">{{ item.name }}</span>
              <span class="bar"
                ><i :style="{ width: `${item.width}%` }"></i
              ></span>
              <span class="cuisine-score"><strong>{{ Number(item.rating).toFixed(1) }}</strong><span class="rating-stars cuisine-stars" role="img" :aria-label="`Average rating ${Number(item.rating).toFixed(1)} out of 5`"><span class="rating-stars-empty">★★★★★</span><span class="rating-stars-fill" :style="{ width: `${ratingWidth(item.rating)}%` }">★★★★★</span></span></span>
              <small
                >{{ item.count }}
                {{ item.count === 1 ? "restaurant" : "restaurants" }}</small
              >
            </div>
            <p v-if="!loading && !ratingError && cuisineRatings.length === 0" class="rating-state">No rated restaurants to compare yet.</p>
          </div>
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
          <p>A considered guide to memorable meals, standout kitchens, and the tables worth booking.</p>
          <a class="footer-cta" href="/search">Find your next favorite table <span aria-hidden="true">→</span></a>
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
import { onMounted, ref } from "vue";
import { apiRequest } from "../api";

const menuOpen = ref(false);
const activeNav = "best";

const topRestaurants = ref([]);
const cuisineRatings = ref([]);
const loading = ref(true);
const ratingError = ref("");

function ratingWidth(rating) {
  return Math.max(0, Math.min(100, (Number(rating) || 0) * 20));
}

async function loadRatings() {
  loading.value = true;
  ratingError.value = "";
  try {
    const [restaurants, cuisines] = await Promise.all([
      apiRequest("restaurants/best?min=0"),
      apiRequest("restaurants/summary/cuisines"),
    ]);
    topRestaurants.value = restaurants.filter(item => item.rating != null).slice(0, 8);
    const maxAverage = Math.max(...cuisines.map(item => Number(item.averageRating) || 0), 1);
    cuisineRatings.value = cuisines.filter(item => item.averageRating != null).map(item => ({
      name: item._id,
      rating: Number(item.averageRating) || 0,
      count: item.count,
      width: ((Number(item.averageRating) || 0) / maxAverage) * 100,
    }));
  } catch (error) {
    ratingError.value = error.message || "Could not load restaurant ratings.";
  } finally {
    loading.value = false;
  }
}

function toggleMenu() {
  menuOpen.value = !menuOpen.value;
}

onMounted(loadRatings);
</script>
