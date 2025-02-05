"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface ArtistCardProps {
  name: string;
  imageUrl: string;
  genres: string[];
  followers: number;
  rank?: number;
}

export function ArtistCard({ name, imageUrl, genres, followers, rank }: ArtistCardProps) {
  return (
    <Card className="overflow-hidden hover:bg-accent transition-colors group">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {rank && (
            <span className="text-2xl font-bold text-muted-foreground w-8">
              {rank}
            </span>
          )}
          <div className="relative w-16 h-16 flex-shrink-0">
            <Image
              src={imageUrl}
              alt={`${name} profile`}
              fill
              className="object-cover rounded-full"
            />
          </div>
          <div className="flex-grow min-w-0">
            <h3 className="font-semibold truncate">{name}</h3>
            <p className="text-sm text-muted-foreground truncate">
              {genres.slice(0, 3).join(", ")}
            </p>
            <p className="text-sm text-muted-foreground">
              {followers.toLocaleString()} followers
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ArtistCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <Skeleton className="w-8 h-8" />
          <Skeleton className="w-16 h-16 rounded-full" />
          <div className="flex-grow space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 