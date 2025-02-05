"use client";

// @ts-nocheck /* Disable TypeScript checking for this file */
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArtistCard } from "@/components/spotify/artist-card";
import { TrackCard } from "@/components/spotify/track-card";
import { setAccessToken, getTopArtists, getArtistAnalysis } from "@/lib/spotify";
import { Loader2, Music2, Users, Disc3 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface ArtistAnalysis {
  artist: SpotifyApi.SingleArtistResponse;
  topTracks: SpotifyApi.TrackObjectFull[];
  relatedArtists: SpotifyApi.ArtistObjectFull[];
}

export default function ArtistAnalysis() {
  const { data: session, status } = useSession();
  const [topArtists, setTopArtists] = useState<SpotifyApi.ArtistObjectFull[]>([]);
  const [selectedArtist, setSelectedArtist] = useState<string | null>(null);
  const [artistAnalysis, setArtistAnalysis] = useState<ArtistAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTopArtists() {
      if (!session?.accessToken) return;

      setLoading(true);
      setError(null);

      try {
        setAccessToken(session.accessToken as string);
        const artists = await getTopArtists("medium_term");
        setTopArtists(artists);
        
        // Automatically analyze the first artist
        if (artists.length > 0) {
          await analyzeArtist(artists[0].id);
        }
      } catch (error) {
        console.error("Error fetching top artists:", error);
        setError("Failed to load your top artists. Please try again later.");
      }

      setLoading(false);
    }

    fetchTopArtists();
  }, [session]);

  const analyzeArtist = async (artistId: string) => {
    if (!session?.accessToken) return;

    setAnalyzing(true);
    setError(null);
    setSelectedArtist(artistId);

    try {
      setAccessToken(session.accessToken as string);
      const analysis = await getArtistAnalysis(artistId);
      setArtistAnalysis(analysis);
    } catch (error) {
      console.error("Error analyzing artist:", error);
      setError("Failed to analyze artist. Please try again.");
    }

    setAnalyzing(false);
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
        <h1 className="text-2xl font-bold mb-4">Please sign in to analyze your artists</h1>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Artist Analysis</h1>
        <p className="text-sm md:text-base text-muted-foreground mt-2">
          Deep dive into your favorite artists and their musical connections
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid md:grid-cols-[300px_1fr] gap-8">
        {/* Artist List */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Your Top Artists</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="animate-pulse space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-16 bg-muted rounded" />
                ))}
              </div>
            ) : (
              topArtists.map((artist) => (
                <Button
                  key={artist.id}
                  variant={selectedArtist === artist.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => analyzeArtist(artist.id)}
                >
                  {artist.name}
                </Button>
              ))
            )}
          </CardContent>
        </Card>

        {/* Analysis Content */}
        <div className="space-y-6">
          {analyzing ? (
            <Card>
              <CardContent className="py-8">
                <div className="flex flex-col items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin mb-4" />
                  <p>Analyzing artist...</p>
                </div>
              </CardContent>
            </Card>
          ) : artistAnalysis ? (
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="top-tracks">Top Tracks</TabsTrigger>
                <TabsTrigger value="related">Related Artists</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Followers</p>
                          <p className="font-medium">
                            {artistAnalysis.artist.followers.total.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Music2 className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Genres</p>
                          <p className="font-medium capitalize">
                            {artistAnalysis.artist.genres.slice(0, 2).join(", ")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Disc3 className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Popularity</p>
                          <p className="font-medium">{artistAnalysis.artist.popularity}/100</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="top-tracks">
                <div className="space-y-4">
                  {artistAnalysis.topTracks.map((track) => (
                    <TrackCard
                      key={track.id}
                      name={track.name}
                      artists={track.artists.map((artist) => artist.name)}
                      albumArt={track.album.images[0]?.url}
                      previewUrl={track.preview_url}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="related">
                <div className="grid gap-4">
                  {artistAnalysis.relatedArtists.map((artist) => (
                    <ArtistCard
                      key={artist.id}
                      name={artist.name}
                      imageUrl={artist.images[0]?.url}
                      genres={artist.genres}
                      followers={artist.followers.total}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <Card>
              <CardContent className="py-8">
                <div className="text-center text-muted-foreground">
                  Select an artist to see detailed analysis
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 