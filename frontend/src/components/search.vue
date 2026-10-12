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

    <main id="main" class="page-main search-page">
      <div class="page-title">
        <p class="eyebrow">The restaurant directory</p>
        <h1>Search restaurants</h1>
        <p>Find your next table by name, cuisine, or borough.</p>
      </div>

      <section class="search-tools" aria-label="Restaurant search">
        <form class="directory-search" @submit.prevent="runSearch">
          <label class="sr-only" for="searchInput">Search restaurants</label>
          <input
            id="searchInput"
            v-model="searchText"
            type="search"
            placeholder="Search by name, cuisine, or borough..."
            autocomplete="off"
          />
          <select
            id="searchField"
            v-model="searchField"
            aria-label="Search field"
          >
            <option value="all">Everything</option>
            <option value="name">Name</option>
            <option value="cuisine">Cuisine</option>
            <option value="borough">Borough</option>
          </select>
          <button class="button button-primary" type="submit">Search</button>
        </form>

        <button class="button button-primary add-button" type="button" @click="openEditor()">
          ＋ Add restaurant
        </button>
      </section>

      <section class="browse-section">
        <div class="filter-heading">
          <h2>Search by cuisine</h2>
          <p>Select a cuisine to see related restaurants.</p>
        </div>
        <div class="filter-chips">
          <button
            v-for="filter in cuisineFilters"
            :key="filter.value"
            type="button"
            class="chip"
            :class="{ active: selectedCuisine === filter.value }"
            @click="selectedCuisine = filter.value"
          >
            {{ filter.label }} <small>{{ filter.count }}</small>
          </button>
        </div>
      </section>

      <section class="browse-section" id="boroughs">
        <div class="filter-heading">
          <h2>Filter by borough</h2>
          <p>Choose a borough to see restaurants in that area.</p>
        </div>
        <div class="filter-chips">
          <button
            v-for="filter in boroughFilters"
            :key="filter.value"
            type="button"
            class="chip"
            :class="{ active: selectedBorough === filter.value }"
            @click="selectedBorough = filter.value"
          >
            {{ filter.label }} <small>{{ filter.count }}</small>
          </button>
        </div>
      </section>

      <section class="directory-results">
        <div class="results-heading">
          <div>
            <p class="eyebrow">Your matches</p>
            <h2>Restaurants</h2>
          </div>
          <select
            class="sort-select"
            v-model="sortBy"
            aria-label="Sort restaurants"
          >
            <option value="rating">Highest rated</option>
            <option value="name">Name A–Z</option>
          </select>
        </div>

        <div v-if="activeFilterText" class="active-filter">
          {{ activeFilterText }}
        </div>

        <div class="restaurant-grid">
          <article
            v-for="(restaurant, index) in paginatedResults"
            :key="restaurant._id"
            class="restaurant-card"
          >
            <div class="restaurant-photo">
              <img
                v-if="restaurant.image"
                :src="restaurant.image"
                :alt="restaurant.name"
                loading="lazy"
              />
              <div
                v-else
                class="photo-fallback"
                :class="`photo-${(index % 8) + 1}`"
                role="img"
                :aria-label="restaurant.name"
              ></div>
            </div>

            <div class="card-content">
              <h3>{{ restaurant.name }}</h3>
              <p class="card-meta">
                {{ restaurant.cuisine }} · {{ restaurant.borough }}
              </p>
              <div v-if="restaurant.rating != null" class="rating">
                <span>{{ stars(restaurant.rating) }}</span>
                {{ Number(restaurant.rating).toFixed(1) }}
              </div>
              <div v-else class="rating-unrated">Not rated yet</div>
            </div>

            <div class="card-footer">
              <button class="card-action" type="button" @click="openEditor(restaurant)">Edit</button>
              <button class="card-action" type="button" @click="openDetails(restaurant)">View</button>
              <button class="card-action delete" type="button" @click="deleteRestaurant(restaurant)">Delete</button>
            </div>
          </article>

          <div v-if="apiError" class="empty-state" role="alert">{{ apiError }}</div>
          <div v-else-if="loading" class="empty-state" aria-live="polite">Loading restaurants…</div>
          <div v-else-if="filteredResults.length === 0" class="empty-state">
            No restaurants match your search. Try a different cuisine or
            borough.
          </div>
        </div>

        <div class="pagination">
          <button
            class="text-button"
            type="button"
            :disabled="page === 1"
            @click="changePage(-1)"
          >
            ← Previous
          </button>
          <span>Page {{ page }} of {{ totalPages }}</span>
          <button
            class="text-button"
            type="button"
            :disabled="page >= totalPages"
            @click="changePage(1)"
          >
            Next →
          </button>
        </div>
      </section>
    </main>

    <div v-if="editorOpen" class="modal" role="dialog" aria-modal="true" aria-labelledby="editorTitle" @click.self="editorOpen = false">
      <section class="modal-box">
        <button class="modal-close" type="button" aria-label="Close" @click="editorOpen = false">×</button>
        <p class="eyebrow">Restaurant details</p>
        <h2 id="editorTitle">{{ editingRestaurant ? 'Edit restaurant' : 'Add restaurant' }}</h2>
        <form class="form-grid" @submit.prevent="saveRestaurant">
          <label class="full">Restaurant name<input v-model.trim="form.name" required maxlength="120" /></label>
          <label>Cuisine<input v-model.trim="form.cuisine" required maxlength="80" placeholder="Italian, Japanese…" /></label>
          <label>Borough<select v-model="form.borough" required><option disabled value="">Choose borough</option><option v-for="borough in boroughOptions" :key="borough" :value="borough">{{ borough }}</option></select></label>
          <label>Rating (0–5)<input v-model.number="form.rating" type="number" min="0" max="5" step="0.1" required /></label>
          <label>Street address<input v-model.trim="form.street" maxlength="160" /></label>
          <div class="photo-field full">
            <span class="field-label">Restaurant photo</span>
            <label class="drop-zone" :class="{ 'drag-over': dragOver }" @dragover.prevent="dragOver = true" @dragleave.prevent="dragOver = false" @drop.prevent="onPhotoDrop">
              <span class="drop-icon" aria-hidden="true">＋</span><strong>Drop a photo here</strong><small>or <span>browse files</span> · JPG, PNG, WebP or GIF · up to 5 MB</small>
              <input ref="photoInput" type="file" accept="image/jpeg,image/png,image/webp,image/gif" hidden @change="onPhotoSelect" />
            </label>
            <div v-if="photoPreview" class="photo-preview"><img :src="photoPreview" alt="Selected restaurant photo preview" /><button class="text-button" type="button" @click="clearPhoto">Remove photo</button></div>
          </div>
          <p v-if="formError" class="form-error full" role="alert">{{ formError }}</p>
          <div class="modal-actions full"><button class="button button-light" type="button" @click="editorOpen = false">Cancel</button><button class="button button-primary" type="submit" :disabled="saving">{{ saving ? 'Saving…' : editingRestaurant ? 'Save changes' : 'Add restaurant' }}</button></div>
        </form>
      </section>
    </div>

    <div v-if="viewRestaurant" class="modal detail-modal" role="dialog" aria-modal="true" aria-labelledby="viewTitle" @click.self="viewRestaurant = null">
      <section class="modal-box detail-box">
        <button class="detail-close" type="button" aria-label="Close restaurant details" @click="viewRestaurant = null">×</button>
        <div class="detail-hero">
          <img v-if="viewRestaurant.image" class="detail-photo" :src="viewRestaurant.image" :alt="viewRestaurant.name" />
          <div class="detail-hero-shade"></div>
          <div class="detail-hero-copy">
            <p class="detail-kicker">CHIVOGUE · RESTAURANT PROFILE</p>
            <h2 id="viewTitle">{{ viewRestaurant.name }}</h2>
            <p>{{ viewRestaurant.cuisine }} <span aria-hidden="true">·</span> {{ viewRestaurant.borough }}</p>
          </div>
        </div>
        <div class="detail-content">
          <div class="detail-rating-card">
            <span class="detail-overline">Directory rating</span>
            <div class="detail-rating-line"><strong>{{ Number(viewRestaurant.rating || 0).toFixed(1) }}</strong><span> / 5</span></div>
            <div class="detail-stars" :aria-label="`${Number(viewRestaurant.rating || 0).toFixed(1)} out of 5`">{{ stars(viewRestaurant.rating) }}</div>
          </div>
          <div class="detail-facts">
            <div><span class="detail-overline">Cuisine</span><p>{{ viewRestaurant.cuisine || 'Not listed' }}</p></div>
            <div><span class="detail-overline">Neighborhood</span><p>{{ viewRestaurant.borough || 'Not listed' }}</p></div>
            <div class="detail-address"><span class="detail-overline">Address</span><p>{{ addressLabel(viewRestaurant) }}</p></div>
          </div>
          <div class="detail-footer">
            <span>Thoughtfully chosen. Memorable by design.</span>
            <div><button class="button button-light" type="button" @click="viewRestaurant = null">Back to results</button><button class="button button-primary" type="button" @click="openEditor(viewRestaurant); viewRestaurant = null">Edit details</button></div>
          </div>
        </div>
      </section>
    </div>
    <div v-if="notice" class="toast" :class="{ error: noticeError }" role="status">{{ notice }}</div>

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
import { computed, onMounted, ref, watch } from "vue";
import { apiRequest } from "../api";

const API = "restaurants";
const menuOpen = ref(false);
const activeNav = "search";
const restaurants = ref([]);
const cuisineFilters = ref([{ value: "", label: "All cuisines", count: 0 }]);
const boroughFilters = ref([{ value: "", label: "All boroughs", count: 0 }]);
const filteredResults = computed(() => restaurants.value);
const paginatedResults = computed(() => restaurants.value);
const pageSize = 8;
const searchText = ref("");
const searchField = ref("all");
const sortBy = ref("rating");
const selectedCuisine = ref("");
const selectedBorough = ref("");
const page = ref(1);
const totalPages = ref(1);
const total = ref(0);
const loading = ref(false);
const apiError = ref("");
const editorOpen = ref(false);
const viewRestaurant = ref(null);
const editingRestaurant = ref(null);
const saving = ref(false);
const formError = ref("");
const form = ref({ name: "", cuisine: "", borough: "", rating: "", street: "" });
const boroughOptions = ["Manhattan", "Brooklyn", "Queens", "The Bronx", "Staten Island"];
const photoInput = ref(null);
const photoPreview = ref("");
const photoChanged = ref(false);
const dragOver = ref(false);
const notice = ref("");
const noticeError = ref(false);
let noticeTimer;

const activeFilterText = computed(() => [
  searchText.value && `Search: “${searchText.value}”`,
  selectedCuisine.value && `Cuisine: ${selectedCuisine.value}`,
  selectedBorough.value && `Borough: ${selectedBorough.value}`,
].filter(Boolean).join(" · "));

function stars(rating) {
  const rounded = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)));
  return "★".repeat(rounded) + "☆".repeat(5 - rounded);
}

function request(path, options = {}) {
  return apiRequest(path, options);
}

async function loadRestaurants() {
  loading.value = true;
  apiError.value = "";
  const params = new URLSearchParams({
    search: searchText.value.trim(), field: searchField.value,
    cuisine: selectedCuisine.value, borough: selectedBorough.value,
    sort: sortBy.value, page: String(page.value), limit: String(pageSize),
  });
  try {
    const data = await request(`${API}?${params}`);
    restaurants.value = data.items || [];
    total.value = data.total || 0;
    page.value = data.page || 1;
    totalPages.value = data.pages || 1;
  } catch (error) {
    apiError.value = error.message;
    restaurants.value = [];
  } finally {
    loading.value = false;
  }
}

async function loadFilters() {
  try {
    const [cuisines, boroughs] = await Promise.all([
      request(`${API}/summary/cuisines`), request(`${API}/summary/boroughs`),
    ]);
    if (!Array.isArray(cuisines) || !Array.isArray(boroughs)) {
      throw new Error("The restaurant API returned an unexpected response.");
    }
    cuisineFilters.value = [{ value: "", label: "All cuisines", count: cuisines.reduce((n, x) => n + x.count, 0) }, ...cuisines.map(x => ({ value: x._id, label: x._id, count: x.count }))];
    boroughFilters.value = [{ value: "", label: "All boroughs", count: boroughs.reduce((n, x) => n + x.count, 0) }, ...boroughs.map(x => ({ value: x._id, label: x._id, count: x.count }))];
  } catch (error) {
    apiError.value ||= error.message;
  }
}

function runSearch() { page.value = 1; loadRestaurants(); }
function changePage(delta) { page.value = Math.max(1, Math.min(totalPages.value, page.value + delta)); loadRestaurants(); }
function toggleMenu() { menuOpen.value = !menuOpen.value; }
function showNotice(message, isError = false) {
  notice.value = message; noticeError.value = isError;
  clearTimeout(noticeTimer); noticeTimer = setTimeout(() => { notice.value = ""; }, 3000);
}

function openEditor(restaurant = null) {
  editingRestaurant.value = restaurant;
  form.value = restaurant ? {
    name: restaurant.name || "", cuisine: restaurant.cuisine || "",
    borough: restaurant.borough || "", rating: restaurant.rating == null ? "" : Number(restaurant.rating),
    street: restaurant.address?.street || "",
  } : { name: "", cuisine: "", borough: "", rating: "", street: "" };
  photoPreview.value = restaurant?.image || "";
  photoChanged.value = false; formError.value = ""; editorOpen.value = true;
}

function readPhoto(file) {
  formError.value = "";
  if (!file) return;
  if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
    formError.value = "Choose a JPG, PNG, WebP, or GIF image."; return;
  }
  if (file.size > 5 * 1024 * 1024) { formError.value = "Choose an image smaller than 5 MB."; return; }
  const reader = new FileReader();
  reader.onload = () => { photoPreview.value = String(reader.result); photoChanged.value = true; };
  reader.onerror = () => { formError.value = "Could not read that photo. Please try another file."; };
  reader.readAsDataURL(file);
}
function onPhotoSelect(event) { readPhoto(event.target.files?.[0]); }
function onPhotoDrop(event) { dragOver.value = false; readPhoto(event.dataTransfer.files?.[0]); }
function clearPhoto() { photoPreview.value = ""; photoChanged.value = true; if (photoInput.value) photoInput.value.value = ""; }

async function saveRestaurant() {
  formError.value = "";
  const rating = Number(form.value.rating);
  if (!form.value.name || !form.value.cuisine || !form.value.borough || form.value.rating === "" || !Number.isFinite(rating) || rating < 0 || rating > 5) {
    formError.value = "Enter a name, cuisine, borough, and rating from 0 to 5."; return;
  }
  const payload = {
    name: form.value.name, cuisine: form.value.cuisine, borough: form.value.borough,
    rating, address: { street: form.value.street },
  };
  if (photoChanged.value) payload.image = photoPreview.value;
  saving.value = true;
  try {
    const id = editingRestaurant.value?._id;
    await request(id ? `${API}/${id}` : API, { method: id ? "PUT" : "POST", body: JSON.stringify(payload) });
    editorOpen.value = false;
    if (!id && page.value > 1) page.value = 1;
    await Promise.all([loadRestaurants(), loadFilters()]);
    showNotice(id ? "Restaurant updated." : "Restaurant added.");
  } catch (error) { formError.value = error.message; }
  finally { saving.value = false; }
}

function openDetails(restaurant) { viewRestaurant.value = restaurant; }
function addressLabel(restaurant) {
  const address = restaurant.address || {};
  return [address.building, address.street, address.zipcode].filter(Boolean).join(" ") || "Address not provided";
}
async function deleteRestaurant(restaurant) {
  if (!window.confirm(`Delete ${restaurant.name}? This cannot be undone.`)) return;
  try {
    await request(`${API}/${restaurant._id}`, { method: "DELETE" });
    if (restaurants.value.length === 1 && page.value > 1) page.value -= 1;
    await Promise.all([loadRestaurants(), loadFilters()]);
    showNotice("Restaurant deleted.");
  } catch (error) { showNotice(error.message, true); }
}

watch([searchText, searchField, selectedCuisine, selectedBorough, sortBy], () => {
  page.value = 1; loadRestaurants();
});
onMounted(async () => {
  const params = new URLSearchParams(window.location.search);
  selectedCuisine.value = params.get("cuisine") || "";
  selectedBorough.value = params.get("borough") || "";
  await Promise.all([loadRestaurants(), loadFilters()]);
});
</script>
