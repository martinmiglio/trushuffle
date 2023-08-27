"use client";

import Player from "@/components/spotify/Player";
import { useSession } from "next-auth/react";

export default function Page() {
  const session = useSession();

  if (!session || session.status !== "authenticated") {
    return <></>;
  }
  return <Player />;
}
