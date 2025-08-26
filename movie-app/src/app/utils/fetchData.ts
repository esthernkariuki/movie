const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = "fb0e15ab183b560110725b6bd51533fe"
const BEARER_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmYjBlMTVhYjE4M2I1NjAxMTA3MjViNmJkNTE1MzNmZSIsIm5iZiI6MTc1NTk2NjAzOC4yMTIsInN1YiI6IjY4YTllYTU2YzZkZjBmZWIxYTZjZGY4MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.U - 2Fc0oSTUVuEnnGK7vBPBWB8jk73k6GQWFo7QKeNJo"

const headers = {
    accept: 'application/json',
    Authorization: `Bearer ${BEARER_TOKEN}`
};

export interface Movie {
    id: number;
    title: string;
    poster_path: string;
    backdrop_path: string;
    overview: string;
    release_date: string;
    vote_average: number;
    genre_ids: number[];
}

export interface MovieDetails extends Movie {
    runtime: number;
    genres: { id: number; name: string }[];
    videos: { results: Video[] };
    credits: { cast: Cast[] };
}

export interface Video {
    id: string;
    key: string;
    name: string;
    site: string;
    type: string;
}

export interface Cast {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
}

async function apiRequest<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(`${BASE_URL}${endpoint}`);

    if (API_KEY) {
        url.searchParams.append('api_key', API_KEY);
    }

    if (params) {
        Object.keys(params).forEach(key => {
            if (params[key] !== undefined) {
                url.searchParams.append(key, params[key]);
            }
        });
    }

    if (!BEARER_TOKEN && !API_KEY) {
        throw new Error('TMDB API credentials not found. Please add TMDB_BEARER_TOKEN or TMDB_API_KEY to your environment variables.');
    }

    const response = await fetch(url.toString(), { headers });

    if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorData.status_message || 'Unknown error'}`);
    }

    return response.json();
}

export async function fetchMovies(endpoint: string, page = 1): Promise<{ results: Movie[]; total_pages: number }> {
    return apiRequest(endpoint, { page: page.toString() });
}

export async function fetchMovieDetails(id: number): Promise<MovieDetails> {
    return apiRequest(`/movie/${id}`, { append_to_response: 'videos,credits' });
}

export async function searchMovies(query: string, page = 1): Promise<{ results: Movie[]; total_pages: number }> {
    return apiRequest('/search/movie', {
        query: encodeURIComponent(query),
        page: page.toString()
    });
}

export async function fetchMoviesByGenre(genreId: number, page = 1): Promise<{ results: Movie[]; total_pages: number }> {
    return apiRequest('/discover/movie', {
        with_genres: genreId.toString(),
        page: page.toString()
    });
}

export async function fetchTrendingMovies(timeWindow: 'day' | 'week' = 'day', page = 1): Promise<{ results: Movie[]; total_pages: number }> {
    return apiRequest(`/trending/movie/${timeWindow}`, { page: page.toString() });
}

export async function fetchPopularMovies(page = 1): Promise<{ results: Movie[]; total_pages: number }> {
    return apiRequest('/movie/popular', { page: page.toString() });
}

export async function fetchTopRatedMovies(page = 1): Promise<{ results: Movie[]; total_pages: number }> {
    return apiRequest('/movie/top_rated', { page: page.toString() });
}

export async function fetchUpcomingMovies(page = 1): Promise<{ results: Movie[]; total_pages: number }> {
    return apiRequest('/movie/upcoming', { page: page.toString() });
}

export async function fetchMovieGenres(): Promise<{ genres: { id: number; name: string }[] }> {
    return apiRequest('/genre/movie/list');
}