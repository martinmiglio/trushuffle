"use client";

import Image from "../atomic/Image";
import sdk from "@/sdk/ClientInstance";
import { SimplifiedPlaylist } from "@spotify/web-api-ts-sdk";
import { useState } from "react";
import InfiniteScroll from "react-infinite-scroller";

export default function PlaylistSelector() {
  const [userPlaylists, setUserPlaylists] = useState<SimplifiedPlaylist[]>([]);
  const [hasMorePosts, setHasMorePosts] = useState(true);

  const loadMorePosts = async (page: number) => {
    const pageSize = 15;

    const res = await sdk.currentUser.playlists.playlists(
      pageSize,
      (page - 1) * pageSize,
    );

    if (res.items.length === 0) {
      setHasMorePosts(false);
      return;
    }

    setUserPlaylists([...userPlaylists, ...res.items]);
  };

  return (
    <InfiniteScroll
      pageStart={0}
      loadMore={loadMorePosts}
      hasMore={hasMorePosts}
    >
      {userPlaylists.map((playlist) => (
        <PlaylistButton key={playlist.id} playlist={playlist} />
      ))}
    </InfiniteScroll>
  );
}

function PlaylistButton({ playlist }: { playlist: SimplifiedPlaylist }) {
  return (
    <span className="w-full flex items-center rounded-lg hover:bg-theme-600">
      <div className="m-2 h-16 w-16 overflow-hidden rounded-md">
        <Image
          src={playlist.images[0]?.url ?? `https://via.placeholder.com/64`}
          width={64}
          height={64}
          alt={`${playlist.name} cover`}
          className="object-cover h-full w-full"
          priority
          quality={100}
        />
      </div>
      <div>{playlist.name}</div>
    </span>
  );
}
