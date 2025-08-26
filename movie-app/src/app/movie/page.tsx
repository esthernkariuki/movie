"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Clock, Star, Calendar } from "lucide-react";
import { fetchMovieDetails, Movie, MovieDetails, searchMovies } from "@/app/utils/fetchData";
import { Button } from "@/app/components/Button";
import { Header } from "@/app/components/Header";
import { TrailerPlayer } from "@/app/components/TrailerPlayer";
import { CastList } from "../components/CastList";
import { MovieCard } from "@/app/components/MovieCard";
import { Footer } from "@/app/components/Footer";
import Image from "next/image";

export default function MoviePage() {
    const params = useParams();
    const movieId = params.id as string;

    const [movie, setMovie] = useState<MovieDetails | null>(null);
    const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
    const [favorites, setFavorites] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const movieDetails = await fetchMovieDetails(Number(movieId));
                setMovie(movieDetails);

                const similarData = await searchMovies(movieDetails.title, 1);
                setSimilarMovies(similarData.results.filter(m => m.id !== movieDetails.id).slice(0, 6));

                const savedFavorites = localStorage.getItem("favorites");
                if (savedFavorites) {
                    setFavorites(JSON.parse(savedFavorites));
                }
            } catch (error) {
                console.error("Error fetching movie details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [movieId]);

    const toggleFavorite = (id: number) => {
        const newFavorites = favorites.includes(id)
            ? favorites.filter(favId => favId !== id)
            : [...favorites, id];

        setFavorites(newFavorites);
        localStorage.setItem("favorites", JSON.stringify(newFavorites));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!movie) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Movie not found</h1>
                    <Button href="/" variant="destructive" size="lg" className="mt-4">
                        Back to Home
                    </Button>
                </div>
            </div>
        );
    }

    const runtimeHours = Math.floor(movie.runtime / 60);
    const runtimeMinutes = movie.runtime % 60;
    const isFavorite = favorites.includes(movie.id);

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row gap-8 mb-10">
                    <div className="md:w-1/3">
                        <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
                            <Image
                                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                alt={movie.title}
                                className="w-full h-full object-cover"
                                fill
                            />
                        </div>
                    </div>

                    <div className="md:w-2/3">
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">{movie.title}</h1>

                        <div className="flex flex-wrap gap-4 mb-4">
                            <div className="flex items-center bg-yellow-500 text-black px-2 py-1 rounded text-sm font-bold">
                                <Star className="w-4 h-4 mr-1" />
                                {movie.vote_average.toFixed(1)}
                            </div>

                            <div className="flex items-center text-muted-foreground">
                                <Clock className="w-4 h-4 mr-1" />
                                {runtimeHours}h {runtimeMinutes}m
                            </div>

                            <div className="flex items-center text-muted-foreground">
                                <Calendar className="w-4 h-4 mr-1" />
                                {new Date(movie.release_date).getFullYear()}
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-6">
                            {movie.genres.map((genre) => (
                                <span key={genre.id} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">
                                    {genre.name}
                                </span>
                            ))}
                        </div>

                        <p className="text-muted-foreground mb-6">{movie.overview}</p>

                        <div className="flex gap-4 mb-6">
                            <Button size="lg" className="bg-primary hover:bg-primary/90">
                                Play
                            </Button>

                            <Button
                                size="lg"
                                variant="outline"
                                onClick={() => toggleFavorite(movie.id)}
                                className={isFavorite ? "border-red-500 text-red-500 hover:bg-red-500/10" : ""}
                            >
                                {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                            </Button>
                        </div>
                    </div>
                </div>

                {movie.videos.results.length > 0 && (
                    <TrailerPlayer videos={movie.videos.results} />
                )}

                {movie.credits.cast.length > 0 && (
                    <CastList cast={movie.credits.cast} />
                )}

                {similarMovies.length > 0 && (
                    <div className="mb-10">
                        <h2 className="text-xl font-bold mb-4">Similar Movies</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {similarMovies.map((movie) => (
                                <MovieCard
                                    key={movie.id}
                                    id={movie.id}
                                    title={movie.title}
                                    posterPath={movie.poster_path}
                                    releaseDate={movie.release_date}
                                    voteAverage={movie.vote_average}
                                    isFavorite={favorites.includes(movie.id)}
                                    onToggleFavorite={toggleFavorite}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}