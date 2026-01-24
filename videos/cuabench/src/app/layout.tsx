import type { Metadata } from "next";
import "../styles/global.css";

export const metadata: Metadata = {
  title: "CuaBench Video Preview",
  description: "Preview and render CuaBench explainer video",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
