


// 1. CONFIG


const API_KEY = 'pub_4f40c93dd860489dba22476fa7aaba85';
const BASE_URL = 'https://newsdata.io/api/1';



// 2. STATE

let currentCategory = 'general';



// 3. DOM HELPERS


const spinner       = document.getElementById('spinner');
const errorBox      = document.getElementById('errorBox');
const newsContainer = document.getElementById('newsContainer');

function showSpinner() {
  spinner.classList.remove('hidden');
  newsContainer.innerHTML = '';
  errorBox.classList.add('hidden');
}

function hideSpinner() {
  spinner.classList.add('hidden');
}

function showError() {
  errorBox.classList.remove('hidden');
}



// 4. API FUNCTIONS




async function fetchByCategory(category) {
 
  const url = `${BASE_URL}/news?apikey=${API_KEY}&q=${category}&language=en`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch news: ' + response.status);
  }

  const data = await response.json();

  
  return data.results;
}

async function fetchBySearch(query) {
  
  const url = `${BASE_URL}/news?apikey=${API_KEY}&q=${query}&language=en`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Search failed: ' + response.status);
  }

  const data = await response.json();

 
  return data.results;
}




function formatDate(dateString) {
  if (!dateString) return 'Date unknown';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function createCard(article) {
  // newsdata.io uses different field names
  const image  = article.image_url   || 'https://via.placeholder.com/400x200?text=No+Image';
  const source = article.source_name || 'Unknown Source';
  const desc   = article.description || 'No description available.';
  const date   = formatDate(article.pubDate);
  const link   = article.link        || '#';

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
        <a href="${link}" target="_blank" class="card-link">Read More →</a>
      </div>
    </div>
  `;
}

function renderArticles(articles) {
  if (!articles || articles.length === 0) {
    newsContainer.innerHTML = '<p class="no-results">😕 No news found. Try a different search.</p>';
    return;
  }

  newsContainer.innerHTML = articles.map(article => createCard(article)).join('');
}



// 6. MAIN LOAD FUNCTIONS


async function loadByCategory(category) {
  currentCategory = category;
  showSpinner();

  try {
    const articles = await fetchByCategory(category);
    hideSpinner();
    renderArticles(articles);

  } catch (error) {
    console.error(error);
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


// 7. EVENT LISTENERS


const categoryButtons = document.querySelectorAll('.cat-btn');

categoryButtons.forEach(function(button) {
  button.addEventListener('click', function() {
    categoryButtons.forEach(btn => btn.classList.remove('active'));
    this.classList.add('active');
    const selected = this.dataset.category;
    loadByCategory(selected);
  });
});

document.getElementById('searchBtn').addEventListener('click', function() {
  const query = document.getElementById('searchInput').value.trim();
  if (query === '') {
    loadByCategory(currentCategory);
  } else {
    loadBySearch(query);
  }
});

document.getElementById('searchInput').addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    document.getElementById('searchBtn').click();
  }
});



// 8. STARTUP

loadByCategory('general');