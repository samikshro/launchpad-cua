import type { Metadata } from "next";
import "../styles/global.css";

export const metadata: Metadata = {
  title: "Blue Alpha x 1440 Case Study Preview",
  description: "Preview and render the Blue Alpha and 1440 case study video.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
