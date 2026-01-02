"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, Transition } from "framer-motion";
import ProgressiveImage from "./ProgressiveImage";

interface WeddingLoaderProps {
  onLoadingComplete: () => void;
}

// Type-safe spring transition for main elements
const spring: Transition = {
  type: "spring",
  stiffness: 180,
  damping: 20,
  mass: 0.7,
};

// ⏱️ Loader timing constants
const TOTAL_TIME = 5000; // 5 seconds
const INTERVAL_TIME = 50; // update every 50ms for smooth progress

export default function WeddingLoader({
  onLoadingComplete,
}: WeddingLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [showLoader, setShowLoader] = useState(true);
  const [showTyping, setShowTyping] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Use refs to prevent stale closures
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const mainTimerRef = useRef<NodeJS.Timeout | null>(null);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const hasStartedRef = useRef<boolean>(false);
  const onLoadingCompleteRef = useRef(onLoadingComplete);

  // Keep the callback ref updated
  useEffect(() => {
    onLoadingCompleteRef.current = onLoadingComplete;
  }, [onLoadingComplete]);

  // Check if mobile on mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Preload images
  useEffect(() => {
    const imageUrls = [
      "/images/ganesha.png",
      "/images/hawan.png",
      "/images/groom.png",
      "/images/bride.png",
    ];

    let loadedCount = 0;
    const totalImages = imageUrls.length;

    imageUrls.forEach((url) => {
      const img = new window.Image();
      img.onload = () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          setImagesLoaded(true);
        }
      };
      img.onerror = () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          setImagesLoaded(true);
        }
      };
      img.src = url;
    });
  }, []);

  // Hide typing animation after 1.5 seconds
  useEffect(() => {
    typingTimerRef.current = setTimeout(() => {
      setShowTyping(false);
    }, 1500);

    return () => {
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }
    };
  }, []);

  // ✅ Improved 5-second loader with precise progress calculation
  useEffect(() => {
    if (!imagesLoaded || showTyping) return;

    // Prevent multiple executions
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    startTimeRef.current = Date.now();

    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const calculatedProgress = Math.min((elapsed / TOTAL_TIME) * 100, 100);
      setProgress(calculatedProgress);

      if (calculatedProgress >= 100) {
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
        }
      }
    }, INTERVAL_TIME);

    mainTimerRef.current = setTimeout(() => {
      setShowLoader(false);
      setTimeout(() => onLoadingCompleteRef.current(), 500);
    }, TOTAL_TIME);

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      if (mainTimerRef.current) {
        clearTimeout(mainTimerRef.current);
      }
    };
  }, [imagesLoaded, showTyping]);

  const loadingText = "Loading your invitation...";

  /* --------------------------------------------------
     TYPING PRE-LOADER
  -------------------------------------------------- */
  if (showTyping || !imagesLoaded) {
    return (
      <div className="fixed inset-0 z-[200] bg-gradient-to-br from-rose-100 via-pink-50 to-rose-50 flex items-center justify-center">
        <div className="relative z-10 text-center px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 2,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="z-20 flex justify-center mb-5"
          >
            <div className="relative flex justify-center">
              <ProgressiveImage
                src="/images/optimized/ganesha.webp"
                alt="Ganesh Ji"
                width={150}
                height={150}
                className="object-contain"
                priority
                transparent
              />
            </div>
          </motion.div>

          <motion.p
            className="text-lg font-sans text-slate-500 font-light tracking-wide flex justify-center"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.05,
                },
              },
            }}
          >
            {loadingText.split("").map((char, index) => (
              <motion.span
                key={index}
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1 },
                }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      {showLoader && imagesLoaded && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-end overflow-hidden"
        >
          {/* Hawan Background Image */}
          <div className="absolute inset-0">
            <ProgressiveImage
              src="/images/optimized/hawan.webp"
              alt="Hawan Background"
              fill
              className="object-cover"
              priority
              transparent
            />
            {/* Overlay for better visibility */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
          </div>

          {/* Ganpati Ji - Fade in from top */}
          <motion.div
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 5,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute top-42 z-20 flex justify-center"
          >
            <div className="relative">
              <ProgressiveImage
                src="/images/optimized/ganesha.webp"
                alt="Ganesh Ji"
                width={50}
                height={50}
                className="object-contain"
                priority
                transparent
              />
            </div>
          </motion.div>

          {/* Groom - Coming from Left to Center - Smooth Animation */}
          <motion.div
            initial={{ x: "-100vw", opacity: 0 }}
            animate={{
              x: isMobile ? -120 : 0,
              opacity: 1,
            }}
            transition={{
              duration: 5,
              ease: [0.25, 0.46, 0.45, 0.94], // Smooth cubic bezier
            }}
            className="absolute left-0 bottom-8 z-30"
          >
            <div className="relative max-w-full max-h-full">
              <ProgressiveImage
                src="/images/optimized/groom.webp"
                alt="Groom"
                width={900}
                height={900}
                className="object-contain drop-shadow-[0_35px_60px_rgba(0,0,0,0.35)] w-[600px] sm:w-[900px]"
                priority
                transparent
              />
            </div>
          </motion.div>

          {/* Bride - Coming from Right to Center - Smooth Animation */}
          <motion.div
            initial={{ x: "100vw", opacity: 0 }}
            animate={{
              x: isMobile ? 120 : 180,
              opacity: 1,
            }}
            transition={{
              duration: 5,
              ease: [0.25, 0.46, 0.45, 0.94], // Smooth cubic bezier
            }}
            className="absolute right-0 bottom-6 z-20"
          >
            <div className="relative max-w-full max-h-full">
              <ProgressiveImage
                src="/images/optimized/bride.webp"
                alt="Bride"
                width={900}
                height={900}
                className="object-contain drop-shadow-[0_35px_60px_rgba(0,0,0,0.35)] w-[600px] sm:w-[900px]"
                priority
                transparent
              />
            </div>
          </motion.div>

          {/* Bottom Section - Loading Text and Progress Bar */}
          <div className="relative z-30 w-60 px-6 pb-6">
            {/* Progress Bar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ...spring, delay: 0.8 }}
              className="w-full max-w-md mx-auto"
            >
              <div className="relative h-3 bg-white/30 rounded-full overflow-hidden backdrop-blur-md border border-white/40 shadow-lg">
                <motion.div
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-rose-400 via-pink-400 to-rose-500 rounded-full"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: "linear", duration: 0.05 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                </motion.div>
              </div>

              <motion.p
                className="mt-3 text-center text-base sm:text-lg font-sans text-white font-medium drop-shadow-lg"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {Math.floor(progress)}%
              </motion.p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
