"use client";

import { useState, useEffect, useMemo, useCallback, Suspense } from "react";
import dynamic from "next/dynamic";
import { Language } from "@/types";
import { ArrowLeft, Smartphone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { getGuestById } from "@/lib/guestData";
import WeddingLoader from "@/components/WeddingLoader";

const LanguageSelector = dynamic(
  () => import("@/components/LanguageSelector"),
  { ssr: false }
);

import Hero from "@/components/Hero";
import Countdown from "@/components/Countdown";
import VideoInvitation from "@/components/VideoInvitation";
import Events from "@/components/Events";
import RSVP from "@/components/RSVP";

/* ───────────────────────── iOS Motion Tokens ───────────────────────── */

const iosSpring = {
  type: "spring" as const,
  stiffness: 260,
  damping: 28,
  mass: 0.9,
};

const iosSoftSpring = {
  type: "spring" as const,
  stiffness: 200,
  damping: 30,
  mass: 1,
};

/* ───────────────────────── Mobile Device Detector ───────────────────────── */

function MobileOnlyWrapper({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(true);
  const [isPortrait, setIsPortrait] = useState(true);
  const [currentWidth, setCurrentWidth] = useState(0);

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      setIsMobile(width <= 768);
      setIsPortrait(height > width);
      setCurrentWidth(width);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);
    window.addEventListener("orientationchange", checkDevice);

    return () => {
      window.removeEventListener("resize", checkDevice);
      window.removeEventListener("orientationchange", checkDevice);
    };
  }, []);

  // Desktop/Tablet Message
  if (!isMobile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-red-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...iosSpring }}
          className="max-w-md text-center"
        >
          <div className="bg-white rounded-3xl shadow-2xl p-8 space-y-6">
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto"
            >
              <Smartphone className="w-10 h-10 text-rose-600" />
            </motion.div>

            <h1 className="text-3xl font-bold text-gray-800">
              View on Mobile Device
            </h1>

            <p className="text-gray-600 leading-relaxed text-lg">
              This wedding invitation is optimized for mobile devices for the
              best experience.
            </p>

            <div className="bg-rose-50 rounded-2xl p-4 text-sm text-rose-700 border border-rose-200">
              📱 Please open this link on your smartphone or reduce your browser
              width to less than 768px
            </div>

            <div className="pt-4 text-xs text-gray-400 font-mono">
              Current width: {currentWidth}px • Need: ≤ 768px
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Landscape Warning
  if (isMobile && !isPortrait) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-400 to-pink-600 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-white"
        >
          <motion.div
            animate={{ rotate: 90 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Smartphone className="w-20 h-20 mx-auto" />
            </motion.div>
          </motion.div>

          <h2 className="text-2xl font-bold mb-3">Please Rotate Your Device</h2>

          <p className="text-rose-100 text-lg">
            For better experience, please use portrait mode
          </p>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}

/* ───────────────────────── Main Content Component ───────────────────────── */

function HomeContent() {
  const searchParams = useSearchParams();
  const [language, setLanguage] = useState<Language>("en");
  const [currentScreen, setCurrentScreen] = useState(0);
  const [isRSVPSubmitted, setIsRSVPSubmitted] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [showBottomNav, setShowBottomNav] = useState(false);
  const [showInvalidInvite, setShowInvalidInvite] = useState(true);

  const inviteId = searchParams.get("invite");

  const guest = useMemo(() => {
    if (inviteId) return getGuestById(inviteId);
    return null;
  }, [inviteId]);

  useEffect(() => {
    setShowBottomNav(false);
    const timer = setTimeout(() => setShowBottomNav(true), 5000);
    return () => clearTimeout(timer);
  }, [currentScreen]);

  useEffect(() => {
    if (inviteId && !guest && showInvalidInvite) {
      const timer = setTimeout(() => setShowInvalidInvite(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [inviteId, guest, showInvalidInvite]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentScreen]);

  const handleLanguageChange = useCallback((lang: Language) => {
    setLanguage(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedLanguage", lang);
    }
    setShowLanguageSelector(false);
  }, []);

  const handleLoadingComplete = () => {
    setShowLoader(false);
    if (typeof window !== "undefined") {
      const selectedLang = localStorage.getItem("selectedLanguage") as Language;
      if (selectedLang) {
        setLanguage(selectedLang);
      } else {
        setShowLanguageSelector(true);
      }
    } else {
      setShowLanguageSelector(true);
    }
  };

  const screens = [
    {
      component: <Hero language={language} guest={guest} />,
      nextLabel: {
        en: "View Countdown",
        hi: "काउंटडाउन देखें",
        gu: "કાઉન્ટડાઉન જુઓ",
        ko: "카운트다운 보기",
      },
    },
    {
      component: <Countdown language={language} />,
      nextLabel: {
        en: "Watch Video",
        hi: "वीडियो देखें",
        gu: "વીડિયો જુઓ",
        ko: "비디오 보기",
      },
    },
    {
      component: <VideoInvitation language={language} />,
      nextLabel: {
        en: "View Events",
        hi: "कार्यक्रम देखें",
        gu: "કાર્યક્રમો જુઓ",
        ko: "행사 보기",
      },
    },
    {
      component: <Events language={language} />,
      nextLabel: {
        en: "RSVP Now",
        hi: "जवाब दें",
        gu: "જવાબ આપો",
        ko: "지금 응답",
      },
    },
    {
      component: (
        <RSVP
          guest={guest}
          language={language}
          onSubmitSuccess={() => setIsRSVPSubmitted(true)}
          onFormValidChange={setIsFormValid}
          onSubmittingChange={setIsSubmitting}
          onGoToHome={() => {
            setCurrentScreen(0);
            setIsRSVPSubmitted(false);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      ),
      nextLabel: {
        en: "Submit",
        hi: "पूर्ण",
        gu: "પૂર્ણ",
        ko: "제출",
      },
      submitLabel: {
        en: "Submitting...",
        hi: "जमा हो रहा है...",
        gu: "સબમિટ થઈ રહ્યું છે...",
        ko: "제출 중...",
      },
    },
  ];

  const goNext = useCallback(() => {
    if (currentScreen === 4) {
      window.dispatchEvent(new CustomEvent("submitRSVP"));
    } else {
      setCurrentScreen((s) => s + 1);
    }
  }, [currentScreen]);

  const goBack = useCallback(() => {
    if (currentScreen > 0) {
      setCurrentScreen((s) => s - 1);
      if (currentScreen === 4) setIsRSVPSubmitted(false);
    }
  }, [currentScreen]);

  const shouldShowBottomNav = !(currentScreen === 4 && isRSVPSubmitted);

  return (
    <MobileOnlyWrapper>
      {showLoader && (
        <WeddingLoader onLoadingComplete={handleLoadingComplete} />
      )}

      {!showLoader && showLanguageSelector && (
        <LanguageSelector onLanguageSelect={handleLanguageChange} />
      )}

      {!showLoader && !showLanguageSelector && (
        <>
          {inviteId && !guest && showInvalidInvite && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ ...iosSpring }}
              className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-rose-100 border border-rose-300 px-6 py-3 rounded-xl shadow-lg"
            >
              ⚠️ Invalid invitation code
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={currentScreen}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ ...iosSpring }}
            >
              {screens[currentScreen].component}
            </motion.div>
          </AnimatePresence>

          <AnimatePresence>
            {shouldShowBottomNav && showBottomNav && (
              <motion.div
                initial={{ y: 96, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 96, opacity: 0 }}
                transition={{ ...iosSoftSpring }}
                className="fixed bottom-0 left-0 right-0"
              >
                <div className="max-w-md mx-auto px-6 py-4 flex gap-3">
                  {currentScreen > 0 && (
                    <motion.button
                      whileTap={{ scale: 0.92 }}
                      transition={{ ...iosSpring }}
                      onClick={goBack}
                      className="w-auto px-4 h-12 bg-rose-50 rounded-2xl shadow"
                    >
                      <ArrowLeft />
                    </motion.button>
                  )}

                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    transition={{ ...iosSpring }}
                    disabled={
                      (currentScreen === 4 && !isFormValid) || isSubmitting
                    }
                    onClick={goNext}
                    className={`flex-1 rounded-2xl py-3 shadow text-white ${
                      currentScreen === 4 && (!isFormValid || isSubmitting)
                        ? "bg-rose-300 cursor-not-allowed"
                        : "bg-rose-500"
                    }`}
                  >
                    {currentScreen === 4 && isSubmitting
                      ? screens[currentScreen].submitLabel![language]
                      : screens[currentScreen].nextLabel[language]}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </MobileOnlyWrapper>
  );
}

/* ───────────────────────── Wrapper with Suspense ───────────────────────── */

export default function Home() {
  return (
    <main className="min-h-screen bg-white overflow-hidden">
      <Suspense fallback={<div className="min-h-screen bg-white" />}>
        <HomeContent />
      </Suspense>
    </main>
  );
}
