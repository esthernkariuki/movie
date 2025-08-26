export function LoadingSkeleton() {
    return (
        <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-1/4 mb-6"></div>
            <div className="flex overflow-x-auto gap-4 pb-4">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex-shrink-0 w-40">
                        <div className="bg-gray-700 rounded-lg aspect-[2/3] mb-2"></div>
                        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                    </div>
                ))}
            </div>
        </div>
    );
}