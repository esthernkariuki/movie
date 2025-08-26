
import Image from "next/image";
import Link from "next/link";
import { Play, Star } from "lucide-react";
import { Button } from "../Button";
import { Movie } from "@/app/utils/fetchData";

interface HeroSectionProps {
    movie: Movie;
}

export function HeroSection({ movie }: HeroSectionProps) {
    return (
        <div className="relative h-[70vh] rounded-xl overflow-hidden mb-10">
            <Image
                src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                alt={movie.title}
                fill
                className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

            <div className="absolute bottom-0 left-0 p-8 max-w-2xl">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{movie.title}</h1>
                <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center bg-yellow-500 text-black px-2 py-1 rounded text-sm font-bold">
                        <Star className="w-4 h-4 mr-1" />
                        {movie.vote_average.toFixed(1)}
                    </div>
                    <span className="text-white/80">
                        {new Date(movie.release_date).getFullYear()}
                    </span>
                </div>

                <p className="text-white/90 mb-6 line-clamp-3">{movie.overview}</p>

                <div className="flex gap-4">
                    <Button size="lg" className="bg-white text-black hover:bg-white/90" asChild>
                        <Link href={`/movie/${movie.id}`}>
                            <Play className="w-5 h-5 mr-2" />
                            Play
                        </Link>
                    </Button>

                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                        <Link href={`/movie/${movie.id}`}>
                            More Info
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
