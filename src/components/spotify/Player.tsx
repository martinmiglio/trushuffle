"use client";

import { IconButton } from "@/components/atomic/Button";
import sdk from "@/lib/spotify-sdk/ClientInstance";
import {
  faPlay,
  faPause,
  faFastBackward,
  faFastForward,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PlaybackState } from "@spotify/web-api-ts-sdk";
import { useEffect, useState } from "react";

export default function Player() {
  const [playBackState, setPlayBackState] = useState<PlaybackState | null>(
    null,
  );

  const updatePlayBackState = () => {
    sdk.player.getPlaybackState().then((res) => {
      setPlayBackState(res);
    });
  };

  useEffect(() => {
    updatePlayBackState();
  }, []);

  return (
    <div className="w-full items-center justify-center flex gap-4">
      <GoBackButton
        playBackState={playBackState}
        updatePlayBackState={updatePlayBackState}
      />
      <PlayPauseButton
        playBackState={playBackState}
        updatePlayBackState={updatePlayBackState}
      />
      <GoForwardButton
        playBackState={playBackState}
        updatePlayBackState={updatePlayBackState}
      />
    </div>
  );
}

interface PlayerChildrenProps {
  playBackState: PlaybackState | null;
  updatePlayBackState: () => void;
}

const controlButtonIconClass = "h-4 w-4 m-auto";

function PlayPauseButton({
  playBackState,
  updatePlayBackState,
}: PlayerChildrenProps) {
  const togglePlayPause = async () => {
    if (!playBackState?.device.id) {
      return;
    }
    if (playBackState.is_playing) {
      await sdk.player.pausePlayback(playBackState.device.id);
    } else {
      await sdk.player.startResumePlayback(playBackState.device.id);
    }
    updatePlayBackState();
  };

  if (!playBackState) {
    return <IconButton disabled />;
  }

  return (
    <IconButton onClick={togglePlayPause}>
      {!playBackState?.is_playing ? (
        <FontAwesomeIcon className={controlButtonIconClass} icon={faPlay} />
      ) : (
        <FontAwesomeIcon className={controlButtonIconClass} icon={faPause} />
      )}
    </IconButton>
  );
}

function GoBackButton({
  playBackState,
  updatePlayBackState,
}: PlayerChildrenProps) {
  const goBack = async () => {
    if (!playBackState?.device.id) {
      return;
    }
    await sdk.player.skipToPrevious(playBackState.device.id);
    updatePlayBackState();
  };

  if (!playBackState) {
    return <IconButton disabled />;
  }

  return (
    <IconButton onClick={goBack}>
      <FontAwesomeIcon
        className={controlButtonIconClass}
        icon={faFastBackward}
      />
    </IconButton>
  );
}

function GoForwardButton({
  playBackState,
  updatePlayBackState,
}: PlayerChildrenProps) {
  const goBack = async () => {
    if (!playBackState?.device.id) {
      return;
    }
    await sdk.player.skipToNext(playBackState.device.id);
    updatePlayBackState();
  };

  if (!playBackState) {
    return <IconButton disabled />;
  }

  return (
    <IconButton onClick={goBack}>
      <FontAwesomeIcon
        className={controlButtonIconClass}
        icon={faFastForward}
      />
    </IconButton>
  );
}
