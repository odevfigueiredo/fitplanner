import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FitPlanner",
  description: "Workout planning, physical progress and load tracking dashboard.",
  icons: {
    icon: "/assets/fitplanner-mark.png",
    apple: "/assets/fitplanner-mark.png",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
