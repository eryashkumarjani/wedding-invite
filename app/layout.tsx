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
    url: "https://yashmi-wedding-invite.vercel.app/",
    siteName: "Wedding Invitation",
    type: "website",
    images: [
      {
        url: "https://yashmi-wedding-invite.vercel.app/couple.png",
        width: 1200,
        height: 630,
        alt: "Wedding Invitation",
      },
    ],
  },
};
