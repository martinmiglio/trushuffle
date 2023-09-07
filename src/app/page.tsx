"use client";

import Player from "@/components/spotify/Player";
import PlaylistSelector from "@/components/spotify/PlaylistSelector";
import { Playlist } from "@spotify/web-api-ts-sdk";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function Page() {
  const session = useSession();

  const [playlist, setPlaylist] = useState<Playlist | null>(null);

  if (!session || session.status !== "authenticated") {
    return <></>;
  }
  return (
    <div className="flex flex-col gap-2">
      <Player playlist={playlist} />
      <PlaylistSelector playlist={playlist} setPlaylist={setPlaylist} />
    </div>
  );
}
