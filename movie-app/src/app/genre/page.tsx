"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { fetchMovieGenres, fetchMoviesByGenre, Movie } from "@/app/utils/fetchData";
import { Header } from "@/app/components/Header";
import { MovieList } from "@/app/components/MovieList";
import { Footer } from "@/app/components/Footer";

export default function GenrePage() {
    const params = useParams();
    const genreId = params.id as string;

    const [movies, setMovies] = useState<Movie[]>([]);
    const [genreName, setGenreName] = useState<string>("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const movieData = await fetchMoviesByGenre(Number(genreId));
                setMovies(movieData.results);

                const genresData = await fetchMovieGenres();
                const genre = genresData.genres.find(g => g.id === Number(genreId));
                if (genre) {
                    setGenreName(genre.name);
                }
            } catch (error) {
                console.error("Error fetching genre data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [genreId]);

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-6">{genreName || "Genre"} Movies</h1>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <MovieList
                        title=""
                        movies={movies}
                        isHorizontal={false}
                    />
                )}
            </main>

            <Footer />
        </div>
    );
}
