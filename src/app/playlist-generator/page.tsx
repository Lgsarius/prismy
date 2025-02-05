"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { setAccessToken, spotifyApi } from "@/lib/spotify";
import { Loader2 } from "lucide-react";

export default function PlaylistGenerator() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [playlistName, setPlaylistName] = useState("");
  const [playlistType, setPlaylistType] = useState("top_tracks");
  const [timeRange, setTimeRange] = useState("medium_term");
  const [success, setSuccess] = useState(false);

  async function handleCreatePlaylist() {
    if (!session?.accessToken || !playlistName) return;

    setLoading(true);
    setSuccess(false);
    setAccessToken(session.accessToken as string);

    try {
      // Get user ID
      const user = await spotifyApi.getMe();
      
      // Create empty playlist
      const playlist = await spotifyApi.createPlaylist(user.body.id, {
        name: playlistName,
        description: `Generated from your ${playlistType === 'top_tracks' ? 'top tracks' : 'top artists'} (${timeRange === 'short_term' ? 'last 4 weeks' : timeRange === 'medium_term' ? 'last 6 months' : 'all time'})`,
        public: false,
      });

      // Get tracks to add
      let tracksToAdd: string[] = [];
      if (playlistType === "top_tracks") {
        const topTracks = await spotifyApi.getMyTopTracks({ time_range: timeRange, limit: 50 });
        tracksToAdd = topTracks.body.items.map(track => track.uri);
      } else {
        const topArtists = await spotifyApi.getMyTopArtists({ time_range: timeRange, limit: 5 });
        for (const artist of topArtists.body.items) {
          const artistTracks = await spotifyApi.getArtistTopTracks(artist.id, "US");
          tracksToAdd.push(...artistTracks.body.tracks.slice(0, 10).map(track => track.uri));
        }
      }

      // Add tracks to playlist
      await spotifyApi.addTracksToPlaylist(playlist.body.id, tracksToAdd);
      setSuccess(true);
    } catch (error) {
      console.error("Error creating playlist:", error);
    }

    setLoading(false);
  }

  if (!session) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Please sign in to generate playlists</h1>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Playlist Generator</h1>
        <p className="text-muted-foreground mt-2">
          Create custom playlists based on your listening history
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New Playlist</CardTitle>
          <CardDescription>
            Choose your preferences and create a personalized playlist
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Playlist Name</Label>
            <Input
              id="name"
              placeholder="Enter playlist name"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Playlist Type</Label>
            <Select value={playlistType} onValueChange={setPlaylistType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="top_tracks">Based on Top Tracks</SelectItem>
                <SelectItem value="top_artists">Based on Top Artists</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Time Range</Label>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="short_term">Last 4 Weeks</SelectItem>
                <SelectItem value="medium_term">Last 6 Months</SelectItem>
                <SelectItem value="long_term">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            className="w-full"
            onClick={handleCreatePlaylist}
            disabled={loading || !playlistName}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Playlist...
              </>
            ) : (
              "Create Playlist"
            )}
          </Button>

          {success && (
            <p className="text-green-500 text-center">
              Playlist created successfully! Check your Spotify account.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 