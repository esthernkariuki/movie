"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Heart, User } from "lucide-react";
import { Input } from "../Input";
import { Button } from "../Button";
import { fetchMovieGenres } from "@/app/utils/fetchData";


export function Header() {
    const [searchQuery, setSearchQuery] = useState("");
    const [categories, setCategories] = useState<{ name: string; path: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const baseCategories = [{ name: "All", path: "/" }];

                const response = await fetchMovieGenres();

                const genreCategories = response.genres.map(genre => ({
                    name: genre.name,
                    path: `/genre/${genre.id}`
                }));

                setCategories([...baseCategories, ...genreCategories]);
            } catch (error) {
                throw new Error(`Error fetching genres: ${(error as Error).message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <header className="bg-background border-b border-border sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-foreground">Moovie</span>
                    </Link>

                    <form onSubmit={handleSearch} className="flex-1 max-w-md mx-8">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <Input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                            />
                        </div>
                    </form>

                    <div className="flex items-center space-x-4">
                        <Link href="/favorites">
                            <Button variant="ghost" size="sm" className="text-foreground hover:text-primary">
                                <Heart className="w-4 h-4 mr-2" />
                                My list
                            </Button>
                        </Link>
                       <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                         <Link href="/signup"> <a>
                         <User className="w-4 h-4 mr-2" /> Sign up</a> </Link>
                       </Button>

                    </div>
                </div>
            </div>

            <div className="border-t border-border">
                <div className="container mx-auto px-4">
                    <nav className="flex space-x-8 py-4 overflow-x-auto">
                        {loading ? (
                            Array.from({ length: 7 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="h-8 w-20 bg-secondary rounded-full animate-pulse"
                                />
                            ))
                        ) : (
                            categories.map((category) => (
                                <Link
                                    key={category.name}
                                    href={category.path}
                                    className="whitespace-nowrap py-2 px-4 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                                >
                                    {category.name}
                                </Link>
                            ))
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
}