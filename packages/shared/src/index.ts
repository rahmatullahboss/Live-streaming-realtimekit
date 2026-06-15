export type SportType = "cricket" | "football" | "generic";
export type ProgramSource = "live" | "ad" | "slate";

export type ProgramState = {
  selectedCameraId: string | null;
  source: ProgramSource;
  layout: "single" | "split" | "pip";
  updatedAt: string | null;
};

export type OverlayConfig = {
  adVideoUrl?: string | null;
  clockText?: string | null;
  externalOverlayActive: boolean;
  externalOverlayUrl?: string | null;
  leftLogoUrl?: string | null;
  rightLogoUrl?: string | null;
  scoreboardActive: boolean;
  sponsorText?: string | null;
  sport: SportType;
  team1LogoUrl?: string | null;
  team1Name: string;
  team1Score: number;
  team2LogoUrl?: string | null;
  team2Name: string;
  team2Score: number;
  tickerActive: boolean;
  tickerText?: string | null;
  tournamentName?: string | null;
};

export type CameraParticipant = {
  id: string;
  name: string;
  role: "camera" | "director" | "recorder";
  realtimekitParticipantId?: string;
  status: "offline" | "joining" | "live" | "error";
};

export type EventState = {
  id: string;
  title: string;
  cameras: CameraParticipant[];
  program: ProgramState;
  overlay: OverlayConfig;
};

export const defaultProgramState: ProgramState = {
  selectedCameraId: null,
  source: "live",
  layout: "single",
  updatedAt: null,
};

export const defaultOverlayConfig: OverlayConfig = {
  externalOverlayActive: false,
  scoreboardActive: true,
  sport: "football",
  team1Name: "TEAM A",
  team1Score: 0,
  team2Name: "TEAM B",
  team2Score: 0,
  tickerActive: false,
};
