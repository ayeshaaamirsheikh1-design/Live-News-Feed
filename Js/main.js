// main.js

import { fetchByCategory, fetchBySearch } from './api.js';

import {
    showSpinner,
    hideSpinner,
    showError,
    renderArticles
} from './ui.js';

let currentCategory = 'general';

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

const categoryButtons = document.querySelectorAll('.cat-btn');

categoryButtons.forEach(button => {
    button.addEventListener('click', function () {
        categoryButtons.forEach(btn =>
            btn.classList.remove('active')
        );

        this.classList.add('active');
        loadByCategory(this.dataset.category);
    });
});

document
    .getElementById('searchBtn')
    .addEventListener('click', () => {
        const query =
            document.getElementById('searchInput')
            .value
            .trim();

        if (query === '') {
            loadByCategory(currentCategory);
        } else {
            loadBySearch(query);
        }
    });

document
    .getElementById('searchInput')
    .addEventListener('keydown', event => {
        if (event.key === 'Enter') {
            document.getElementById('searchBtn').click();
        }
    });

loadByCategory('general');