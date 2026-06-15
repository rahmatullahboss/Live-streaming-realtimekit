import type { OverlayConfig } from "shared/src";
import { getExternalOverlayUrls } from "./external-overlays";

export function ScoreboardOverlay({ overlay }: { overlay: OverlayConfig }) {
  const externalUrls = overlay.externalOverlayActive
    ? getExternalOverlayUrls(overlay.externalOverlayUrl)
    : [];

  const showBoard = overlay.scoreboardActive;
  const showTicker = overlay.tickerActive && Boolean(overlay.tickerText?.trim());
  const showSponsor = Boolean(overlay.sponsorText?.trim());

  if (!showBoard && externalUrls.length === 0 && !showTicker && !showSponsor) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-4 text-white">
      {externalUrls.map((url, index) => (
        <iframe
          key={`${url}-${index}`}
          title={`External graphics ${index + 1}`}
          src={url}
          className="absolute inset-0 z-10 h-full w-full border-0 bg-transparent"
          allow="autoplay; fullscreen"
        />
      ))}

      <div className="relative z-20 flex items-start justify-between gap-3">
        <Logo url={overlay.leftLogoUrl} label="Left logo" />
        <Logo url={overlay.rightLogoUrl} label="Right logo" />
      </div>

      {showBoard ? (
        <div className="relative z-20 mx-auto mb-3 w-full max-w-3xl overflow-hidden rounded-2xl border border-white/15 bg-black/80 shadow-2xl backdrop-blur">
          {overlay.tournamentName ? (
            <div className="border-b border-white/10 px-4 py-1 text-center text-xs font-bold uppercase tracking-widest text-white/60">
              {overlay.tournamentName}
            </div>
          ) : null}

          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 py-3">
            <Team name={overlay.team1Name} logo={overlay.team1LogoUrl} align="right" />
            <div className="rounded-xl bg-white px-5 py-2 text-3xl font-black tabular-nums text-black">
              {overlay.team1Score} - {overlay.team2Score}
            </div>
            <Team name={overlay.team2Name} logo={overlay.team2LogoUrl} align="left" />
          </div>

          <div className="flex items-center justify-center gap-3 border-t border-white/10 px-4 py-2 text-xs uppercase tracking-wider text-white/60">
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-500" /> LIVE
            </span>
            {overlay.clockText ? <span>{overlay.clockText}</span> : null}
            {showSponsor ? <span>{overlay.sponsorText}</span> : null}
          </div>
        </div>
      ) : null}

      {showTicker ? (
        <div className="relative z-20 overflow-hidden rounded-full border border-white/15 bg-black/85 px-4 py-2 text-sm font-semibold">
          <span className="whitespace-nowrap">{overlay.tickerText}</span>
        </div>
      ) : null}
    </div>
  );
}

function Logo({ label, url }: { label: string; url?: string | null }) {
  if (!url) return <span />;
  return <img src={url} alt={label} className="h-12 w-12 rounded-xl bg-black/50 object-contain p-1" />;
}

function Team({ align, logo, name }: { align: "left" | "right"; logo?: string | null; name: string }) {
  return (
    <div className={`flex min-w-0 items-center gap-2 ${align === "right" ? "justify-end text-right" : "justify-start text-left"}`}>
      {align === "left" ? <Logo url={logo} label={name} /> : null}
      <span className="truncate text-sm font-black uppercase tracking-wide sm:text-lg">{name}</span>
      {align === "right" ? <Logo url={logo} label={name} /> : null}
    </div>
  );
}
