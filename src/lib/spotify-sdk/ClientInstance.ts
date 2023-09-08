"use client";

import { AuthUser } from "@/app/api/auth/[...nextauth]/authOptions";
import {
  AccessToken,
  IAuthStrategy,
  IHandleErrors,
  SdkConfiguration,
  SdkOptions,
  SpotifyApi,
} from "@spotify/web-api-ts-sdk";
import { getSession, signIn, signOut } from "next-auth/react";

/**
 * A class that implements the IAuthStrategy interface and wraps the NextAuth functionality.
 * It retrieves the access token and other information from the JWT session handled by NextAuth.
 */
class NextAuthStrategy implements IAuthStrategy {
  public getOrCreateAccessToken(): Promise<AccessToken> {
    return this.getAccessToken();
  }

  public async getAccessToken(): Promise<AccessToken> {
    const session: any = await getSession();
    if (!session) {
      return {} as AccessToken;
    }

    if (session?.error === "RefreshAccessTokenError") {
      console.info("[Spotify-SDK][INFO]\nRefreshing access token");
      await signIn();
      return this.getAccessToken();
    }

    const { user }: { user: AuthUser } = session;

    return {
      access_token: user.access_token,
      token_type: "Bearer",
      expires_in: user.expires_in,
      expires: user.expires_at,
      refresh_token: user.refresh_token,
    } as AccessToken;
  }

  public removeAccessToken(): void {
    console.warn("[Spotify-SDK][WARN]\nremoveAccessToken not implemented");
  }

  public setConfiguration(configuration: SdkConfiguration): void {
    console.warn("[Spotify-SDK][WARN]\nsetConfiguration not implemented");
  }
}

function withNextAuthStrategy(config?: SdkOptions) {
  const strategy = new NextAuthStrategy();
  return new SpotifyApi(strategy, config);
}

class ClientErrorHandler implements IHandleErrors {
  public async handleErrors(error: any) {
    console.error("[Spotify-SDK][ERROR]", error);
    await signOut();
    return false;
  }
}

const config: SdkOptions = {
  errorHandler: new ClientErrorHandler(),
};

export default withNextAuthStrategy(config);
