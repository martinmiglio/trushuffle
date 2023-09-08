"use client";

import Player from "@/components/spotify/Player";
import PlaylistSelector from "@/components/spotify/PlaylistSelector";
import { StandardizedPlaylist } from "@/lib/spotify-sdk/Playlists";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function Page() {
  const session = useSession();

  const [selectedPlaylist, setSelectedPlaylist] =
    useState<StandardizedPlaylist | null>(null);

  if (!session || session.status !== "authenticated") {
    return <></>;
  }
  return (
    <div className="flex flex-col gap-2">
      <Player playlist={selectedPlaylist} />
      <PlaylistSelector
        selectedPlaylist={selectedPlaylist}
        setSelectedPlaylist={setSelectedPlaylist}
      />
    </div>
  );
}
