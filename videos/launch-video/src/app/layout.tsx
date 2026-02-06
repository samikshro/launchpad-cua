import type { Metadata } from "next";
import "../styles/global.css";

export const metadata: Metadata = {
  title: "Launchpad Video Preview",
  description: "Preview and render Remotion videos",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
