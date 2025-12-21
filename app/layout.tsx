import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wedding Invitation - Join Us on Our Special Day",
  description:
    "You are cordially invited to celebrate our wedding on January 25, 2026",
  keywords: ["wedding", "invitation", "marriage", "celebration"],
  openGraph: {
    title: "Wedding Invitation",
    description: "Join us in celebrating our special day on January 25, 2026",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
