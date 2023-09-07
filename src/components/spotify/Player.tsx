"use client";

import Button, { IconButton } from "@/components/atomic/Button";
import shuffle from "@/lib/shuffle";
import sdk from "@/lib/spotify-sdk/ClientInstance";
import {
  faPlay,
  faPause,
  faFastBackward,
  faFastForward,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Device,
  Devices,
  PlaybackState,
  Playlist,
} from "@spotify/web-api-ts-sdk";
import { useEffect, useState } from "react";

const playPlaylist = async (playlist: Playlist, device: Device) => {
  await sdk.player.togglePlaybackShuffle(false, device.id ?? undefined);
  const shuffledTracks = shuffle(
    playlist.tracks.items.map((item) => item.track),
  );
  await sdk.player.startResumePlayback(
    device.id ?? "",
    undefined,
    shuffledTracks.map((track) => track.uri),
  );
};

export default function Player({ playlist }: { playlist: Playlist | null }) {
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

  if (!playBackState) {
    return (
      <DeviceSelector
        playBackState={playBackState}
        updatePlayBackState={updatePlayBackState}
      />
    );
  }

  return (
    <div className="w-full items-center justify-center flex gap-4">
      <GoBackButton
        playBackState={playBackState}
        updatePlayBackState={updatePlayBackState}
      />
      <PlayPauseButton
        playBackState={playBackState}
        updatePlayBackState={updatePlayBackState}
        playlist={playlist}
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
  playlist,
  playBackState,
  updatePlayBackState,
}: PlayerChildrenProps & { playlist: Playlist | null }) {
  const togglePlayPause = async () => {
    if (!playBackState?.device.id || !playlist) {
      return;
    }
    if (playBackState.is_playing) {
      await sdk.player.pausePlayback(playBackState.device.id);
    } else {
      await playPlaylist(playlist, playBackState.device);
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

function DeviceSelector({
  playBackState,
  updatePlayBackState,
}: PlayerChildrenProps) {
  const [currentDevice, setCurrentDevice] = useState<Device | null>(
    playBackState?.device ?? null,
  );

  const updateCurrentDevice = async (device: Device) => {
    if (!device.id) {
      return;
    }

    if (device.id === currentDevice?.id) {
      return;
    }
    await sdk.player.transferPlayback([device.id], false);
    setCurrentDevice(device);
    updatePlayBackState();
  };

  const [devices, setDevices] = useState<Devices | null>(null);

  useEffect(() => {
    sdk.player.getAvailableDevices().then((res) => {
      console.log("AVAILABLE DEVICES", res);
      setDevices(res);
    });
  }, []);

  return (
    <div className="flex flex-col gap-2">
      {devices?.devices.map((device) => (
        <Button
          key={device.id}
          className="bg-gray-800 rounded-lg p-2"
          onClick={() => updateCurrentDevice(device)}
        >
          {device.name}
        </Button>
      ))}
    </div>
  );
}
