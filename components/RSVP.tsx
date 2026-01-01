"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HeartHandshake, Heart, Sparkles, AlertCircle } from "lucide-react";

import { Guest } from "@/lib/guestData";
import ProgressiveImage from "./ProgressiveImage"; // ✅ ADDED

interface RSVPProps {
  language: "en" | "hi" | "gu";
  onSubmitSuccess?: () => void;
  onFormValidChange?: (isValid: boolean) => void;
  onSubmittingChange?: (isSubmitting: boolean) => void;
  guest?: Guest | null;
  onGoToHome?: () => void;
}

/* -------------------- translations (unchanged) -------------------- */
const translations = {
  rsvpTitle: {
    en: "RSVP",
    hi: "उपस्थिति की पुष्टि करें",
    gu: "હાજરીની પુષ્ટિ કરો",
  },
  rsvpSubtitle: {
    en: "Please let us know if you can join us",
    hi: "कृपया हमें बताएं कि क्या आप हमारे साथ शामिल हो सकते हैं",
    gu: "કૃપા કરીને અમને જણાવો કે તમે અમારી સાથે જોડાઈ શકો છો",
  },
  form: {
    name: { en: "Full Name", hi: "पूरा नाम", gu: "પૂરું નામ" },
    attending: {
      en: "Will you be attending?",
      hi: "क्या आप उपस्थित होंगे?",
      gu: "શું તમે હાજર રહેશો?",
    },
    yes: {
      en: "Yes, I'll be there!",
      hi: "हां, मैं वहां रहूंगा!",
      gu: "હા, હું ત્યાં હોઈશ!",
    },
    no: {
      en: "Sorry, can't make it",
      hi: "क्षमा करें, नहीं आ सकूंगा",
      gu: "માફ કરશો, આવી શકીશ નહીં",
    },
    success: {
      en: "Thank you for your response!",
      hi: "आपकी प्रतिक्रिया के लिए धन्यवाद!",
      gu: "તમારા પ્રતિભાવ બદલ આભાર!",
    },
    successMessage: {
      en: "We look forward to celebrating with you!",
      hi: "हम आपके साथ जश्न मनाने के लिए उत्सुक हैं",
      gu: "અમે તમારી સાથે ઉજવણી કરવા માટે આતુર છીએ!",
    },
    successSubtitle: {
      en: "Your presence will make our day complete",
      hi: "आपकी उपस्थिति हमारे दिन को पूर्ण बना देगी",
      gu: "તમારી હાજરી અમારા દિવસને પૂર્ણ બનાવશે",
    },
    error: {
      en: "Something went wrong. Please try again.",
      hi: "कुछ गलत हुआ। कृपया पुनः प्रयास करें।",
      gu: "કંઈક ખોટું થયું. કૃપા કરીને ફરી પ્રયાસ કરો.",
    },
  },
};

const iosSpring = {
  type: "spring" as const,
  stiffness: 300,
  damping: 25,
  mass: 1,
};
const iosEase: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

export default function RSVP({
  language,
  onSubmitSuccess,
  onFormValidChange,
  onSubmittingChange,
  guest,
  onGoToHome,
}: RSVPProps) {
  const [formData, setFormData] = useState({
    name: "",
    attending: "yes",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    if (guestName) {
      setFormData((prev) => ({
        ...prev,
        name: guestName,
      }));
    }
  }, [guestName]);

  useEffect(() => {
    const isValid = formData.name.trim() !== "";
    if (onFormValidChange) onFormValidChange(isValid);
  }, [formData, onFormValidChange]);

  useEffect(() => {
    if (onSubmittingChange) onSubmittingChange(isSubmitting);
  }, [isSubmitting, onSubmittingChange]);

  // ✅ FIX 1: Confetti cleanup after animation
  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault();

      setIsSubmitting(true);
      setError(null);

      try {
        const scriptURL = `https://script.google.com/macros/s/AKfycbya9t7e30FLmFdXwjPYbcj8ro2a2j0woUNsySjRQns05XNlQXybAzd-_Axyfj-kcYZh/exec`;

        const timestamp = new Date().toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
        });

        // ✅ FIX 2: Use URLSearchParams for guaranteed order and proper encoding
        const params = new URLSearchParams({
          timestamp,
          name: formData.name.trim(),
          attending: formData.attending,
          language,
          guestId: guest?.id || "walk-in",
        });

        const response = await fetch(scriptURL, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: params.toString(),
        });

        if (!response.ok)
          throw new Error(`Server responded with ${response.status}`);

        const result = await response.json();

        if (result.result === "success") {
          setIsSubmitted(true);
          setShowConfetti(true);
          if (onSubmitSuccess) onSubmitSuccess();

          setFormData({
            name: guestName || "",
            attending: "yes",
          });
        } else {
          throw new Error(result.error || "Submission failed");
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        setError(errorMessage);
        console.error("RSVP submission error:", errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, language, onSubmitSuccess, guestName, guest]
  );

  // ✅ FIX 3: Properly typed custom event
  useEffect(() => {
    const handleSubmitEvent = () => handleSubmit();
    window.addEventListener("submitRSVP", handleSubmitEvent);
    return () => window.removeEventListener("submitRSVP", handleSubmitEvent);
  }, [handleSubmit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user makes changes
    if (error) setError(null);
  };

  if (isSubmitted) {
    const confettiColors = [
      "#ff6b9d",
      "#ffc3a0",
      "#ff8fab",
      "#c06c84",
      "#f67280",
    ];
    const confettiParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      delay: Math.random() * 0.5,
      duration: 2 + Math.random() * 2,
      x: Math.random() * 100,
      rotation: Math.random() * 360,
    }));

    return (
      <section className="min-h-screen flex items-center justify-center px-6 py-12 bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 relative overflow-hidden font-sans">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={`heart-${i}`}
              className="absolute"
              initial={{ y: "100%", x: `${20 + i * 15}%`, opacity: 0 }}
              animate={{ y: "-100%", opacity: [0, 0.6, 0.6, 0] }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                delay: i * 1.5,
                ease: iosEase,
              }}
            >
              <Heart className="w-8 h-8 text-rose-300 fill-rose-200" />
            </motion.div>
          ))}

          <AnimatePresence>
            {showConfetti &&
              confettiParticles.map((particle) => (
                <motion.div
                  key={particle.id}
                  className="absolute"
                  style={{ left: `${particle.x}%`, top: "-5%" }}
                  initial={{ y: 0, opacity: 1, scale: 0.5 }}
                  animate={{
                    y: "110vh",
                    opacity: [1, 1, 0],
                    rotate: particle.rotation,
                    scale: [0.5, 1, 0.5],
                  }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: particle.duration,
                    delay: particle.delay,
                    ease: iosEase,
                  }}
                >
                  <Heart className="w-4 h-4 text-rose-400 fill-rose-300" />
                </motion.div>
              ))}
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ ...iosSpring, duration: 0.6 }}
          className="relative z-10 text-center max-w-2xl"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ ...iosSpring, delay: 0.2 }}
            className="relative mx-auto mb-8"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: iosEase }}
              className="absolute inset-0 w-32 h-32 mx-auto bg-pink-200 rounded-full blur-xl"
            />
            <div className="relative w-32 h-32 flex items-center justify-center mx-auto">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ ...iosSpring, delay: 0.4 }}
              >
                <HeartHandshake
                  className="w-36 h-36 text-rose-400"
                  strokeWidth={3}
                />
              </motion.div>
            </div>
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  top: "50%",
                  left: "50%",
                  transform: `rotate(${i * 90}deg) translateY(-80px)`,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  repeatDelay: 0.5,
                }}
              >
                <Sparkles className="w-6 h-6 text-amber-400 fill-amber-300" />
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6, ease: iosEase }}
            className="space-y-4"
          >
            <h3 className="font-serif text-4xl text-slate-800 mb-8 font-bold">
              {translations.form.success[language]}
            </h3>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100px" }}
              transition={{ delay: 0.7, duration: 0.8, ease: iosEase }}
              className="h-1 bg-gradient-to-r from-transparent via-rose-400 to-transparent mx-auto rounded-full mt-8"
            />
            <motion.p className="text-slate-700 text-xl mb-2 font-light px-4">
              {translations.form.successMessage[language]}
            </motion.p>
            <motion.p className="text-slate-600 font-light px-4">
              {translations.form.successSubtitle[language]}
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.2, duration: 0.5, ease: iosEase }}
            className="mt-4 flex justify-center gap-3"
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: iosEase,
                }}
              >
                <Heart className="w-6 h-6 text-rose-400 fill-rose-300" />
              </motion.div>
            ))}
          </motion.div>

          <motion.button
            onClick={onGoToHome}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...iosSpring, delay: 1 }}
            className="mt-12 px-5 py-2 text-rose-400 font-medium rounded-xl transition-all duration-300 hover:text-rose-500 hover:bg-rose-50 hover:underline underline-offset-4"
          >
            {language === "hi"
              ? "मुख्य पृष्ठ पर जाएँ"
              : language === "gu"
              ? "મુખ્ય પાનું ખોલો"
              : "Go to Invitation"}
          </motion.button>
        </motion.div>
      </section>
    );
  }

  /* ==================== FORM VIEW WITH NEW BACKGROUND ==================== */

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: iosEase }}
      className="relative min-h-screen flex items-start justify-center px-3 py-3 font-sans overflow-hidden"
    >
      {/* 🌄 BACKGROUND (Countdown style) */}
      <div className="absolute inset-0 z-0">
        <ProgressiveImage
          src="/images/optimized/rsvp.webp"
          alt="RSVP Background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        {/* dark overlay */}
        <div className="absolute inset-0 bg-black/30" />

        {/* rose bottom gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-rose-900/40 via-transparent to-transparent" />
      </div>

      {/* 🧾 FOREGROUND CARD */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.1, ease: iosEase }}
        className="relative z-10 w-90 mx-auto bg-white backdrop-blur-xl rounded-2xl mt-14 shadow-2xl"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: iosEase }}
          className="text-center bg-black rounded-t-2xl py-2 mb-3"
        >
          <p className="text-lg text-white font-light">
            {translations.rsvpSubtitle[language]}
          </p>
        </motion.div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ ease: iosEase }}
              className="mb-4 mx-4"
            >
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex gap-3">
                <AlertCircle className="w-5 h-5 mt-0.5" />
                <div>
                  <p className="font-medium">
                    {translations.form.error[language]}
                  </p>
                  <p className="text-xs opacity-75">{error}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6, ease: iosEase }}
          onSubmit={(e) => e.preventDefault()}
          className="space-y-5 w-[75vw] mx-auto pb-6"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.5, ease: iosEase }}
          >
            <label
              htmlFor="rsvp-name"
              className="block text-sm text-black mb-2 font-light"
            >
              {translations.form.name[language]}
            </label>
            <input
              id="rsvp-name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={!!guestName}
              aria-label={translations.form.name[language]}
              className={`w-full px-2 py-1 bg-white border border-rose-100 rounded-xl focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-200 transition-all ${
                !!guestName ? "bg-gray-50 cursor-not-allowed" : ""
              }`}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.5, ease: iosEase }}
            className="mb-5"
          >
            <fieldset>
              <legend className="block text-sm text-black mb-3 font-light">
                {translations.form.attending[language]}
              </legend>
              <div className="grid grid-cols-2 gap-3">
                {["yes", "no"].map((val, index) => (
                  <motion.label
                    key={val}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: 0.8 + index * 0.1,
                      duration: 0.4,
                      ease: iosEase,
                    }}
                    htmlFor={`attending-${val}`}
                    className={`flex items-center justify-center border rounded-xl cursor-pointer transition-all px-2 py-1 ${
                      formData.attending === val
                        ? "border-rose-300 bg-rose-50 ring-2 ring-rose-200"
                        : "border-rose-100 hover:border-rose-200 hover:bg-rose-25"
                    }`}
                  >
                    <input
                      id={`attending-${val}`}
                      type="radio"
                      name="attending"
                      value={val}
                      checked={formData.attending === val}
                      onChange={handleChange}
                      className="sr-only"
                      aria-label={
                        translations.form[val as "yes" | "no"][language]
                      }
                    />
                    <span className="text-sm font-light">
                      {translations.form[val as "yes" | "no"][language]}
                    </span>
                  </motion.label>
                ))}
              </div>
            </fieldset>
          </motion.div>
        </motion.form>
      </motion.div>
    </motion.section>
  );
}
