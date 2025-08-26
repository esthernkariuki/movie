
import { Movie } from "@/app/utils/fetchData";
import { MovieCard } from "../MovieCard";


interface MovieListProps {
    title: string;
    movies: Movie[];
    isHorizontal?: boolean;
    favorites?: number[];
    onToggleFavorite?: (id: number) => void;
}

export function MovieList({
    title,
    movies,
    isHorizontal = false,
    favorites = [],
    onToggleFavorite,
}: MovieListProps) {
    return (
        <div className="mb-10">
            <h2 className="text-xl font-bold mb-4">{title}</h2>

            {isHorizontal ? (
                <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 scrollbar-hide">
                    {movies.map((movie) => (
                        <div key={movie.id} className="flex-shrink-0 w-40">
                            <MovieCard
                                id={movie.id}
                                title={movie.title}
                                posterPath={movie.poster_path}
                                releaseDate={movie.release_date}
                                voteAverage={movie.vote_average}
                                isFavorite={favorites.includes(movie.id)}
                                onToggleFavorite={onToggleFavorite}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {movies.map((movie) => (
                        <MovieCard
                            key={movie.id}
                            id={movie.id}
                            title={movie.title}
                            posterPath={movie.poster_path}
                            releaseDate={movie.release_date}
                            voteAverage={movie.vote_average}
                            isFavorite={favorites.includes(movie.id)}
                            onToggleFavorite={onToggleFavorite}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}