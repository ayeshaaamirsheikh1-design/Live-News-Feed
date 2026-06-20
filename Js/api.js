// api.js

const API_KEY = 'pub_4f40c93dd860489dba22476fa7aaba85';
const BASE_URL = 'https://newsdata.io/api/1';

export async function fetchByCategory(category) {
    const url = `${BASE_URL}/news?apikey=${API_KEY}&q=${category}&language=en`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Failed to fetch news: ' + response.status);
    }

    const data = await response.json();
    return data.results;
}

export async function fetchBySearch(query) {
    const url = `${BASE_URL}/news?apikey=${API_KEY}&q=${query}&language=en`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Search failed: ' + response.status);
    }

    const data = await response.json();
    return data.results;
}