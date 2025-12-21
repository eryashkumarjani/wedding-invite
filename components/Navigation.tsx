"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, Transition } from "framer-motion";
import { Home, Globe } from "lucide-react";

type Language = "en" | "hi" | "gu";

interface NavigationProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

// TS-safe spring transition
const spring: Transition = {
  type: "spring" as const,
  stiffness: 500,
  damping: 40,
  mass: 1,
};

export default function Navigation({
  language,
  onLanguageChange,
}: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const languages = [
    { code: "en" as Language, label: "English", flag: "🇬🇧" },
    { code: "hi" as Language, label: "हिंदी", flag: "🇮🇳" },
    { code: "gu" as Language, label: "ગુજરાતી", flag: "🇮🇳" },
  ];

  const handleLanguageChange = (lang: Language) => {
    onLanguageChange(lang);
    setShowLanguageMenu(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Desktop Navigation */}
      <motion.nav
        initial={{ y: -120, opacity: 0 }}
        animate={{ y: 0, opacity: 1, transition: spring }}
        className={`fixed top-0 left-0 right-0 z-40 font-sans transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-xl py-4"
            : "bg-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo/Title */}
            <motion.div
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              transition={spring}
              className="flex items-center gap-2 cursor-pointer"
              onClick={scrollToTop}
            >
              <div className="w-10 h-10 bg-rose-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">💑</span>
              </div>
              <span className="font-serif font-bold text-xl text-gray-800">
                Our Wedding
              </span>
            </motion.div>

            {/* Language Selector */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                transition={spring}
                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                className="flex items-center gap-2 px-4 py-2 bg-rose-50 hover:bg-rose-100 rounded-full border-2 border-rose-200 font-sans transition-colors"
              >
                <Globe className="w-5 h-5 text-rose-500" />
                <span className="text-rose-500 font-semibold">
                  {languages.find((l) => l.code === language)?.flag}
                </span>
              </motion.button>

              <AnimatePresence>
                {showLanguageMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -15 }}
                    animate={{ opacity: 1, y: 0, transition: spring }}
                    exit={{ opacity: 0, y: -15, transition: spring }}
                    className="absolute right-0 mt-2 bg-white rounded-2xl shadow-2xl border-2 border-rose-200 overflow-hidden"
                  >
                    {languages.map((lang) => (
                      <motion.button
                        key={lang.code}
                        whileHover={{ backgroundColor: "#FFE4E6" }}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`w-full px-6 py-3 text-left flex items-center gap-3 font-sans transition-colors ${
                          language === lang.code ? "bg-rose-50" : ""
                        }`}
                      >
                        <span className="text-2xl">{lang.flag}</span>
                        <span className="font-sans font-medium text-gray-800">
                          {lang.label}
                        </span>
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {isScrolled && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1, transition: spring }}
            exit={{ opacity: 0, scale: 0, transition: spring }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 w-14 h-14 bg-rose-500 rounded-full shadow-2xl flex items-center justify-center z-30 hover:bg-rose-600 transition-colors"
          >
            <Home className="w-6 h-6 text-white" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
