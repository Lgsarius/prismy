"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { TrackCard, TrackCardSkeleton } from "@/components/spotify/track-card";
import { setAccessToken, getTopTracks } from "@/lib/spotify";

type TimeRange = "short_term" | "medium_term" | "long_term";

const timeRangeLabels = {
  short_term: "Last 4 Weeks",
  medium_term: "Last 6 Months",
  long_term: "All Time",
};

export default function TopTracks() {
  const { data: session } = useSession();
  const [tracks, setTracks] = useState<SpotifyApi.TrackObjectFull[]>([]);
  const [timeRange, setTimeRange] = useState<TimeRange>("medium_term");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTracks() {
      if (session?.accessToken) {
        setLoading(true);
        setAccessToken(session.accessToken as string);
        try {
          const topTracks = await getTopTracks(timeRange);
          setTracks(topTracks);
        } catch (error) {
          console.error("Error fetching top tracks:", error);
        }
        setLoading(false);
      }
    }

    fetchTracks();
  }, [session, timeRange]);

  if (!session) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Please sign in to view your top tracks</h1>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold">Your Top Tracks</h1>
        <div className="flex gap-2">
          {Object.entries(timeRangeLabels).map(([range, label]) => (
            <Button
              key={range}
              variant={timeRange === range ? "default" : "outline"}
              onClick={() => setTimeRange(range as TimeRange)}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        {loading
          ? Array.from({ length: 10 }).map((_, i) => (
              <TrackCardSkeleton key={i} />
            ))
          : tracks.map((track, index) => (
              <TrackCard
                key={track.id}
                name={track.name}
                artists={track.artists.map((artist) => artist.name)}
                albumArt={track.album.images[0]?.url}
                previewUrl={track.preview_url}
                rank={index + 1}
              />
            ))}
      </div>
    </div>
  );
} 