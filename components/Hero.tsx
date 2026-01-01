"use client";

import { motion, Transition, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import { Language } from "@/types";
import { translations } from "@/lib/translations";
import { Guest } from "@/lib/guestData";
import ProgressiveImage from "./ProgressiveImage";

/* ===========================
   Apple-style Motion Presets
=========================== */

const appleSpring: Transition = {
  type: "spring",
  stiffness: 320,
  damping: 30,
  mass: 0.8,
};

const appleSoftSpring: Transition = {
  type: "spring",
  stiffness: 200,
  damping: 28,
  mass: 0.9,
};

interface HeroProps {
  language: Language;
  guest?: Guest | null;
}

export default function Hero({ language, guest }: HeroProps) {
  // Use guest ID as key to reset state when guest changes
  const guestKey = guest?.name || "no-guest";
  const [greetingComplete, setGreetingComplete] = useState(false);
  const greetingControls = useAnimation();

  // Derive showMainContent: if no guest, always show main content
  const showMainContent = !guest || greetingComplete;

  /* ===========================
     GREETING ANIMATION
  =========================== */
  useEffect(() => {
    if (!guest) {
      // No greeting animation needed when there's no guest
      return;
    }

    // Start in center, hidden
    greetingControls.set({
      top: "50%",
      y: "-50%",
      opacity: 0,
    });

    // Fade in smoothly
    greetingControls.start({
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    });

    // Move to top after delay
    const timer = setTimeout(async () => {
      await greetingControls.start({
        top: "50px",
        y: "0%",
        transition: appleSpring,
      });

      setGreetingComplete(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [guestKey, greetingControls, guest]); // Use guestKey instead of guest to trigger re-runs

  const getGuestName = () => {
    if (!guest) return null;

    switch (language) {
      case "hi":
        return guest.nameHi;
      case "gu":
        return guest.nameGu;
      default:
        return guest.name;
    }
  };

  const guestName = getGuestName();

  return (
    <section className="min-h-screen px-6 bg-gradient-to-b from-rose-50/30 to-white">
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md text-center">
          {/* =========================
              Greeting
          ========================= */}
          {guestName && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={greetingControls}
              className="
                fixed
                left-1/2
                -translate-x-1/2
                z-50
                text-center
              "
            >
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={appleSpring}
                className="font-sans text-md text-rose-400 tracking-wide font-bold"
              >
                {language === "en" && "Dear"}
                {language === "hi" && "प्रिय"}
                {language === "gu" && "પ્રિય"}
              </motion.p>

              <motion.h3
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={appleSpring}
                className="font-serif text-lg text-slate-800 font-semibold uppercase w-[90vw] px-4"
              >
                {guestName}
              </motion.h3>

              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ ...appleSoftSpring, delay: 0.25 }}
                className="h-1 bg-gradient-to-r from-transparent via-rose-400 to-transparent mx-auto rounded-full my-3 w-[100px]"
              />
            </motion.div>
          )}

          {/* =========================
              Main Content
          ========================= */}
          {showMainContent && (
            <motion.div
              className="mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...appleSpring, delay: guestName ? 0 : 0.25 }}
                className="font-sans text-xs uppercase tracking-[0.35em] text-slate-500 mb-2 mt-10 font-light"
              >
                {language === "en" && "Together With Their Families"}
                {language === "hi" && "अपने परिवारों के साथ"}
                {language === "gu" && "તેમના પરિવારો સાથે"}
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...appleSpring, delay: guestName ? 0.1 : 0.35 }}
                className="font-serif text-3xl mb-6 leading-tight tracking-tight text-slate-800 font-semibold"
              >
                {translations.heroTitle[language]}
              </motion.h1>

              {/* =========================
                  Hero Image
              ========================= */}
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ ...appleSpring, delay: 0.5 }}
                className="mb-18 mx-auto w-48 h-48"
                style={{
                  filter:
                    "drop-shadow(0 18px 28px rgba(0,0,0,0.25)) drop-shadow(0 0 18px rgba(255,182,193,0.35))",
                }}
              >
                <div
                  className="relative w-68 h-68"
                  style={{ perspective: "1400px", marginLeft: "-45px" }}
                >
                  <motion.div
                    whileHover={{
                      rotateX: -6,
                      rotateY: 6,
                      scale: 1.015,
                      transition: appleSoftSpring,
                    }}
                    whileTap={{
                      scale: 0.97,
                      transition: appleSpring,
                    }}
                    animate={{ scale: [1, 1.015, 1] }}
                    transition={{
                      scale: {
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut",
                      },
                    }}
                    className="absolute inset-0 heart-mask bg-gradient-to-br from-rose-200 to-pink-300 overflow-hidden"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <ProgressiveImage
                      src="/images/optimized/couple.webp"
                      alt="Couple"
                      width={700}
                      height={700}
                      priority={true}
                      quality={90}
                      className="object-cover w-full h-full"
                    />

                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      animate={{ opacity: [0.15, 0.25, 0.15] }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(255,255,255,0.35) 0%, transparent 55%, rgba(0,0,0,0.05) 100%)",
                        mixBlendMode: "overlay",
                      }}
                    />
                  </motion.div>
                </div>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ ...appleSpring, delay: 0.65 }}
                className="font-sans text-slate-600 my-2 leading-relaxed font-light text-sm"
              >
                {translations.heroSubtitle[language]}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ ...appleSpring, delay: 0.8 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                className="inline-block bg-white border border-rose-100 rounded-2xl px-8 py-1 shadow-sm"
              >
                <p className="font-sans text-xs uppercase tracking-widest text-rose-400">
                  Save The Date
                </p>

                <div className="flex items-center gap-2 text-slate-800">
                  <span className="text-lg font-serif font-semibold">25</span>
                  <span className="text-slate-300">·</span>
                  <span className="text-lg font-serif font-semibold">01</span>
                  <span className="text-slate-300">·</span>
                  <span className="text-lg font-serif font-semibold">2026</span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
