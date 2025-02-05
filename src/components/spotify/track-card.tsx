"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface TrackCardProps {
  name: string;
  artists: string[];
  albumArt: string;
  previewUrl?: string | null;
  rank?: number;
}

export function TrackCard({ name, artists, albumArt, previewUrl, rank }: TrackCardProps) {
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
              src={albumArt}
              alt={`${name} album art`}
              fill
              className="object-cover rounded-md"
            />
          </div>
          <div className="flex-grow min-w-0">
            <h3 className="font-semibold truncate">{name}</h3>
            <p className="text-sm text-muted-foreground truncate">
              {artists.join(", ")}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function TrackCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <Skeleton className="w-8 h-8" />
          <Skeleton className="w-16 h-16 rounded-md" />
          <div className="flex-grow space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 