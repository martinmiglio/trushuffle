// This exists only in a dream world where NextAuth sends the access token in the session to the server
import { AuthUser } from "@/app/api/auth/[...nextauth]/authOptions";
import {
  AccessToken,
  IAuthStrategy,
  SdkConfiguration,
  SdkOptions,
  SpotifyApi,
} from "@spotify/web-api-ts-sdk";
import { getServerSession } from "next-auth/next";

/**
 * A class that implements the IAuthStrategy interface and wraps the NextAuth functionality.
 * It retrieves the access token and other information from the JWT session handled by NextAuth.
 */
class NextAuthStrategy implements IAuthStrategy {
  public getOrCreateAccessToken(): Promise<AccessToken> {
    return this.getAccessToken();
  }

  public async getAccessToken(): Promise<AccessToken> {
    const session: any = await getServerSession();
    if (!session) {
      return {} as AccessToken;
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
    console.warn("removeAccessToken not implemented");
  }

  public setConfiguration(configuration: SdkConfiguration): void {
    console.warn("setConfiguration not implemented");
  }
}

function withNextAuthStrategy(config?: SdkOptions) {
  const strategy = new NextAuthStrategy();
  return new SpotifyApi(strategy, config);
}

// export default withNextAuthStrategy();

// could be used like this:
/*
import sdk from "@/sdk/ServerInstance";

export default async function ServerSearchDisplay() {
  const items = await sdk.search("The Beatles", ["artist"]);

  return (
    <div>
      <h1>SearchDisplay</h1>
      <pre>{JSON.stringify(items, null, 2)}</pre>
    </div>
  );
}
*/
