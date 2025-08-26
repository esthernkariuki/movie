import { Cast } from "@/app/utils/fetchData";
import Image from "next/image";
import Link from "next/link";

interface CastListProps {
    cast: Cast[];
}

export function CastList({ cast }: CastListProps) {
    return (
        <div className="mb-10">
            <h2 className="text-xl font-bold mb-4">Cast</h2>
            <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 scrollbar-hide">
                {cast.slice(0, 10).map((person) => (
                    <div key={person.id} className="flex-shrink-0 w-32">
                        <Link href={`/person/${person.id}`}>
                            <div className="relative aspect-[2/3] overflow-hidden rounded-lg mb-2">
                                <Image
                                    src={
                                        person.profile_path
                                            ? `https://image.tmdb.org/t/p/w500${person.profile_path}`
                                            : "/placeholder.svg"
                                    }
                                    alt={person.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <h3 className="font-medium truncate">{person.name}</h3>
                            <p className="text-sm text-muted-foreground truncate">{person.character}</p>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}