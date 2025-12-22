"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Calendar } from "lucide-react";
import { Language } from "@/types";
import { translations } from "@/lib/translations";
import ProgressiveImage from "./ProgressiveImage";

interface CountdownProps {
  language: Language;
  coupleImageUrl?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function Countdown({
  language,
  coupleImageUrl = "/images/soulmate2.jpeg",
}: CountdownProps) {
  // ⏳ Countdown state
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // 🔧 FIX 1: isMounted state to prevent hydration mismatch
  const [isMounted, setIsMounted] = useState(false);

  // ❤️ Floating hearts - safe initialization
  const [floatingHearts, setFloatingHearts] = useState<
    Array<{
      initialX: number;
      duration: number;
      delay: number;
    }>
  >([]);

  // 🔧 FIX 2: Initialize hearts only on client side (async to avoid cascading renders)
  useEffect(() => {
    // Use a microtask to avoid synchronous setState
    Promise.resolve().then(() => {
      setIsMounted(true);

      const width = window.innerWidth;
      setFloatingHearts(
        [...Array(15)].map(() => ({
          initialX: Math.random() * width,
          duration: 4 + Math.random() * 3,
          delay: Math.random() * 5,
        }))
      );
    });
  }, []);

  // ⏳ Countdown Timer
  useEffect(() => {
    const weddingDate = new Date("2026-01-25T18:00:00").getTime();

    const calculateTimeLeft = () => {
      const now = Date.now();
      const difference = weddingDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  const timeUnits = [
    { value: timeLeft.days, label: translations.countdown.days[language] },
    { value: timeLeft.hours, label: translations.countdown.hours[language] },
    {
      value: timeLeft.minutes,
      label: translations.countdown.minutes[language],
    },
    {
      value: timeLeft.seconds,
      label: translations.countdown.seconds[language],
    },
  ];

  // 🔧 FIX 3: Prevent rendering animations until client-side mounted
  if (!isMounted) {
    return (
      <section className="relative min-h-screen flex flex-col items-center justify-end px-6 pb-20 font-sans">
        <div className="absolute inset-0">
          <ProgressiveImage
            src={coupleImageUrl}
            alt="Couple"
            fill
            className="object-cover object-center md:object-[center_20%]"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-rose-900/40 via-transparent to-transparent" />
        </div>
        <div className="relative w-full max-w-7xl z-10 mb-8 opacity-0">
          Loading...
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-end px-6 pb-20 font-sans">
      {/* Background */}
      <div className="absolute inset-0">
        <ProgressiveImage
          src={coupleImageUrl}
          alt="Couple"
          fill
          className="object-cover object-center md:object-[center_20%]"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-rose-900/40 via-transparent to-transparent" />
      </div>

      {/* Floating Hearts */}
      {floatingHearts.length > 0 && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {floatingHearts.map((heart, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{
                x: heart.initialX,
                y: window.innerHeight,
                scale: 0,
                opacity: 0,
              }}
              animate={{
                y: -100,
                scale: [0, 1, 1, 0],
                opacity: [0, 0.6, 0.6, 0],
              }}
              transition={{
                duration: heart.duration,
                repeat: Infinity,
                delay: heart.delay,
              }}
            >
              <Heart className="w-3 h-3 text-white" fill="currentColor" />
            </motion.div>
          ))}
        </div>
      )}

      <div className="relative w-full max-w-7xl z-10 mb-8">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-2"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="inline-flex items-center justify-center w-12 h-12 bg-white/10 backdrop-blur-md rounded-full mb-6 shadow-2xl border border-white/30"
          >
            <Calendar className="w-6 h-6 text-white" />
          </motion.div>

          <h2 className="font-serif text-2xl text-white mb-6 leading-tight drop-shadow-2xl font-semibold tracking-tight">
            {translations.countdown.title[language]}
          </h2>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="flex items-center justify-center gap-2"
          >
            <div className="w-12 md:w-16 h-px bg-white/50" />
            <Heart className="w-4 h-4 text-white" fill="currentColor" />
            <div className="w-12 md:w-16 h-px bg-white/50" />
          </motion.div>
        </motion.div>

        {/* Countdown Cards */}
        <div className="flex items-center justify-center gap-2 md:gap-6 lg:gap-8 mb-6 flex-wrap">
          {timeUnits.map((unit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                delay: index * 0.1,
                duration: 0.6,
                type: "spring",
                stiffness: 100,
              }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="relative group"
            >
              <div className="relative rounded-2xl md:rounded-3xl p-2 pt-0 min-w-[70px] md:min-w-[120px] lg:min-w-[140px]">
                <div className="relative h-16 flex items-center justify-center overflow-hidden font-sans">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={unit.value}
                      initial={{ rotateX: -90, opacity: 0 }}
                      animate={{ rotateX: 0, opacity: 1 }}
                      exit={{ rotateX: 90, opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="absolute"
                    >
                      <div className="text-2xl font-bold text-white drop-shadow-2xl tracking-wide">
                        {unit.value.toString().padStart(2, "0")}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="text-center">
                  <div className="inline-block px-2 md:px-3 pb-1 bg-white/10 backdrop-blur-md rounded-full border border-white/30">
                    <span className="text-[9px] font-semibold uppercase tracking-widest text-white font-sans">
                      {unit.label}
                    </span>
                  </div>
                </div>

                <div className="absolute -bottom-1 md:-bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-3 md:h-4 bg-gradient-to-r from-rose-400/60 via-pink-400/60 to-rose-400/60 blur-xl rounded-full" />
              </div>

              {index < timeUnits.length - 1 && (
                <div className="hidden lg:block absolute -right-3 lg:-right-4 top-1/2 -translate-y-1/2 text-3xl md:text-4xl font-bold text-white/70 drop-shadow-lg">
                  :
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Bottom Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="text-center"
        >
          <div className="inline-block bg-white/10 backdrop-blur-xl rounded-full px-6 py-2 shadow-2xl border border-white/20">
            <p className="text-[12px] font-light text-white italic flex items-center gap-2 md:gap-3 font-sans">
              <Heart
                className="w-4 h-4 md:w-5 md:h-5 text-rose-300"
                fill="currentColor"
              />

              {language === "en" && "Every moment brings us closer"}
              {language === "hi" && "हर पल हमें करीब लाता है"}
              {language === "gu" && "દરેક ક્ષણ અમને નજીક લાવે છે"}

              <Heart
                className="w-4 h-4 md:w-5 md:h-5 text-rose-300"
                fill="currentColor"
              />
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
