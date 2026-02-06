"use client";

import { Player } from "@remotion/player";
import { FullVideo, FULL_VIDEO_DURATION } from "../remotion/scenes/FullVideo";
import { VIDEO_WIDTH, VIDEO_HEIGHT, VIDEO_FPS } from "../../types/constants";

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 15% 15%, rgba(34, 211, 238, 0.22), transparent 38%), radial-gradient(circle at 82% 82%, rgba(251, 146, 60, 0.18), transparent 42%), linear-gradient(150deg, #020617 0%, #0f172a 45%, #111827 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 18,
        padding: "28px 16px",
      }}
    >
      <h1
        style={{
          margin: 0,
          color: "rgba(248, 250, 252, 0.96)",
          fontSize: "clamp(1.4rem, 3.4vw, 2.2rem)",
          letterSpacing: "-0.02em",
          textAlign: "center",
        }}
      >
        Launch Test Launch Video Template
      </h1>

      <p
        style={{
          margin: 0,
          color: "rgba(203, 213, 225, 0.92)",
          textAlign: "center",
          maxWidth: 980,
          fontSize: "clamp(0.95rem, 2vw, 1.1rem)",
          lineHeight: 1.45,
        }}
      >
        Narrative launch flow with motion graphics, kinetic text slides, and dashboard fly-through transitions.
      </p>

      <div
        style={{
          width: "min(1160px, 100%)",
          borderRadius: 18,
          overflow: "hidden",
          border: "1px solid rgba(148, 163, 184, 0.35)",
          boxShadow: "0 30px 90px rgba(2, 6, 23, 0.65)",
          backgroundColor: "#020617",
        }}
      >
        <Player
          component={FullVideo}
          durationInFrames={FULL_VIDEO_DURATION}
          fps={VIDEO_FPS}
          compositionWidth={VIDEO_WIDTH}
          compositionHeight={VIDEO_HEIGHT}
          style={{ width: "100%", height: "auto", aspectRatio: `${VIDEO_WIDTH} / ${VIDEO_HEIGHT}` }}
          controls
          autoPlay
          loop
        />
      </div>
    </main>
  );
}
