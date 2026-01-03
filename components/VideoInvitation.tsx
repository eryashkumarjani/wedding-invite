"use client";

import { motion, AnimatePresence, Transition } from "framer-motion";
import { Language } from "@/types";
import { translations } from "@/lib/translations";
import { Play } from "lucide-react";
import { useState } from "react";

interface VideoInvitationProps {
  language: Language;
}

/**
 * iOS-style spring transition
 * Tuned for fluid Apple-like animations
 */
const iosSpring: Transition = {
  type: "spring",
  stiffness: 340,
  damping: 30,
  mass: 0.9,
};

/**
 * Reusable Apple-style fade + lift animation
 */
const iosFadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 },
  transition: iosSpring,
};

/**
 * Soft scale-in animation (used for micro-interactions)
 */
const iosScale = {
  initial: { scale: 0.96, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.96, opacity: 0 },
  transition: iosSpring,
};

export default function VideoInvitation({ language }: VideoInvitationProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const youtubeVideoId = "EE4zkbM9xng";
  const youtubeThumbnail = `https://img.youtube.com/vi/${youtubeVideoId}/maxresdefault.jpg`;

  return (
    <section className="min-h-screen flex items-center justify-center px-6 pt-0 pb-12 bg-white font-sans">
      <div className="w-full max-w-md">
        {/* TITLE */}
        <motion.div {...iosFadeUp} className="text-center mb-3">
          <h2 className="font-serif text-2xl text-slate-800 mb-2">
            {translations.videoSection.title[language]}
          </h2>

          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            exit={{ scaleX: 0, opacity: 0 }}
            transition={{ ...iosSpring, delay: 0.05 }}
            className="w-16 h-px bg-rose-200 mx-auto mt-2 origin-center"
          />
        </motion.div>

        {/* VIDEO CONTAINER */}
        <motion.div
          {...iosFadeUp}
          transition={{ ...iosSpring, delay: 0.1 }}
          className="flex justify-center"
        >
          <div className="w-80 max-w-sm">
            <div className="relative rounded-2xl overflow-hidden border border-rose-100 bg-black aspect-[9/16] sm:aspect-video mb-8 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
              <AnimatePresence mode="wait">
                {!isPlaying ? (
                  <motion.div
                    key="thumbnail"
                    {...iosScale}
                    className="absolute inset-0 cursor-pointer rounded-2xl"
                    style={{
                      backgroundImage: `url(${youtubeThumbnail})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                    onClick={() => setIsPlaying(true)}
                  >
                    {/* PLAY BUTTON */}
                    <motion.div
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.94 }}
                      transition={iosSpring}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-[0_8px_24px_rgba(0,0,0,0.15)]">
                        <Play
                          className="w-8 h-8 text-rose-500 ml-1"
                          fill="currentColor"
                        />
                      </div>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.iframe
                    key="video"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={iosSpring}
                    className="w-full h-full rounded-2xl"
                    src={`https://www.youtube.com/embed/${youtubeVideoId}?rel=0&autoplay=1`}
                    title="Wedding Invitation Video"
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; autoplay"
                    allowFullScreen
                  />
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
