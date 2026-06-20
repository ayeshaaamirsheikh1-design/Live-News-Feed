// ui.js

export const spinner = document.getElementById('spinner');
export const errorBox = document.getElementById('errorBox');
export const newsContainer = document.getElementById('newsContainer');

export function showSpinner() {
    spinner.classList.remove('hidden');
    newsContainer.innerHTML = '';
    errorBox.classList.add('hidden');
}

export function hideSpinner() {
    spinner.classList.add('hidden');
}

export function showError() {
    errorBox.classList.remove('hidden');
}

function formatDate(dateString) {
    if (!dateString) return 'Date unknown';

    return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function createCard(article) {
    const image = article.image_url ||
        'https://via.placeholder.com/400x200?text=No+Image';

    const source = article.source_name || 'Unknown Source';
    const desc = article.description || 'No description available.';
    const date = formatDate(article.pubDate);
    const link = article.link || '#';

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
                <a href="${link}" target="_blank" class="card-link">
                    Read More →
                </a>
            </div>
        </div>
    `;
}

export function renderArticles(articles) {
    if (!articles || articles.length === 0) {
        newsContainer.innerHTML =
            '<p class="no-results">😕 No news found. Try a different search.</p>';
        return;
    }

    newsContainer.innerHTML =
        articles.map(createCard).join('');
}