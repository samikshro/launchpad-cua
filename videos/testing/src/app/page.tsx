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
          "radial-gradient(circle at 15% 15%, rgba(14, 165, 233, 0.24), transparent 40%), radial-gradient(circle at 85% 85%, rgba(249, 115, 22, 0.22), transparent 40%), linear-gradient(140deg, #020617 0%, #0f172a 46%, #111827 100%)",
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
          color: "#e2e8f0",
          fontSize: "clamp(1.3rem, 3.2vw, 2.1rem)",
          letterSpacing: "-0.02em",
          textAlign: "center",
        }}
      >
        Blue Alpha x 1440 Case Study
      </h1>

      <p
        style={{
          margin: 0,
          color: "rgba(203, 213, 225, 0.92)",
          textAlign: "center",
          maxWidth: 880,
          fontSize: "clamp(0.9rem, 2vw, 1.08rem)",
          lineHeight: 1.45,
        }}
      >
        A styled breakdown of how 1440 improved channel allocation confidence with Blue Alpha. All scenes now reflect the published 1440 case study.
      </p>

      <div
        style={{
          width: "min(1120px, 100%)",
          borderRadius: 18,
          overflow: "hidden",
          border: "1px solid rgba(148, 163, 184, 0.35)",
          boxShadow: "0 30px 100px rgba(2, 6, 23, 0.6)",
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
