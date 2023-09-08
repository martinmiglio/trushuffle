"use client";

import Image from "../atomic/Image";
import Loading from "../atomic/Loading";
import sdk from "@/lib/spotify-sdk/ClientInstance";
import {
  LikedTracksPlaylist,
  StandardizedPlaylist,
  Playlist,
} from "@/lib/spotify-sdk/Playlists";
import { Page, SimplifiedPlaylist } from "@spotify/web-api-ts-sdk";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";

export default function PlaylistSelector({
  selectedPlaylist,
  setSelectedPlaylist,
}: {
  selectedPlaylist: StandardizedPlaylist | null;
  setSelectedPlaylist: (playlist: StandardizedPlaylist) => void;
}) {
  const [userPlaylists, setUserPlaylists] = useState<StandardizedPlaylist[]>([
    new LikedTracksPlaylist(),
  ]);
  const [hasMorePosts, setHasMorePosts] = useState(true);

  const loadMorePosts = async (page: number) => {
    // get the next page of playlists
    const res: Page<SimplifiedPlaylist> =
      await sdk.currentUser.playlists.playlists(10, (page - 1) * 10);

    if (res.items.length === 0) {
      setHasMorePosts(false);
      return;
    }

    // get the full playlist data for each playlist
    const fullPlaylists: StandardizedPlaylist[] = [];
    for (const playlist of res.items) {
      fullPlaylists.push(
        new Playlist(await sdk.playlists.getPlaylist(playlist.id)),
      );
    }

    setUserPlaylists([...userPlaylists, ...fullPlaylists]);
  };

  // when a playlist is selected, we want to move it to the top of the list
  useEffect(() => {
    if (!selectedPlaylist) {
      return;
    }

    setUserPlaylists((prevPlaylists) => {
      const newPlaylists = prevPlaylists.filter(
        (curPlaylist) => curPlaylist.id !== selectedPlaylist.id,
      );
      newPlaylists.unshift(selectedPlaylist);
      return newPlaylists;
    });
  }, [selectedPlaylist]);

  return (
    <InfiniteScroll
      pageStart={0}
      loadMore={loadMorePosts}
      hasMore={hasMorePosts}
      className="flex flex-col gap-2"
      loader={
        <div className="mx-auto h-16" key="loader">
          <Loading />
        </div>
      }
    >
      {userPlaylists.map((curPlaylist) => (
        <PlaylistButton
          key={curPlaylist.id}
          playlist={curPlaylist}
          onClick={() => {
            setSelectedPlaylist(curPlaylist);
          }}
          selected={curPlaylist.id === selectedPlaylist?.id}
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
  playlist: StandardizedPlaylist;
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
      <div className="flex-1">{playlist.name}</div>
    </span>
  );
}
