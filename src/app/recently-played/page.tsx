"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { TrackCard, TrackCardSkeleton } from "@/components/spotify/track-card";
import { setAccessToken, getRecentlyPlayed } from "@/lib/spotify";

export default function RecentlyPlayed() {
  const { data: session } = useSession();
  const [tracks, setTracks] = useState<SpotifyApi.PlayHistoryObject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTracks() {
      if (session?.accessToken) {
        setLoading(true);
        setAccessToken(session.accessToken as string);
        try {
          const recentTracks = await getRecentlyPlayed();
          setTracks(recentTracks);
        } catch (error) {
          console.error("Error fetching recent tracks:", error);
        }
        setLoading(false);
      }
    }

    fetchTracks();
  }, [session]);

  if (!session) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Please sign in to view your recently played tracks</h1>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Recently Played</h1>
      </div>

      <div className="grid gap-4">
        {loading
          ? Array.from({ length: 10 }).map((_, i) => (
              <TrackCardSkeleton key={i} />
            ))
          : tracks.map((item) => (
              <TrackCard
                key={item.track.id + item.played_at}
                name={item.track.name}
                artists={item.track.artists.map((artist) => artist.name)}
                albumArt={item.track.album.images[0]?.url}
                previewUrl={item.track.preview_url}
              />
            ))}
      </div>
    </div>
  );
} 