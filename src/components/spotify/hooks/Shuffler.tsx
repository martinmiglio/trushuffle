"use client";

import shuffle from "@/lib/shuffle";
import sdk from "@/lib/spotify-sdk/ClientInstance";
import { PlaybackState, Playlist } from "@spotify/web-api-ts-sdk";
import { useEffect, useState } from "react";

// a react use and set hook to play a playlist
//
// implemented like:
// const [playbackState, setPlaylist, setIsPlaying] = useShuffle();
//
// setPlaylist("spotify:playlist:37i9dQZF1DXcBWIGoYBM5M");
//
// setIsPlaying(true);
//
// return (
//   <div>
//     <button onClick={() => setIsPlaying(true)}>Play</button>
//     <button onClick={() => setIsPlaying(false)}>Pause</button>
//   {playbackState?.item?.name}
//   </div>
// );

export function useShuffle(device_id: string) {
  const [playbackState, setPlaybackState] = useState<PlaybackState | null>(
    null,
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlist, setPlaylist] = useState<Playlist | null>(null);

  const updatePlayBackState = () => {
    sdk.player.getPlaybackState().then((res) => {
      setPlaybackState(res);
    });
  };



  const playPlaylist = () => {
    if (!playlist) {
      console.warn(
        "[Spotify-Hook][WARN]\nTried to play when no playlist is set.",
      );
      return;
    }
    // a fn to play a playlist in a shuffled order (not using spotify shuffle)
    // the idea is get the playlist, shuffle it in memory, and then play it one song at a time, in the shuffled order

    // shuffle the songs
    const shuffledTracks = shuffle(playlist.tracks.items.map((item) => item.track));

    while(shuffledTracks.length > 0) {
      const currentTrack = shuffledTracks.shift();
      if (!currentTrack) {
        break;
      }

      // play the current track
      sdk.player.play


    }
  };

  useEffect(() => {
    if (!playlist) {
      return;
    }

    if (isPlaying) {
      sdk.player.startResumePlayback(device_id, playlist.uri).then(() => {
        updatePlayBackState();
      });
    } else {
      sdk.player.pausePlayback(device_id).then(() => {
        updatePlayBackState();
      });
    }
  }, [isPlaying, playlist, device_id]);

  // useEffect(() => {
  //   if (playlist) {
  //     // sdk.player
  //     //   .play({
  //     //     context_uri: playlist,
  //     //   })
  //     //   .then(() => {
  //     //     updatePlayBackState();
  //     //   });
  //   }
  // }, [playlist]);

  return [playbackState, setPlaylist, setIsPlaying];
}
