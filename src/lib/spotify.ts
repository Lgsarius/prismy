import SpotifyWebApi from "spotify-web-api-node";

export const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

export const setAccessToken = (token: string) => {
  spotifyApi.setAccessToken(token);
};

// Utility functions for common Spotify API calls
export const getCurrentUserProfile = async () => {
  const response = await spotifyApi.getMe();
  return response.body;
};

export const getTopTracks = async (timeRange: "short_term" | "medium_term" | "long_term" = "medium_term") => {
  const response = await spotifyApi.getMyTopTracks({ time_range: timeRange, limit: 50 });
  return response.body.items;
};

export const getTopArtists = async (timeRange: "short_term" | "medium_term" | "long_term" = "medium_term") => {
  const response = await spotifyApi.getMyTopArtists({ time_range: timeRange, limit: 50 });
  return response.body.items;
};

export const getRecentlyPlayed = async () => {
  const response = await spotifyApi.getMyRecentlyPlayedTracks({ limit: 50 });
  return response.body.items;
};

// New utility functions for enhanced features

// Get detailed artist analysis including genres and related artists
export const getArtistAnalysis = async (artistId: string) => {
  const [artist, topTracks, relatedArtists] = await Promise.all([
    spotifyApi.getArtist(artistId),
    spotifyApi.getArtistTopTracks(artistId, 'US'),
    spotifyApi.getArtistRelatedArtists(artistId),
  ]);

  return {
    artist: artist.body,
    topTracks: topTracks.body.tracks,
    relatedArtists: relatedArtists.body.artists,
  };
};

// Get personalized recommendations based on seeds
export const getRecommendations = async (options: {
  seedTracks?: string[];
  seedArtists?: string[];
  seedGenres?: string[];
  limit?: number;
}) => {
  const response = await spotifyApi.getRecommendations({
    seed_tracks: options.seedTracks,
    seed_artists: options.seedArtists,
    seed_genres: options.seedGenres,
    limit: options.limit || 20,
  });
  return response.body.tracks;
};

// Get available genres for recommendations
export const getAvailableGenres = async () => {
  const response = await spotifyApi.getAvailableGenreSeeds();
  return response.body.genres;
};

// Get detailed listening history analysis
export const getListeningHistoryAnalysis = async () => {
  const recentTracks = await getRecentlyPlayed();
  const uniqueArtists = new Set();
  const uniqueTracks = new Set();
  const genreCounts: Record<string, number> = {};
  const timeOfDayCounts: Record<string, number> = {};

  for (const item of recentTracks) {
    // Count unique artists and tracks
    uniqueArtists.add(item.track.artists[0].id);
    uniqueTracks.add(item.track.id);

    // Analyze time of day
    const hour = new Date(item.played_at).getHours();
    const timeOfDay = 
      hour >= 5 && hour < 12 ? 'morning' :
      hour >= 12 && hour < 17 ? 'afternoon' :
      hour >= 17 && hour < 22 ? 'evening' : 'night';
    
    timeOfDayCounts[timeOfDay] = (timeOfDayCounts[timeOfDay] || 0) + 1;
  }

  return {
    uniqueArtistsCount: uniqueArtists.size,
    uniqueTracksCount: uniqueTracks.size,
    timeOfDayDistribution: timeOfDayCounts,
  };
};

// Create a playlist with recommendations
export const createRecommendedPlaylist = async (
  userId: string,
  name: string,
  description: string,
  tracks: string[]
) => {
  const playlist = await spotifyApi.createPlaylist(userId, {
    name,
    description,
    public: false,
  });

  if (tracks.length > 0) {
    await spotifyApi.addTracksToPlaylist(playlist.body.id, tracks);
  }

  return playlist.body;
}; 