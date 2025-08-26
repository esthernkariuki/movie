import { useState } from "react";
import { Play, X } from "lucide-react";
import Image from "next/image";
import { Video } from "@/app/utils/fetchData";
import { Button } from "../Button";

interface TrailerPlayerProps {
    videos: Video[];
}

export function TrailerPlayer({ videos }: TrailerPlayerProps) {
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

    const trailer = videos.find(video => video.type === "Trailer") || videos[0];

    if (!trailer) return null;

    return (
        <div className="mb-10">
            <h2 className="text-xl font-bold mb-4">Trailer</h2>

            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                {selectedVideo ? (
                    <div className="relative w-full h-full">
                        <iframe
                            src={`https://www.youtube.com/embed/${selectedVideo.key}?autoplay=1`}
                            className="absolute inset-0 w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                        <Button
                            size="icon"
                            variant="ghost"
                            className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black/70 w-8 h-8 rounded-full"
                            onClick={() => setSelectedVideo(null)}
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                ) : (
                    <div className="relative w-full h-full flex items-center justify-center">
                        <Image
                            src={`https://img.youtube.com/vi/${trailer.key}/maxresdefault.jpg`}
                            alt={trailer.name}
                            fill
                            className="object-cover"
                        />
                        <Button
                            size="icon"
                            variant="ghost"
                            className="absolute bg-black/50 text-white hover:bg-black/70 w-16 h-16 rounded-full"
                            onClick={() => setSelectedVideo(trailer)}
                        >
                            <Play className="w-8 h-8" />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}