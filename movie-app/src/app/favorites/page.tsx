
"use client";

import { useState, useEffect } from "react";
import { fetchMovieDetails, Movie } from "../utils/fetchData";
import { Header } from "../components/Header";
import { Button } from "../components/Button";
import { MovieList } from "../components/MovieList";
import { Footer } from "../components/Footer";

export default function FavoritesPage() {
    const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [favorites, setFavorites] = useState<number[]>([]);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const savedFavorites = localStorage.getItem("favorites");
                if (savedFavorites) {
                    const favIds = JSON.parse(savedFavorites);
                    setFavorites(favIds);

                    if (favIds.length > 0) {
                        const moviePromises = favIds.map((id: number) => fetchMovieDetails(id));
                        const movies = await Promise.all(moviePromises);
                        setFavoriteMovies(movies);
                    }
                }
            } catch (error) {
                console.error("Error fetching favorite movies:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, []);

    const toggleFavorite = (id: number) => {
        const newFavorites = favorites.includes(id)
            ? favorites.filter(favId => favId !== id)
            : [...favorites, id];

        setFavorites(newFavorites);
        localStorage.setItem("favorites", JSON.stringify(newFavorites));

        if (favorites.includes(id)) {
            setFavoriteMovies(favoriteMovies.filter(movie => movie.id !== id));
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">My Favorites</h1>

                    {favoriteMovies.length > 0 && (
                        <Button
                            variant="outline"
                            onClick={() => {
                                setFavorites([]);
                                setFavoriteMovies([]);
                                localStorage.removeItem("favorites");
                            }}
                        >
                            Clear All
                        </Button>
                    )}
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                ) : favoriteMovies.length > 0 ? (
                    <MovieList
                        title=""
                        movies={favoriteMovies}
                        favorites={favorites}
                        onToggleFavorite={toggleFavorite}
                    />
                ) : (
                    <div className="text-center py-12">
                        <p className="text-lg mb-4">You haven&apos;t added any movies to your favorites yet</p>
                        <Button href="/" variant="destructive" size="lg" className="mt-4">
                            Browse Movies
                        </Button>

                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
