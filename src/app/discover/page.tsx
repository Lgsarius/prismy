"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrackCard, TrackCardSkeleton } from "@/components/spotify/track-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { setAccessToken, getRecommendations, getAvailableGenres, getTopTracks, getTopArtists, createRecommendedPlaylist } from "@/lib/spotify";
import { Loader2, Plus, Save } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Discover() {
  const { data: session, status } = useSession();
  const [recommendations, setRecommendations] = useState<SpotifyApi.TrackObjectFull[]>([]);
  const [availableGenres, setAvailableGenres] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playlistName, setPlaylistName] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchInitialData() {
      if (!session?.accessToken) return;

      setLoading(true);
      setError(null);

      try {
        setAccessToken(session.accessToken as string);
        
        // Get available genres
        const genres = await getAvailableGenres();
        setAvailableGenres(genres);

        // Get initial recommendations based on top tracks and artists
        const [topTracks, topArtists] = await Promise.all([
          getTopTracks("short_term"),
          getTopArtists("short_term"),
        ]);

        const recommendations = await getRecommendations({
          seedTracks: topTracks.slice(0, 2).map(track => track.id),
          seedArtists: topArtists.slice(0, 2).map(artist => artist.id),
          seedGenres: genres.slice(0, 1),
          limit: 20,
        });

        setRecommendations(recommendations);
      } catch (error) {
        console.error("Error fetching discovery data:", error);
        setError("Failed to load recommendations. Please try again later.");
      }

      setLoading(false);
    }

    fetchInitialData();
  }, [session]);

  const handleGenreChange = async (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(prev => prev.filter(g => g !== genre));
    } else if (selectedGenres.length < 5) {
      setSelectedGenres(prev => [...prev, genre]);
    }
  };

  const handleRefresh = async () => {
    if (!session?.accessToken) return;
    setLoading(true);
    setError(null);

    try {
      setAccessToken(session.accessToken as string);
      const newRecommendations = await getRecommendations({
        seedGenres: selectedGenres,
        limit: 20,
      });
      setRecommendations(newRecommendations);
    } catch (error) {
      console.error("Error refreshing recommendations:", error);
      setError("Failed to refresh recommendations. Please try again.");
    }

    setLoading(false);
  };

  const handleCreatePlaylist = async () => {
    if (!session?.accessToken || !playlistName) return;
    setSaving(true);
    setSuccess(false);
    setError(null);

    try {
      setAccessToken(session.accessToken as string);
      const trackUris = recommendations.map(track => track.uri);
      await createRecommendedPlaylist(
        session.user?.id as string,
        playlistName,
        `Discovered with Spotify Tools on ${new Date().toLocaleDateString()}`,
        trackUris
      );
      setSuccess(true);
      setPlaylistName("");
    } catch (error) {
      console.error("Error creating playlist:", error);
      setError("Failed to create playlist. Please try again.");
    }

    setSaving(false);
  };

  if (status === "loading") {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-2" />
          <div className="h-4 bg-muted rounded w-1/3" />
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Please sign in to discover new music</h1>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Discover New Music</h1>
        <p className="text-sm md:text-base text-muted-foreground mt-2">
          Get personalized music recommendations based on your taste
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Select Genres (up to 5)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {availableGenres.map((genre) => (
              <Button
                key={genre}
                variant={selectedGenres.includes(genre) ? "default" : "outline"}
                size="sm"
                onClick={() => handleGenreChange(genre)}
                className="capitalize"
              >
                {genre.replace("-", " ")}
              </Button>
            ))}
          </div>
          <div className="flex gap-4 mt-6">
            <Button
              onClick={handleRefresh}
              disabled={loading || selectedGenres.length === 0}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Refreshing...
                </>
              ) : (
                "Get Recommendations"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <h2 className="text-xl font-semibold">Recommended Tracks</h2>
          <div className="flex gap-2 w-full md:w-auto">
            <Input
              placeholder="Playlist name"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              className="md:w-64"
            />
            <Button
              onClick={handleCreatePlaylist}
              disabled={saving || !playlistName || recommendations.length === 0}
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span className="ml-2">Save as Playlist</span>
            </Button>
          </div>
        </div>

        {success && (
          <Alert>
            <AlertDescription className="text-green-500">
              Playlist created successfully! Check your Spotify account.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TrackCardSkeleton key={i} />
            ))
          ) : recommendations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Select some genres and click "Get Recommendations" to discover new music
            </div>
          ) : (
            recommendations.map((track) => (
              <TrackCard
                key={track.id}
                name={track.name}
                artists={track.artists.map((artist) => artist.name)}
                albumArt={track.album.images[0]?.url}
                previewUrl={track.preview_url}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
} 