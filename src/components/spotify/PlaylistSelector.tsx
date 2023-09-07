"use client";

import Image from "../atomic/Image";
import sdk from "@/lib/spotify-sdk/ClientInstance";
import { Page, Playlist, SimplifiedPlaylist } from "@spotify/web-api-ts-sdk";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";

export default function PlaylistSelector({
  playlist,
  setPlaylist,
}: {
  playlist: Playlist | null;
  setPlaylist: (playlist: Playlist) => void;
}) {
  const [userPlaylists, setUserPlaylists] = useState<Playlist[]>([]);
  const [hasMorePosts, setHasMorePosts] = useState(true);

  const loadMorePosts = async (page: number) => {
    const pageSize = 15;

    const res: Page<SimplifiedPlaylist> =
      await sdk.currentUser.playlists.playlists(
        pageSize,
        (page - 1) * pageSize,
      );

    if (res.items.length === 0) {
      setHasMorePosts(false);
      return;
    }

    const fullPlaylists = await Promise.all(
      res.items.map((playlist) => sdk.playlists.getPlaylist(playlist.id)),
    );

    setUserPlaylists([...userPlaylists, ...fullPlaylists]);
  };

  // when a playlist is selected, we want to move it to the top of the list
  // this is done by removing it from the list and adding it to the top
  useEffect(() => {
    if (!playlist) {
      return;
    }

    setUserPlaylists((prevPlaylists) => {
      const newPlaylists = prevPlaylists.filter(
        (curPlaylist) => curPlaylist.id !== playlist.id,
      );
      newPlaylists.unshift(playlist);
      return newPlaylists;
    });
  }, [playlist]);

  return (
    <InfiniteScroll
      pageStart={0}
      loadMore={loadMorePosts}
      hasMore={hasMorePosts}
      className="flex flex-col gap-2"
    >
      {userPlaylists.map((curPlaylist) => (
        <PlaylistButton
          key={curPlaylist.id}
          playlist={curPlaylist}
          onClick={() => {
            setPlaylist(curPlaylist);
          }}
          selected={curPlaylist.id === playlist?.id}
        />
      ))}
    </InfiniteScroll>
  );
}

function PlaylistButton({
  playlist,
  onClick,
  selected,
}: {
  playlist: Playlist;
  onClick?: () => void;
  selected?: boolean;
}) {
  return (
    <span
      className={`w-full flex items-center rounded-lg hover:bg-theme-600 ${
        selected ? "border border-theme-100" : ""
      }`}
      onClick={onClick}
    >
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
