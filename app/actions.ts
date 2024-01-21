"use server";

import { redirect } from "next/navigation";
import SpotifyWebApi from "spotify-web-api-node";
import { MissedTrack } from "./_types/tracks";

const scopes = [
  "user-read-private",
  "user-read-email",
  "playlist-read-private",
  "playlist-read-collaborative",
  "playlist-modify-private",
  "playlist-modify-public",
];

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: `${
    process.env.BASE_URL || "http://localhost:3000"
  }/shopify-auth-callback`,
});

export async function handleSpotifyAuthCheck({
  username,
}: {
  username: string;
}) {
  const redirectUri = spotifyApi.createAuthorizeURL(scopes, username);
  if (redirectUri) {
    redirect(redirectUri);
  }
}

export async function generateplaylist({
  username,
  code,
}: {
  username: string;
  code: string;
}) {
  const lovedTracks = await getLovedTracks({ username, limit: 1000 });
  const tracks = lovedTracks.lovedtracks.track;

  const result = await spotifyApi.authorizationCodeGrant(code);
  const accessToken = result.body["access_token"];
  const refreshToken = result.body["refresh_token"];
  await spotifyApi.setAccessToken(accessToken);
  await spotifyApi.setRefreshToken(refreshToken);

  const playlistResult = await spotifyApi.createPlaylist(username, {
    // wtf this is valid
    // @ts-expect-error
    name: "Last.fm Loved Tracks",
    description: "A playlist of your loved tracks from Last.fm",
    public: true,
  });

  const missedTracks = [] as MissedTrack[];

  const trackSearchResult = await Promise.all(
    tracks.splice(0, 100).map(async (track) => {
      const trackSearchResults = await spotifyApi.searchTracks(
        track.artist.name
      );

      const foundTrack = trackSearchResults.body.tracks.items.find(
        (searchTrack) =>
          searchTrack.artists[0].name
            .toLowerCase()
            .includes(track.artist.name.toLowerCase())
      );

      if (foundTrack?.uri) {
        return foundTrack.uri;
      } else {
        missedTracks.push({
          name: track.name,
          artist: track.artist.name,
        });
      }
    })
  );

  await spotifyApi.addTracksToPlaylist(
    playlistResult.body.id,
    trackSearchResult.filter((item) => Boolean(item))
  );

  return {
    missedTracks,
    playlistId: playlistResult.body.id,
  };
}

export async function getLovedTracks({
  username,
  limit = 1,
}: {
  username?: string;
  limit?: number;
}) {
  const response = await fetch(
    `http://ws.audioscrobbler.com/2.0/?method=user.getlovedtracks&user=${username}&api_key=${process.env.LAST_FM_API_KEY}&format=json&limit=${limit}`
  );
  const data = await response.json();
  if (data.lovedtracks?.track?.length > 0) {
    return data;
  } else {
    redirect("?error=No loved tracks found");
  }
}

export async function getLovedTracksAndRedirect(formData: FormData) {
  const username = formData?.get("username")?.toString();
  if (!username) {
    redirect("/?error=Please enter a valid username");
  }
  const data = await getLovedTracks({ username });
  if (data.lovedtracks?.track?.length > 0) {
    redirect(`/user/${username}`);
  } else {
    redirect("?error=No loved tracks found");
  }
}
