import { motion, PanInfo } from "framer-motion";
import { useState } from "react";
import { MapPin, Clock } from "lucide-react";

type Language = "en" | "hi" | "gu" | "ko";

interface EventsProps {
  language: Language;
}

const iosSpring = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
  mass: 0.8,
};

const iosSoftSpring = {
  type: "spring" as const,
  stiffness: 200,
  damping: 24,
  mass: 0.9,
};

const iosFade = {
  duration: 0.35,
  ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
};

const translations = {
  eventsTitle: {
    en: "Wedding Events",
    hi: "शादी के कार्यक्रम",
    gu: "લગ્ન કાર્યક્રમો",
    ko: "결혼식 일정",
  },
  viewOnMap: {
    en: "View on Map",
    hi: "मैप पर देखें",
    gu: "નકશા પર જુઓ",
    ko: "지도에서 보기",
  },
};

const groomsEventsByDay = [
  {
    date: "23rd January 2025",
    dayNumber: 1,
    dayLabel: {
      en: "Day 1",
      hi: "दिन 1",
      gu: "દિવસ 1",
      ko: "1일차",
    },
    location: {
      en: "Babra",
      hi: "बाबरा",
      gu: "બાબરા",
      ko: "바브라",
    },
    mapUrl: "https://maps.app.goo.gl/xoUPNp8t32wtwX4H8",
    events: [
      {
        name: {
          en: "Sanjina Geet",
          hi: "सांजिना गीत",
          gu: "સાંજિના ગીત",
          ko: "산지나 गीत (전통 노래)",
        },
        date: "23rd January 2025",
        time: "5:00 PM",
        image: "/images/optimized/sanjinaGeet.webp",
      },
      {
        name: {
          en: "Dandiya Raas",
          hi: "डांडिया रास",
          gu: "ડાંડીયા રાસ",
          ko: "단디야 라스",
        },
        date: "23rd January 2025",
        time: "9:00 PM",
        image: "/images/optimized/dandiyaRaas.webp",
      },
    ],
  },
  {
    date: "24th January 2025",
    dayNumber: 2,
    dayLabel: {
      en: "Day 2",
      hi: "दिन 2",
      gu: "દિવસ 2",
      ko: "2일차",
    },
    location: {
      en: "Babra",
      hi: "बाबरा",
      gu: "બાબરા",
      ko: "바브라",
    },
    mapUrl: "https://maps.app.goo.gl/xoUPNp8t32wtwX4H8",
    events: [
      {
        name: {
          en: "Mandap Muhrat",
          hi: "मंडप",
          gu: "મંડપ",
          ko: "만답 무후르트",
        },
        date: "24th January 2025",
        time: "9:00 AM",
        image: "/images/optimized/mandapMuhrat.webp",
      },
      {
        name: {
          en: "Mamera",
          hi: "मामेरा",
          gu: "મામેરા",
          ko: "마메라 의식",
        },
        date: "24th January 2025",
        time: "11:00 AM",
        image: "/images/optimized/mamera.webp",
      },
      {
        name: {
          en: "Jamanvar",
          hi: "जमणवार",
          gu: "જમણવાર",
          ko: "자만바르 (연회)",
        },
        date: "24th January 2025",
        time: "12:30 PM",
        image: "/images/optimized/jamanvar.webp",
      },
      {
        name: {
          en: "Pithi",
          hi: "पीठी समारोह",
          gu: "પીઠી",
          ko: "피티 의식",
        },
        date: "24th January 2025",
        time: "3:30 PM",
        image: "/images/optimized/pithi.webp",
      },
    ],
  },
  {
    date: "25th January 2025",
    dayNumber: 3,
    dayLabel: {
      en: "Day 3",
      hi: "दिन 3 - राजकोट",
      gu: "દિવસ 3 - રાજકોટ",
      ko: "3일차 - 라지코트",
    },
    location: {
      en: "Rajkot",
      hi: "राजकोट",
      gu: "રાજકોટ",
      ko: "라지코트",
    },
    mapUrl: "https://maps.google.com/?q=Rajkot,Gujarat",
    events: [
      {
        name: {
          en: "Jan Prasthan",
          hi: "जन प्रस्थान",
          gu: "જન પ્રસ્થાન",
          ko: "잔 프라સ્થાન (출발 의식)",
        },
        date: "25th January 2025",
        time: "05:00 AM",
        image: "/images/optimized/janPrasthan.webp",
      },
      {
        name: {
          en: "Chundadi Vidhi",
          hi: "चुनरी विधि",
          gu: "ચુંદડી વિધિ",
          ko: "춘다디 의식",
        },
        date: "25th January 2025",
        time: "9:00 AM",
        image: "/images/optimized/chundadiVidhi.webp",
      },
      {
        name: {
          en: "Hast Melap",
          hi: "वरघोड़ा",
          gu: "વરઘોડો",
          ko: "하스트 멜랍",
        },
        date: "25th January 2025",
        time: "10:30 AM",
        image: "/images/optimized/hastMelap.webp",
      },
    ],
  },
];

export default function Events({ language = "en" }: EventsProps) {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleCardClick = (index: number) => {
    if (!isDragging) {
      setSelectedDayIndex(index);
    }
  };

  const handleMapClick = (e: React.MouseEvent, mapUrl: string) => {
    e.stopPropagation();
    window.open(mapUrl, "_blank", "noopener,noreferrer");
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const swipeThreshold = 50;
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset < -swipeThreshold || velocity < -500) {
      setSelectedDayIndex((prev) =>
        prev < groomsEventsByDay.length - 1 ? prev + 1 : prev
      );
    } else if (offset > swipeThreshold || velocity > 500) {
      setSelectedDayIndex((prev) => (prev > 0 ? prev - 1 : prev));
    }

    setTimeout(() => setIsDragging(false), 100);
  };

  const getCardPosition = (index: number) => {
    const diff = index - selectedDayIndex;
    const total = groomsEventsByDay.length;

    let normalized = diff;
    if (diff > total / 2) normalized = diff - total;
    if (diff < -total / 2) normalized = diff + total;

    if (normalized === 0) {
      return {
        x: "0%",
        scale: 1,
        y: -10,
        zIndex: 30,
        opacity: 1,
        visible: true,
      };
    }

    if (normalized === -1) {
      return {
        x: "-40%",
        scale: 0.5,
        y: 0,
        zIndex: 10,
        opacity: 0.6,
        visible: true,
      };
    }

    if (normalized === 1) {
      return {
        x: "40%",
        scale: 0.5,
        y: 0,
        zIndex: 10,
        opacity: 0.6,
        visible: true,
      };
    }

    return {
      x: normalized < 0 ? "-120%" : "120%",
      scale: 0.8,
      y: 0,
      zIndex: 0,
      opacity: 0,
      visible: false,
    };
  };

  return (
    <>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgb(254 242 242);
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, rgb(244 63 94), rgb(236 72 153));
          border-radius: 10px;
          transition: all 0.3s ease;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, rgb(225 29 72), rgb(219 39 119));
        }
        
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgb(244 63 94) rgb(254 242 242);
        }
      `}</style>

      <section className="min-h-screen bg-gradient-to-b from-rose-50 to-white pb-4 overflow-hidden flex">
        <div className="w-full max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={iosSoftSpring}
            className="text-center my-10"
          >
            <h2 className="font-serif text-2xl text-slate-800">
              {translations.eventsTitle[language]}
            </h2>
            <div className="w-16 h-px bg-rose-300 mx-auto mt-3" />
            <p className="text-sm text-slate-500 mt-3">
              Day {selectedDayIndex + 1} of {groomsEventsByDay.length}
            </p>
          </motion.div>

          <div className="relative touch-pan-y">
            <div className="relative h-[480px] flex items-center justify-center">
              {groomsEventsByDay.map((day, dayIndex) => {
                const position = getCardPosition(dayIndex);
                const isCenter = dayIndex === selectedDayIndex;

                return (
                  <motion.div
                    key={dayIndex}
                    initial={{ opacity: 0, scale: 0.94, y: 30 }}
                    animate={{
                      x: position.x,
                      scale: position.scale,
                      y: position.y,
                      opacity: position.opacity,
                      zIndex: position.zIndex,
                    }}
                    drag={isCenter ? "x" : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.1}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    transition={{
                      x: iosSpring,
                      y: iosSpring,
                      scale: iosSpring,
                      opacity: iosFade,
                    }}
                    onClick={() => handleCardClick(dayIndex)}
                    className={`absolute w-[290px] cursor-pointer select-none ${
                      !position.visible ? "pointer-events-none" : ""
                    }`}
                  >
                    <motion.div
                      whileHover={
                        isCenter && !isDragging
                          ? { y: -6, scale: 1.02 }
                          : undefined
                      }
                      whileTap={
                        isCenter && !isDragging
                          ? { scale: 0.98 }
                          : { scale: 0.95 }
                      }
                      transition={iosSoftSpring}
                      className="bg-white backdrop-blur-xl shadow-xl rounded-3xl overflow-hidden border border-gray-200/50 p-3"
                    >
                      <div className="px-5 py-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <h3 className="font-serif text-lg font-bold text-slate-800 tracking-tight">
                              {day.dayLabel[language]}
                            </h3>
                            <p className="text-xs text-slate-500 mt-1 font-medium">
                              {day.date}
                            </p>

                            <motion.button
                              onClick={(e) => handleMapClick(e, day.mapUrl)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-rose-600 hover:text-rose-700 transition-colors"
                            >
                              <MapPin className="w-3.5 h-3.5" />
                              {day.location[language]}
                            </motion.button>
                          </div>

                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, ...iosSoftSpring }}
                            className="bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg shadow-rose-200/50 whitespace-nowrap"
                          >
                            {day.events.length}{" "}
                            {day.events.length === 1 ? "Event" : "Events"}
                          </motion.div>
                        </div>
                      </div>

                      <div className="p-2 space-y-3 max-h-[300px] overflow-y-auto rounded-xl bg-white border border-slate-200 shadow-inner custom-scrollbar">
                        {day.events.map((event, eventIndex) => (
                          <motion.div
                            key={eventIndex}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              delay: eventIndex * 0.08,
                              ...iosSoftSpring,
                            }}
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-gradient-to-br from-white to-rose-50/30 rounded-xl overflow-hidden transition-all duration-300"
                          >
                            <div className="relative h-34 overflow-hidden">
                              <motion.div
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.4 }}
                                className="w-full h-full"
                              >
                                <div className="relative w-[245px] h-[135px] overflow-hidden">
                                  <img
                                    src={event.image}
                                    alt={event.name[language]}
                                    className="w-full h-full object-cover"
                                    style={{ objectPosition: "center 25%" }}
                                  />
                                </div>
                              </motion.div>

                              <div className="absolute bottom-0 left-0 right-0 h-[30%] bg-gradient-to-t from-black/60 via-gray-900/35 to-transparent" />
                              <div className="absolute bottom-0 left-0 right-0 h-[30%] bg-gradient-to-t from-black/25 via-gray-800/25 to-transparent blur-sm" />

                              <motion.h5
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="absolute bottom-1 left-2 font-serif text-xs text-white drop-shadow-2xl font-semibold flex items-center gap-1"
                              >
                                {event.name[language]}
                              </motion.h5>
                              <motion.h6
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="absolute bottom-1 right-2 font-serif text-xs text-white drop-shadow-2xl font-semibold flex items-center gap-1"
                              >
                                <Clock className="w-3.5 h-3.5" />
                                {event.time}
                              </motion.h6>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="text-center">
            <p className="text-xs text-slate-400 mt-6">← Swipe to navigate →</p>
          </div>
        </div>
      </section>
    </>
  );
}
