"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { setAccessToken, spotifyApi } from "@/lib/spotify";
import { Search, Music2, Calendar, AlertCircle, ExternalLink, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TrackCard } from "@/components/spotify/track-card";

interface PlaylistWithTracks extends SpotifyApi.PlaylistObjectSimplified {
  trackCount: number;
  lastUpdated: string;
  tracks?: SpotifyApi.PlaylistTrackObject[];
  isExpanded?: boolean;
  isLoadingTracks?: boolean;
}

export default function PlaylistSorter() {
  const { data: session, status } = useSession();
  const [playlists, setPlaylists] = useState<PlaylistWithTracks[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    async function fetchAllPlaylists() {
      if (!session?.accessToken) return;

      setLoading(true);
      setError(null);

      try {
        setAccessToken(session.accessToken);
        
        // First, get the total number of playlists
        const initialResponse = await spotifyApi.getUserPlaylists({ limit: 1 });
        const total = initialResponse.body.total;

        // Fetch all playlists in one go
        const allPlaylists: SpotifyApi.PlaylistObjectSimplified[] = [];
        const batchSize = 50; // Maximum allowed by Spotify API
        const batchPromises = [];

        for (let offset = 0; offset < total; offset += batchSize) {
          batchPromises.push(
            spotifyApi.getUserPlaylists({ limit: batchSize, offset })
          );
        }

        const batchResults = await Promise.all(batchPromises);
        batchResults.forEach(response => {
          allPlaylists.push(...response.body.items);
        });

        // Process all playlists
        const playlistsWithDetails = allPlaylists.map(playlist => ({
          ...playlist,
          trackCount: playlist.tracks.total,
          lastUpdated: playlist.snapshot_id
        }));

        setPlaylists(playlistsWithDetails);
        setError(null);
      } catch (error: any) {
        console.error("Error fetching playlists:", error);
        setError(error?.message || "Failed to load playlists. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    if (status === "authenticated") {
      fetchAllPlaylists();
    }
  }, [session, status]);

  const handlePlaylistClick = async (playlistId: string) => {
    setPlaylists(current =>
      current.map(p => ({
        ...p,
        isExpanded: p.id === playlistId ? !p.isExpanded : p.isExpanded
      }))
    );

    const playlist = playlists.find(p => p.id === playlistId);
    if (!playlist?.tracks && !playlist?.isLoadingTracks) {
      // Set loading state
      setPlaylists(current =>
        current.map(p => ({
          ...p,
          isLoadingTracks: p.id === playlistId ? true : p.isLoadingTracks
        }))
      );

      try {
        setAccessToken(session?.accessToken as string);
        const response = await spotifyApi.getPlaylistTracks(playlistId, {
          limit: 100,
          fields: 'items(track(id,name,artists(name),album(name,images)))'
        });

        if (!response?.body?.items) {
          throw new Error('No tracks found in response');
        }

        // Filter out any null tracks (can happen with unavailable tracks)
        const validTracks = response.body.items.filter(item => item && item.track);

        setPlaylists(current =>
          current.map(p => {
            if (p.id === playlistId) {
              return {
                ...p,
                tracks: validTracks,
                isLoadingTracks: false
              };
            }
            return p;
          })
        );
      } catch (error) {
        console.error("Error fetching playlist tracks:", error);
        setError("Failed to load playlist tracks. Please try again.");
        setPlaylists(current =>
          current.map(p => ({
            ...p,
            isLoadingTracks: p.id === playlistId ? false : p.isLoadingTracks,
            isExpanded: p.id === playlistId ? false : p.isExpanded
          }))
        );
      }
    }
  };

  const filteredAndSortedPlaylists = playlists
    .filter((playlist) =>
      playlist.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "tracks":
          comparison = a.trackCount - b.trackCount;
          break;
        case "date":
          comparison = new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime();
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Please sign in to view your playlists</h1>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Playlist Sorter</h1>
        <p className="text-sm md:text-base text-muted-foreground mt-2">
          Organize and sort your Spotify playlists ({playlists.length} total)
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filter & Sort</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search playlists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[120px] md:w-[140px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="tracks">Track Count</SelectItem>
                  <SelectItem value="date">Last Updated</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="px-3"
              >
                {sortOrder === "asc" ? "↑" : "↓"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <ScrollArea className="h-[60vh]">
        <div className="space-y-3 pr-4">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4 md:p-6">
                  <div className="h-4 bg-muted rounded w-1/3" />
                </CardContent>
              </Card>
            ))
          ) : filteredAndSortedPlaylists.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery ? "No playlists found matching your search" : "No playlists found"}
            </div>
          ) : (
            filteredAndSortedPlaylists.map((playlist) => (
              <Card
                key={playlist.id}
                className="hover:bg-accent transition-colors group"
              >
                <CardContent className="p-4 md:p-6">
                  <div 
                    className="flex flex-col gap-4"
                    onClick={() => handlePlaylistClick(playlist.id)}
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-4 cursor-pointer">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          {playlist.isExpanded ? (
                            <ChevronUp className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                          )}
                          <h3 className="font-semibold truncate">{playlist.name}</h3>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <Music2 className="h-4 w-4 flex-shrink-0" />
                            {playlist.trackCount} tracks
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 flex-shrink-0" />
                            Last updated: {new Date(playlist.lastUpdated).toLocaleDateString()}
                          </span>
                          {playlist.owner.id === session?.user?.id ? (
                            <span className="text-primary">Your playlist</span>
                          ) : (
                            <span className="truncate">By {playlist.owner.display_name}</span>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full md:w-auto"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(playlist.external_urls.spotify, "_blank");
                        }}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open in Spotify
                      </Button>
                    </div>

                    {playlist.isExpanded && (
                      <div className="border-t pt-4 mt-2">
                        {playlist.isLoadingTracks ? (
                          <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin" />
                          </div>
                        ) : playlist.tracks && playlist.tracks.length > 0 ? (
                          <div className="space-y-2">
                            {playlist.tracks.map((item, index) => {
                              if (!item?.track) return null;
                              return (
                                <TrackCard
                                  key={`${item.track.id || index}-${index}`}
                                  name={item.track.name || 'Unknown Track'}
                                  artists={item.track.artists?.map(a => a.name) || ['Unknown Artist']}
                                  albumArt={item.track.album?.images?.[0]?.url}
                                  rank={index + 1}
                                />
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-center py-4 text-muted-foreground">
                            No tracks found in this playlist
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
} 