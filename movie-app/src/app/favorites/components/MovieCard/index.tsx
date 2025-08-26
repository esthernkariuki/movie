import Image from "next/image";
import Link from "next/link";
import { Heart, Play } from "lucide-react";
import { cn } from "@/app/utils/utils";
import { Button } from "../Button";

interface MovieCardProps {
    id: number;
    title: string;
    posterPath: string;
    releaseDate: string;
    voteAverage: number;
    className?: string;
    isFavorite?: boolean;
    onToggleFavorite?: (id: number) => void;
}

export function MovieCard({
    id,
    title,
    posterPath,
    releaseDate,
    voteAverage,
    className,
    isFavorite = false,
    onToggleFavorite,
}: MovieCardProps) {
    const releaseYear = new Date(releaseDate).getFullYear();

    return (
        <div className={cn("group relative overflow-hidden rounded-lg", className)}>
            <Link href={`/movie/${id}`}>
                <div className="relative aspect-[2/3] overflow-hidden">
                    <Image
                        src={`https://image.tmdb.org/t/p/w500${posterPath}`}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <h3 className="text-lg font-bold text-white truncate">{title}</h3>
                        <div className="flex items-center justify-between mt-2">
                            <span className="text-sm text-white/80">{releaseYear}</span>
                            <div className="flex items-center bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">
                                {voteAverage.toFixed(1)}
                            </div>
                        </div>
                    </div>
                </div>
            </Link>

            <div className="absolute top-2 right-2 flex flex-col gap-2">
                <Button
                    size="icon"
                    variant="ghost"
                    className="bg-black/50 text-white hover:bg-black/70 w-8 h-8 rounded-full"
                    onClick={(e) => {
                        e.preventDefault();
                        onToggleFavorite?.(id);
                    }}
                >
                    <Heart className={cn("w-4 h-4", isFavorite && "fill-red-500 text-red-500")} />
                </Button>

                <Button
                    size="icon"
                    variant="ghost"
                    className="bg-black/50 text-white hover:bg-black/70 w-8 h-8 rounded-full"
                    asChild
                >
                    <Link href={`/movie/${id}`}>
                        <Play className="w-4 h-4" />
                    </Link>
                </Button>
            </div>
        </div>
    );
}