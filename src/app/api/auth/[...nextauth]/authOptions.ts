import { Account, AuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import SpotifyProvider from "next-auth/providers/spotify";
import { z } from "zod";

const schema = z.object({
  NEXTAUTH_SECRET: z.string(),
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

export type AuthUser = {
  name: string;
  email: string;
  image: string;
  access_token: string;
  token_type: string;
  expires_at: number;
  expires_in: number;
  refresh_token: string;
  scope: string;
  id: string;
};

const authOptions: AuthOptions = {
  providers: [spotifyProfile],
  session: {
    maxAge: 5 * 24 * 60 * 60, // 5 days
  },
  callbacks: {
    async jwt({ token, account }: { token: JWT; account: Account | null }) {
      if (account) {
        token.access_token = account.access_token;
        token.token_type = account.token_type;
        token.expires_at = account.expires_at;
        token.expires_in = account.expires_at ?? 0 - Date.now() / 1000;
        token.refresh_token = account.refresh_token;
        token.scope = account.scope;
        token.id = account.providerAccountId;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      const { user }: { user: AuthUser } = session;
      user.access_token = token.access_token;
      user.token_type = token.token_type;
      user.expires_at = token.expires_at;
      user.expires_in = token.expires_in;
      user.refresh_token = token.refresh_token;
      user.scope = token.scope;
      user.id = token.id;
      session.user = user;
      return session;
    },
  },
  debug: process.env.NODE_ENV === "development",
  secret: env.NEXTAUTH_SECRET,
};

export default authOptions;
