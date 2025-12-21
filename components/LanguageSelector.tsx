"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe } from "lucide-react";

// Mock types - replace with your actual types
type Language = "en" | "hi" | "gu";

interface LanguageSelectorProps {
  onLanguageSelect: (lang: Language) => void;
}

// iOS-like spring transition
const springTransition = {
  type: "spring" as const,
  stiffness: 350,
  damping: 35,
  mass: 1,
};

// iOS-style easing function
const iosEase = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

// Motion variants for overlay and modal content
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25, ease: iosEase } },
  exit: { opacity: 0, transition: { duration: 0.2, ease: iosEase } },
};

const contentVariants = {
  hidden: { scale: 0.95, opacity: 0, y: 30 },
  visible: { scale: 1, opacity: 1, y: 0, transition: springTransition },
  exit: {
    scale: 0.95,
    opacity: 0,
    y: 30,
    transition: { ...springTransition, damping: 30 },
  },
};

export default function LanguageSelector({
  onLanguageSelect,
}: LanguageSelectorProps) {
  // In-memory storage instead of localStorage
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(
    null
  );
  const hasInitialized = useRef(false);

  // Stable callback reference
  const handleLanguageCallback = useCallback(
    (lang: Language) => {
      onLanguageSelect(lang);
    },
    [onLanguageSelect]
  );

  useEffect(() => {
    if (!hasInitialized.current && selectedLanguage) {
      hasInitialized.current = true;
      handleLanguageCallback(selectedLanguage);
    }
  }, [selectedLanguage, handleLanguageCallback]);

  const handleLanguageSelect = (lang: Language) => {
    setSelectedLanguage(lang);
    handleLanguageCallback(lang);
  };

  // Compute showModal based on state instead of managing it separately
  const showModal = selectedLanguage === null;

  const languages = [
    { lang: "en" as Language, label: "English", native: "English", flag: "🇬🇧" },
    { lang: "hi" as Language, label: "Hindi", native: "हिंदी", flag: "🇮🇳" },
    {
      lang: "gu" as Language,
      label: "Gujarati",
      native: "ગુજરાતી",
      flag: "🇮🇳",
    },
  ];

  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-6 font-sans"
        >
          <motion.div
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-br from-rose-50 to-rose-100/40 px-8 py-10 text-center border-b border-rose-100">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg border border-rose-100">
                <Globe className="w-8 h-8 text-rose-500" strokeWidth={1.5} />
              </div>

              <h2 className="font-serif text-3xl text-slate-800 mb-1 tracking-tight">
                Welcome
              </h2>
              <p className="text-sm text-slate-600 font-light tracking-wide">
                Choose Your Preferred Language
              </p>
            </div>

            {/* Language Options */}
            <div className="p-6 space-y-3">
              {languages.map(({ lang, label, native, flag }) => (
                <motion.button
                  key={lang}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  onClick={() => handleLanguageSelect(lang)}
                  className="w-full bg-white hover:bg-rose-50 border-2 border-rose-100 hover:border-rose-300 rounded-2xl p-5 transition-all duration-200 shadow-sm hover:shadow-md group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{flag}</span>
                      <div className="text-left">
                        <p className="text-base font-medium text-slate-800 group-hover:text-rose-600 transition-colors tracking-wide">
                          {label}
                        </p>
                        <p className="text-sm text-slate-500 font-light tracking-wide">
                          {native}
                        </p>
                      </div>
                    </div>
                    <svg
                      className="w-5 h-5 text-slate-300 group-hover:text-rose-500 transition-colors"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Footer */}
            <div className="px-6 pb-6 pt-2">
              <p className="text-xs text-center text-slate-400 font-light tracking-wide">
                You can not change this later
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
