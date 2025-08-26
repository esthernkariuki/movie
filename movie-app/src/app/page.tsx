"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchMovieDetails, fetchPopularMovies, fetchTopRatedMovies, fetchTrendingMovies, fetchUpcomingMovies, Movie } from "./utils/fetchData";
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { MovieList } from "./components/MovieList";
import { Footer } from "./components/Footer";
import { ErrorMessage } from "./components/Errormsg";
import { LoadingSkeleton } from "./components/Loading";

export default function HomePage() {
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const popularData = await fetchPopularMovies();
      setPopularMovies(popularData.results);

      if (popularData.results.length > 0) {
        const featuredId = popularData.results[0].id;
        const featuredDetails = await fetchMovieDetails(featuredId);
        setFeaturedMovie(featuredDetails);
      }

      const trendingData = await fetchTrendingMovies();
      setTrendingMovies(trendingData.results);

      const topRatedData = await fetchTopRatedMovies();
      setTopRatedMovies(topRatedData.results);

      const upcomingData = await fetchUpcomingMovies();
      setUpcomingMovies(upcomingData.results);

      const savedFavorites = localStorage.getItem("favorites");
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
      setError("Failed to load movies. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toggleFavorite = (id: number) => {
    const newFavorites = favorites.includes(id)
      ? favorites.filter(favId => favId !== id)
      : [...favorites, id];

    setFavorites(newFavorites);
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {error ? (
          <ErrorMessage message={error} onRetry={fetchData} />
        ) : loading ? (
          <>
            <div className="h-[70vh] bg-gray-800 rounded-xl mb-10"></div>
            <LoadingSkeleton />
            <LoadingSkeleton />
            <LoadingSkeleton />
            <LoadingSkeleton />
          </>

        ) : (
          <>
            {featuredMovie && <HeroSection movie={featuredMovie} />}

            <MovieList
              title="Trending Now"
              movies={trendingMovies}
              isHorizontal={true}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
            />

            <MovieList
              title="Popular Movies"
              movies={popularMovies}
              isHorizontal={true}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
            />

            <MovieList
              title="Top Rated"
              movies={topRatedMovies}
              isHorizontal={true}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
            />

            <MovieList
              title="Upcoming"
              movies={upcomingMovies}
              isHorizontal={true}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
            />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}