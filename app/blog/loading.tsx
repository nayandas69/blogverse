import { BlogCardSkeleton } from "@/components/blog-card"

export default function Loading() {
    return (
        <div className="container mx-auto px-4 py-20 md:py-24">
            <div className="mb-12">
                <div className="h-12 w-32 bg-pink-50 animate-pulse rounded-lg mb-4" />
                <div className="h-6 w-96 max-w-full bg-pink-50 animate-pulse rounded-lg" />
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                    <BlogCardSkeleton key={i} />
                ))}
            </div>
        </div>
    )
}
