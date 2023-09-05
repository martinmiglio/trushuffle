import { JWT } from "next-auth/jwt";
import SpotifyProvider from "next-auth/providers/spotify";
import { z } from "zod";

const schema = z.object({
  SPOTIFY_CLIENT_ID: z.string(),
  SPOTIFY_CLIENT_SECRET: z.string(),
});

const env = schema.parse(process.env);

const spotifyProfile = SpotifyProvider({
  clientId: env.SPOTIFY_CLIENT_ID,
  clientSecret: env.SPOTIFY_CLIENT_SECRET,
  profile(profile) {
    type SpotyifyImage = { url: string; height: number; width: number };
    const images = profile.images as SpotyifyImage[];
    const image = images.reduce((prev, current) => {
      return prev.height > current.height ? prev : current;
    });
    return {
      id: profile.id,
      name: profile.display_name,
      email: profile.email,
      image: image.url,
    };
  },
});

const authURL = new URL("https://accounts.spotify.com/authorize");

const scopes = [
  "user-read-email",
  "user-read-private",
  "user-read-playback-state",
  "user-library-read",
  "user-modify-playback-state",
  "playlist-read-private",
  "playlist-read-collaborative",
];

authURL.searchParams.append(
  "scope",
  scopes.map((scope) => encodeURIComponent(scope)).join(" "),
);

spotifyProfile.authorization = authURL.toString();

export default spotifyProfile;

export async function refreshAccessToken(token: JWT) {
  try {
    const response = await fetch(authURL, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      access_token: refreshedTokens.access_token,
      token_type: refreshedTokens.token_type,
      expires_at: refreshedTokens.expires_at,
      expires_in: refreshedTokens.expires_at ?? 0 - Date.now() / 1000,
      refresh_token: refreshedTokens.refresh_token ?? token.refreshToken,
      scope: refreshedTokens.scope,
    };
  } catch (error) {
    console.error(error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}
