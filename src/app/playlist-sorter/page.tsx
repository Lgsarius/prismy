"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { setAccessToken, spotifyApi } from "@/lib/spotify";
import { Search, Music2, Calendar, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PlaylistWithTracks extends SpotifyApi.PlaylistObjectSimplified {
  trackCount: number;
  lastUpdated: string;
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
    async function fetchPlaylists() {
      if (status === "loading") return;
      if (!session?.accessToken) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        setAccessToken(session.accessToken as string);
        
        // First, get the total number of playlists
        const initialResponse = await spotifyApi.getUserPlaylists({ limit: 1 });
        const total = initialResponse.body.total;

        // Fetch all playlists using pagination
        const allPlaylists: SpotifyApi.PlaylistObjectSimplified[] = [];
        for (let offset = 0; offset < total; offset += 50) {
          const response = await spotifyApi.getUserPlaylists({ limit: 50, offset });
          allPlaylists.push(...response.body.items);
        }

        // Get details for each playlist
        const playlistsWithDetails = await Promise.all(
          allPlaylists.map(async (playlist) => {
            try {
              const tracks = await spotifyApi.getPlaylistTracks(playlist.id, {
                limit: 1,
                fields: "total,items.added_at",
              });
              return {
                ...playlist,
                trackCount: tracks.body.total,
                lastUpdated: tracks.body.items[0]?.added_at || playlist.snapshot_id,
              };
            } catch (error) {
              console.error(`Error fetching tracks for playlist ${playlist.name}:`, error);
              return {
                ...playlist,
                trackCount: 0,
                lastUpdated: playlist.snapshot_id,
              };
            }
          })
        );

        setPlaylists(playlistsWithDetails);
      } catch (error) {
        console.error("Error fetching playlists:", error);
        setError("Failed to load playlists. Please try again later.");
      }

      setLoading(false);
    }

    fetchPlaylists();
  }, [session, status]);

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

      <div className="flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search playlists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
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

      <div className="grid gap-3">
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
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{playlist.name}</h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <Music2 className="h-4 w-4 flex-shrink-0" />
                        {playlist.trackCount} tracks
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 flex-shrink-0" />
                        {new Date(playlist.lastUpdated).toLocaleDateString()}
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
                    onClick={() => window.open(playlist.external_urls.spotify, "_blank")}
                  >
                    Open in Spotify
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
} 