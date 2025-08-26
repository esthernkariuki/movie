"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Movie, searchMovies } from "../utils/fetchData";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { MovieList } from "../components/MovieList";
import { Footer } from "../components/Footer";

function SearchResults() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";

    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState(query);
    const [favorites, setFavorites] = useState<number[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            if (!query) {
                setMovies([]);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const data = await searchMovies(query, currentPage);
                setMovies(data.results);
                setTotalPages(data.total_pages);

                const savedFavorites = localStorage.getItem("favorites");
                if (savedFavorites) {
                    setFavorites(JSON.parse(savedFavorites));
                }
            } catch (error) {
                console.error("Error searching movies:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [query, currentPage]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
        }
    };

    const toggleFavorite = (id: number) => {
        const newFavorites = favorites.includes(id)
            ? favorites.filter(favId => favId !== id)
            : [...favorites, id];

        setFavorites(newFavorites);
        localStorage.setItem("favorites", JSON.stringify(newFavorites));
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold mb-6">
                        {query ? `Search Results for "${query}"` : "Search Movies"}
                    </h1>

                    <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl">
                        <Input
                            type="text"
                            placeholder="Search for movies..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1"
                        />
                        <Button type="submit">
                            <Search className="w-4 h-4 mr-2" />
                            Search
                        </Button>
                    </form>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                ) : movies.length > 0 ? (
                    <>
                        <MovieList
                            title=""
                            movies={movies}
                            favorites={favorites}
                            onToggleFavorite={toggleFavorite}
                        />

                        {totalPages > 1 && (
                            <div className="flex justify-center gap-2 mt-8">
                                <Button
                                    variant="outline"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </Button>

                                <span className="flex items-center px-4">
                                    Page {currentPage} of {totalPages}
                                </span>

                                <Button
                                    variant="outline"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                </Button>
                            </div>
                        )}
                    </>
                ) : query ? (
                    <div className="text-center py-12">
                        <p className="text-lg mb-4">No movies found matching &quot;{query}&quot;</p>
                        <p>Try a different search term</p>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-lg mb-4">Enter a search term to find movies</p>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        }>
            <SearchResults />
        </Suspense>
    );
}