"use client";

import { useEffect } from "react";
import { RealtimeKitProvider, useRealtimeKitClient } from "@cloudflare/realtimekit-react";
import { RtkMeeting } from "@cloudflare/realtimekit-react-ui";

type Props = {
  authToken: string;
  audio?: boolean;
  video?: boolean;
};

export function RealtimeKitJoin({ authToken, audio = true, video = true }: Props) {
  const [meeting, initMeeting] = useRealtimeKitClient();

  useEffect(() => {
    if (!authToken) return;
    initMeeting({ authToken, defaults: { audio, video } });
  }, [audio, authToken, initMeeting, video]);

  if (!meeting) return <main className="page">Connecting...</main>;

  return (
    <RealtimeKitProvider value={meeting}>
      <RtkMeeting meeting={meeting} mode="fill" showSetupScreen />
    </RealtimeKitProvider>
  );
}
