import SpotifyWebApi from "spotify-web-api-node";
import { signIn } from "next-auth/react";

// Fallback genres if the API call fails
const FALLBACK_GENRES = [
  "pop", "rock", "hip-hop", "electronic", "indie", 
  "jazz", "classical", "r-n-b", "metal", "folk",
  "alternative", "ambient", "blues", "country", "dance",
  "disco", "funk", "gospel", "grunge", "house",
  "punk", "reggae", "soul", "techno", "world-music"
];

export const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

export const setAccessToken = (token: string) => {
  spotifyApi.setAccessToken(token);
};

// Wrapper function to handle API calls with retries
async function handleSpotifyApiCall<T>(apiCall: () => Promise<T>, errorContext?: string): Promise<T> {
  try {
    const response = await apiCall();
    return response;
  } catch (err) {
    // Handle null error case
    if (!err) {
      console.error(`Spotify API Error${errorContext ? ` (${errorContext})` : ''}: Unknown error (null)}`);
      throw new Error('An unknown error occurred');
    }

    // Ensure error is an object with expected properties
    const error = err as any;
    
    // Handle different error response formats
    const errorStatus = 
      error?.statusCode || // Direct status code
      error?.body?.error?.status || // Spotify API error format
      (error.response?.statusCode) || // Superagent error format
      500; // Default to 500 if no status found

    const errorMessage = 
      error?.body?.error?.message || // Spotify API error format
      error?.message || // Direct error message
      error?.response?.text || // Superagent error text
      'An unknown error occurred'; // Default message

    console.error(`Spotify API Error${errorContext ? ` (${errorContext})` : ''}:`, {
      status: errorStatus,
      message: errorMessage,
      error: error
    });

    // Special handling for genre seeds 404
    if (errorStatus === 404 && errorContext === "getAvailableGenres") {
      return { body: { genres: FALLBACK_GENRES } } as T;
    }

    if (errorStatus === 401) {
      // Token expired, trigger sign in to refresh token
      await signIn("spotify");
      throw new Error("Session expired. Please try again.");
    }

    if (errorStatus === 404) {
      throw new Error("The requested resource was not found. Please try again with different parameters.");
    }

    if (errorStatus === 429) {
      throw new Error("Too many requests. Please try again later.");
    }

    throw new Error(errorMessage);
  }
}

// Utility functions for common Spotify API calls
export const getCurrentUserProfile = async () => {
  const response = await handleSpotifyApiCall(
    () => spotifyApi.getMe(),
    "getCurrentUserProfile"
  );
  return response.body;
};

export const getTopTracks = async (timeRange: "short_term" | "medium_term" | "long_term" = "medium_term") => {
  const response = await handleSpotifyApiCall(
    () => spotifyApi.getMyTopTracks({ time_range: timeRange, limit: 50 }),
    `getTopTracks(${timeRange})`
  );
  return response.body.items;
};

export const getTopArtists = async (timeRange: "short_term" | "medium_term" | "long_term" = "medium_term") => {
  const response = await handleSpotifyApiCall(
    () => spotifyApi.getMyTopArtists({ time_range: timeRange, limit: 50 }),
    `getTopArtists(${timeRange})`
  );
  return response.body.items;
};

export const getRecentlyPlayed = async () => {
  const response = await handleSpotifyApiCall(
    () => spotifyApi.getMyRecentlyPlayedTracks({ limit: 50 }),
    "getRecentlyPlayed"
  );
  return response.body.items;
};

// New utility functions for enhanced features

// Get detailed artist analysis including genres and related artists
export const getArtistAnalysis = async (artistId: string) => {
  try {
    // First get the main artist data
    const artist = await handleSpotifyApiCall(
      () => spotifyApi.getArtist(artistId),
      `getArtist(${artistId})`
    );

    // Then try to get additional data, but don't fail if some parts are unavailable
    let topTracks = { body: { tracks: [] } };
    let relatedArtists = { body: { artists: [] } };

    try {
      topTracks = await handleSpotifyApiCall(
        () => spotifyApi.getArtistTopTracks(artistId, 'US'),
        `getArtistTopTracks(${artistId})`
      );
    } catch (error) {
      console.warn(`Could not fetch top tracks for artist ${artistId}:`, error);
    }

    try {
      relatedArtists = await handleSpotifyApiCall(
        () => spotifyApi.getArtistRelatedArtists(artistId),
        `getArtistRelatedArtists(${artistId})`
      );
    } catch (error) {
      console.warn(`Could not fetch related artists for artist ${artistId}:`, error);
    }

    return {
      artist: artist.body,
      topTracks: topTracks.body.tracks,
      relatedArtists: relatedArtists.body.artists,
    };
  } catch (error: any) {
    console.error("Error in getArtistAnalysis:", error);
    throw error;
  }
};

// Get personalized recommendations based on seeds
export const getRecommendations = async (options: {
  seedTracks?: string[];
  seedArtists?: string[];
  seedGenres?: string[];
  limit?: number;
}) => {
  const response = await handleSpotifyApiCall(
    () => spotifyApi.getRecommendations({
      seed_tracks: options.seedTracks || [],
      seed_artists: options.seedArtists || [],
      seed_genres: options.seedGenres || [],
      limit: options.limit || 20,
    }),
    "getRecommendations"
  );
  return response.body.tracks;
};

// Get available genres for recommendations
export const getAvailableGenres = async () => {
  try {
    const response = await handleSpotifyApiCall(
      () => spotifyApi.getAvailableGenreSeeds(),
      "getAvailableGenres"
    );
    if (!response?.body?.genres || response.body.genres.length === 0) {
      console.warn("No genres returned from Spotify API, using fallback genres");
      return FALLBACK_GENRES;
    }
    return response.body.genres;
  } catch (error) {
    console.warn("Failed to fetch genres from Spotify API, using fallback genres:", error);
    return FALLBACK_GENRES;
  }
};

// Get detailed listening history analysis
export const getListeningHistoryAnalysis = async () => {
  try {
    const recentTracks = await getRecentlyPlayed();
    if (!recentTracks || recentTracks.length === 0) {
      throw new Error("No recent tracks found");
    }

    const uniqueArtists = new Set();
    const uniqueTracks = new Set();
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
  } catch (error: any) {
    console.error("Error in getListeningHistoryAnalysis:", error);
    throw new Error(error?.message || "Failed to analyze listening history");
  }
};

// Utility functions for playlist management
export const getUserPlaylists = async (options?: { limit?: number; offset?: number }) => {
  const response = await handleSpotifyApiCall(
    () => spotifyApi.getUserPlaylists(options),
    "getUserPlaylists"
  );
  return response.body;
};

export const getPlaylistTracks = async (playlistId: string, options?: { limit?: number; offset?: number }) => {
  const response = await handleSpotifyApiCall(
    () => spotifyApi.getPlaylistTracks(playlistId, {
      limit: options?.limit,
      offset: options?.offset,
      fields: 'items(added_at,track(id,name,artists,album)),total'
    }),
    `getPlaylistTracks(${playlistId})`
  );
  return response.body;
};

export const createRecommendedPlaylist = async (
  userId: string,
  name: string,
  description: string,
  tracks: string[]
) => {
  try {
    const playlist = await handleSpotifyApiCall(
      () => spotifyApi.createPlaylist(userId, {
        name: name,
        description: description,
        collaborative: false,
        public: false
      } as any), // Type assertion needed due to incomplete types in spotify-web-api-node
      `createPlaylist(${userId})`
    );

    if (tracks.length > 0) {
      await handleSpotifyApiCall(
        () => spotifyApi.addTracksToPlaylist(playlist.body.id, tracks),
        `addTracksToPlaylist(${playlist.body.id})`
      );
    }

    return playlist.body;
  } catch (error: any) {
    console.error("Error in createRecommendedPlaylist:", error);
    throw new Error(error?.message || "Failed to create playlist");
  }
}; 