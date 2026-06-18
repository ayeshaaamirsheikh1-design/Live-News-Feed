// ====================================================
// script.js — Live News Feed
// All logic in one file:
// 1. CONFIG        → API key and base URL
// 2. STATE         → tracks current app state
// 3. DOM HELPERS   → show/hide spinner and error
// 4. API FUNCTIONS → fetch data from NewsAPI
// 5. RENDER        → build and inject news cards
// 6. EVENT LISTENERS → respond to user actions
// 7. STARTUP       → runs when page loads
// ====================================================


// ====================================================
// 1. CONFIG
// ====================================================

const API_KEY = 'fd194cc3160f702f7a441d449d4496dc';
const BASE_URL = 'https://gnews.io/api/v4';


// ====================================================
// 2. STATE
// Tracks what the user has selected
// ====================================================

let currentCategory = 'general'; // currently selected category


// ====================================================
// 3. DOM HELPERS
// Functions to show/hide spinner and error box
// ====================================================

// Grabs elements from the HTML by their id
const spinner      = document.getElementById('spinner');
const errorBox     = document.getElementById('errorBox');
const newsContainer = document.getElementById('newsContainer');

function showSpinner() {
  spinner.classList.remove('hidden');   // makes spinner visible
  newsContainer.innerHTML = '';         // clears old news cards
  errorBox.classList.add('hidden');     // hides any old error
}

function hideSpinner() {
  spinner.classList.add('hidden');      // hides spinner
}

function showError() {
  errorBox.classList.remove('hidden'); // makes error box visible
}


// ====================================================
// 4. API FUNCTIONS
// These talk to NewsAPI and return article data
// ====================================================

// --- Fetch news by category (general, sports, etc.) ---
async function fetchByCategory(category) {
  // Free plan fix: use /everything instead of /top-headlines
  // because /top-headlines with country= is blocked on free tier
  const url = `${BASE_URL}/search?q=${category}&lang=en&max=12&token=${API_KEY}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch news: ' + response.status);
  }

  const data = await response.json();
  return data.articles;
}

// --- Fetch news by search keyword ---
async function fetchBySearch(query) {
  const url = `${BASE_URL}/search?q=${query}&lang=en&max=12&token=${API_KEY}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Search failed: ' + response.status);
  }

  const data = await response.json();
  return data.articles;
}


// ====================================================
// 5. RENDER
// Build HTML cards and inject into the page
// ====================================================

// Converts "2026-06-15T10:30:00Z" → "June 15, 2026"
function formatDate(dateString) {
  if (!dateString) return 'Date unknown';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Builds ONE card's HTML from one article object
function createCard(article) {
  // Fallback values if API data is missing
  const image = article.image || 'https://via.placeholder.com/400x200?text=No+Image';
  const source = article.source?.name || 'Unknown Source';
  const desc   = article.description  || 'No description available.';
  const date   = formatDate(article.publishedAt);

  // Return the HTML string for this card
  return `
    <div class="card">
      <img
        src="${image}"
        alt="News image"
        onerror="this.src='https://via.placeholder.com/400x200?text=No+Image'"
      />
      <div class="card-body">
        <p class="card-source">${source}</p>
        <h3 class="card-title">${article.title}</h3>
        <p class="card-desc">${desc}</p>
        <p class="card-date">🕐 ${date}</p>
        <a href="${article.url}" target="_blank" class="card-link">Read More →</a>
      </div>
    </div>
  `;
}

// Takes the full array of articles → renders all cards
function renderArticles(articles) {
  if (!articles || articles.length === 0) {
    newsContainer.innerHTML = '<p class="no-results">😕 No news found. Try a different search.</p>';
    return;
  }

  // .map() loops through every article and calls createCard()
  // .join('') merges the array of strings into one big HTML string
  newsContainer.innerHTML = articles.map(article => createCard(article)).join('');
}


// ====================================================
// 6. MAIN LOAD FUNCTIONS
// Called when user picks category or searches
// ====================================================

async function loadByCategory(category) {
  currentCategory = category;
  showSpinner();

  try {
    const articles = await fetchByCategory(category);
    hideSpinner();
    renderArticles(articles);

  } catch (error) {
    console.error(error);   // logs error in browser console
    hideSpinner();
    showError();
  }
}

async function loadBySearch(query) {
  showSpinner();

  try {
    const articles = await fetchBySearch(query);
    hideSpinner();
    renderArticles(articles);

  } catch (error) {
    console.error(error);
    hideSpinner();
    showError();
  }
}


// ====================================================
// 7. EVENT LISTENERS
// These listen for user clicks and keypresses
// ====================================================

// --- Category buttons ---
const categoryButtons = document.querySelectorAll('.cat-btn');

categoryButtons.forEach(function(button) {
  button.addEventListener('click', function() {

    // Remove blue "active" style from all buttons
    categoryButtons.forEach(btn => btn.classList.remove('active'));

    // Add blue "active" style to the one that was clicked
    this.classList.add('active');

    // Read the data-category="..." value from the button
    const selected = this.dataset.category;

    // Load news for that category
    loadByCategory(selected);
  });
});

// --- Search button click ---
document.getElementById('searchBtn').addEventListener('click', function() {
  // .trim() removes empty spaces from start and end
  const query = document.getElementById('searchInput').value.trim();

  if (query === '') {
    // If search box is empty, reload current category
    loadByCategory(currentCategory);
  } else {
    loadBySearch(query);
  }
});

// --- Press Enter key in search box ---
document.getElementById('searchInput').addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    // Simulates clicking the search button
    document.getElementById('searchBtn').click();
  }
});


// ====================================================
// 8. STARTUP — runs automatically when page loads
// ====================================================

loadByCategory('general');