"use client";

import { Player } from "@remotion/player";
import { FullVideo, FULL_VIDEO_DURATION } from "../remotion/scenes/FullVideo";
import { VIDEO_WIDTH, VIDEO_HEIGHT, VIDEO_FPS } from "../../types/constants";

export default function Home() {
  const scale = Math.min(980 / VIDEO_WIDTH, 680 / VIDEO_HEIGHT);

  return (
    <main className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold text-white mb-8">Terminal Test</h1>

      <div className="rounded-lg overflow-hidden shadow-2xl">
        <Player
          component={FullVideo}
          durationInFrames={FULL_VIDEO_DURATION}
          fps={VIDEO_FPS}
          compositionWidth={VIDEO_WIDTH}
          compositionHeight={VIDEO_HEIGHT}
          style={{ width: VIDEO_WIDTH * scale, height: VIDEO_HEIGHT * scale }}
          controls
          autoPlay
          loop
        />
      </div>

      <div className="mt-8 text-slate-400 text-sm">
        <p>
          Customize content in{" "}
          <code className="bg-slate-800 px-2 py-1 rounded">src/remotion/scenes/AnnouncementData.ts</code>
        </p>
        <p className="mt-2">
          Open editor: <code className="bg-slate-800 px-2 py-1 rounded">pnpm remotion</code>
        </p>
      </div>
    </main>
  );
}
