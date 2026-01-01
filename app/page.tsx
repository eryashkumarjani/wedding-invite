"use client";

import { useState, useEffect, useMemo, useCallback, Suspense } from "react";
import dynamic from "next/dynamic";
import { Language } from "@/types";
import { ArrowLeft } from "lucide-react";
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

  // FIX 1: Bottom nav timer with proper cleanup
  useEffect(() => {
    setShowBottomNav(false); // Pehle hide karo
    const timer = setTimeout(() => setShowBottomNav(true), 5000); // 5000ms = 5 seconds
    return () => clearTimeout(timer);
  }, [currentScreen]);

  // FIX 2: Invalid invite auto-hide after 5 seconds
  useEffect(() => {
    if (inviteId && !guest && showInvalidInvite) {
      const timer = setTimeout(() => setShowInvalidInvite(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [inviteId, guest, showInvalidInvite]);

  // FIX 3: Scroll to top on screen change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentScreen]);

  // FIX 4: Language update with localStorage persistence
  const handleLanguageChange = useCallback((lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("selectedLanguage", lang);
    setShowLanguageSelector(false);
  }, []);

  const handleLoadingComplete = () => {
    setShowLoader(false);
    const selectedLang = localStorage.getItem("selectedLanguage") as Language;
    if (selectedLang) {
      setLanguage(selectedLang);
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
      },
    },
    {
      component: <Countdown language={language} />,
      nextLabel: { en: "Watch Video", hi: "वीडियो देखें", gu: "વીડિયો જુઓ" },
    },
    {
      component: <VideoInvitation language={language} />,
      nextLabel: {
        en: "View Events",
        hi: "कार्यक्रम देखें",
        gu: "કાર્યક્રમો જુઓ",
      },
    },
    {
      component: <Events language={language} />,
      nextLabel: { en: "RSVP Now", hi: "जवाब दें", gu: "જવાબ આપો" },
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
      nextLabel: { en: "Submit", hi: "पूर्ण", gu: "પૂર્ણ" },
      submitLabel: {
        en: "Submitting...",
        hi: "जमा हो रहा है...",
        gu: "સબમિટ થઈ રહ્યું છે...",
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
    <>
      {showLoader && (
        <WeddingLoader onLoadingComplete={handleLoadingComplete} />
      )}

      {!showLoader && showLanguageSelector && (
        <LanguageSelector onLanguageSelect={handleLanguageChange} />
      )}

      {!showLoader && !showLanguageSelector && (
        <>
          {/* Invalid Invite - Auto dismisses after 5s */}
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

          {/* Screen Transitions */}
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

          {/* Bottom Navigation */}
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
    </>
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
