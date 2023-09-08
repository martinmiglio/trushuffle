"use client";

import { env } from "@/env/client";
import sdk from "@/lib/spotify-sdk/ClientInstance";
import { defaultPageLength, getAllPages } from "@/lib/spotify-sdk/Pagination";
import {
  Playlist as SpotifyPlaylist,
  Page,
  AddedBy,
  PlaylistedTrack,
  ExternalUrls,
  Followers,
  Image,
  UserReference,
  MaxInt,
  SavedTrack,
} from "@spotify/web-api-ts-sdk";

export interface StandardizedPlaylist extends SpotifyPlaylist {
  getPlaylistItems: (
    limit?: MaxInt<50>,
    offset?: number,
  ) => Promise<Page<PlaylistedTrack>>;
  getAllPlaylistItems: () => Promise<PlaylistedTrack[]>;
}

export class Playlist implements StandardizedPlaylist {
  collaborative: boolean;
  description: string;
  external_urls: ExternalUrls;
  followers: Followers;
  href: string;
  id: string;
  images: Image[];
  name: string;
  owner: UserReference;
  primary_color: string;
  public: boolean;
  snapshot_id: string;
  type: string;
  uri: string;
  tracks: Page<PlaylistedTrack>;

  constructor(playlist: SpotifyPlaylist) {
    // exaclty the same as the playlist interface
    this.collaborative = playlist.collaborative;
    this.description = playlist.description;
    this.external_urls = playlist.external_urls;
    this.followers = playlist.followers;
    this.href = playlist.href;
    this.id = playlist.id;
    this.images = playlist.images;
    this.name = playlist.name;
    this.owner = playlist.owner;
    this.primary_color = playlist.primary_color;
    this.public = playlist.public;
    this.snapshot_id = playlist.snapshot_id;
    this.type = playlist.type;
    this.uri = playlist.uri;
    this.tracks = playlist.tracks;
  }

  getPlaylistItems = (
    limit?: MaxInt<50>,
    offset?: number,
  ): Promise<Page<PlaylistedTrack>> => {
    return sdk.playlists.getPlaylistItems(
      this.id,
      undefined,
      undefined,
      limit,
      offset,
    );
  };

  getAllPlaylistItems = (): Promise<PlaylistedTrack[]> => {
    const getPage = (page: number) =>
      this.getPlaylistItems(defaultPageLength, page * defaultPageLength);
    return getAllPages(getPage);
  };
}

export class LikedTracksPlaylist implements StandardizedPlaylist {
  collaborative: boolean;
  description: string;
  external_urls: ExternalUrls;
  followers: Followers;
  href: string;
  id: string;
  images: Image[];
  name: string;
  owner: UserReference;
  primary_color: string;
  public: boolean;
  snapshot_id: string;
  type: string;
  uri: string;
  tracks: Page<PlaylistedTrack>;

  constructor() {
    this.collaborative = false;
    this.description = "Your Liked Songs";
    this.external_urls = {} as ExternalUrls;
    this.followers = {} as Followers;
    this.href = "";
    this.id = "";
    this.images = [
      {
        height: 128,
        width: 128,
        url: env.NEXT_PUBLIC_URL + "/api/images/liked",
      },
    ];
    this.name = "Liked Songs";
    this.owner = {} as UserReference;
    this.primary_color = "";
    this.public = false;
    this.snapshot_id = "";
    this.type = "";
    this.uri = "";
    this.tracks = {} as Page<PlaylistedTrack>;

    sdk.currentUser.tracks
      .savedTracks(defaultPageLength, 0)
      .then((savedTracks) => {
        this.tracks = this.#mapSavedTracksToPlaylistedTracks(savedTracks);
      });
  }

  // a function to map the saved tracks to the playlisted tracks interface
  #mapSavedTracksToPlaylistedTracks = (savedTracks: Page<SavedTrack>) => {
    return {
      ...savedTracks,
      items: savedTracks.items.map((track) => {
        return {
          ...track,
          added_by: {} as AddedBy,
          is_local: false,
          primary_color: "",
        } as PlaylistedTrack;
      }),
    } as Page<PlaylistedTrack>;
  };

  getPlaylistItems = (
    limit?: MaxInt<50>,
    offset?: number,
  ): Promise<Page<PlaylistedTrack>> => {
    return sdk.currentUser.tracks
      .savedTracks(limit, offset)
      .then((savedTracks) =>
        this.#mapSavedTracksToPlaylistedTracks(savedTracks),
      );
  };

  getAllPlaylistItems = (): Promise<PlaylistedTrack[]> => {
    const getPage = (page: number) =>
      this.getPlaylistItems(defaultPageLength, page * defaultPageLength);
    return getAllPages(getPage);
  };
}
