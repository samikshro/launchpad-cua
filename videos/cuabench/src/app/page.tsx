"use client";

import { Player } from "@remotion/player";
import { FullVideo, FULL_VIDEO_DURATION } from "../remotion/scenes/FullVideo";
import { VIDEO_WIDTH, VIDEO_HEIGHT, VIDEO_FPS } from "../../types/constants";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold text-white mb-8">CuaBench Explainer Video</h1>

      <div className="rounded-lg overflow-hidden shadow-2xl">
        <Player
          component={FullVideo}
          durationInFrames={FULL_VIDEO_DURATION}
          fps={VIDEO_FPS}
          compositionWidth={VIDEO_WIDTH}
          compositionHeight={VIDEO_HEIGHT}
          style={{ width: 960, height: 540 }}
          controls
          autoPlay
          loop
        />
      </div>

      <div className="mt-8 text-gray-400 text-sm">
        <p>Use Remotion Studio for full editing: <code className="bg-gray-800 px-2 py-1 rounded">pnpm remotion</code></p>
        <p className="mt-2">Render video: <code className="bg-gray-800 px-2 py-1 rounded">pnpm render</code></p>
      </div>
    </main>
  );
}
