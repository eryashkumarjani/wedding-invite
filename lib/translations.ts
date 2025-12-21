import { Event } from "@/types";

export const translations = {
  heroTitle: {
    en: "We're Getting Married!",
    hi: "हमारी शादी हो रही है!",
    gu: "અમારા લગ્ન થઈ રહ્યા છે!",
  },
  heroSubtitle: {
    en: "Join us in celebrating our special day",
    hi: "हमारे खास दिन का जश्न मनाने के लिए हमारे साथ शामिल हों",
    gu: "અમારા ખાસ દિવસની ઉજવણી કરવા માટે અમારી સાથે જોડાઓ",
  },
  weddingDate: {
    en: "January 25, 2026",
    hi: "25 जनवरी, 2026",
    gu: "25 જાન્યુઆરી, 2026",
  },
  countdown: {
    days: {
      en: "Days",
      hi: "दिन",
      gu: "દિવસ",
    },
    hours: {
      en: "Hours",
      hi: "घंटे",
      gu: "કલાક",
    },
    minutes: {
      en: "Minutes",
      hi: "मिनट",
      gu: "મિનિટ",
    },
    seconds: {
      en: "Seconds",
      hi: "सेकंड",
      gu: "સેકન્ડ",
    },
    title: {
      en: "Counting Down to Forever",
      hi: "हमेशा के लिए गिनती",
      gu: "હંમેશા માટે ગણતરી",
    },
  },
  videoSection: {
    title: { en: "A Special Message", hi: "एक विशेष संदेश", gu: "ખાસ સંદેશ" },
    message: {
      en: "With heartfelt joy and blessings, our families invite you to share in the celebration of our union. Your presence will make our day complete.",
      hi: "हार्दिक खुशी और आशीर्वाद के साथ, हमारे परिवार आपको हमारे मिलन के उत्सव में शामिल होने के लिए आमंत्रित करते हैं। आपकी उपस्थिति हमारे दिन को पूर्ण बना देगी।",
      gu: "હૃદયપૂર્વક આનંદ અને આશીર્વાદ સાથે, અમારા પરિવારો તમને અમારા મિલનની ઉજવણીમાં ભાગ લેવા માટે આમંત્રિત કરે છે. તમારી હાજરી અમારા દિવસને પૂર્ણ બનાવશે.",
    },
  },
  eventsTitle: {
    en: "Wedding Events",
    hi: "शादी के कार्यक्रम",
    gu: "લગ્ન કાર્યક્રમો",
  },
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
    name: {
      en: "Full Name",
      hi: "पूरा नाम",
      gu: "પૂરું નામ",
    },
    email: {
      en: "Email Address",
      hi: "ईमेल पता",
      gu: "ઈમેલ સરનામું",
    },
    phone: {
      en: "Phone Number",
      hi: "फोन नंबर",
      gu: "ફોન નંબર",
    },
    guests: {
      en: "Number of Guests",
      hi: "मेहमानों की संख्या",
      gu: "મહેમાનોની સંખ્યા",
    },
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
    message: {
      en: "Special Message (Optional)",
      hi: "विशेष संदेश (वैकल्पिक)",
      gu: "વિશેષ સંદેશ (વૈકલ્પિક)",
    },
    submit: {
      en: "Submit RSVP",
      hi: "भेजें",
      gu: "સબમિટ કરો",
    },
    submitting: {
      en: "Submitting...",
      hi: "जमा हो रहा है...",
      gu: "સબમિટ થઈ રહ્યું છે...",
    },
    success: {
      en: "Thank you for your response!",
      hi: "आपकी प्रतिक्रिया के लिए धन्यवाद!",
      gu: "તમારા પ્રતિભાવ બદલ આભાર!",
    },
  },
};

// Events data
export const events: Event[] = [
  {
    name: {
      en: "Mehendi Ceremony",
      hi: "मेहंदी समारोह",
      gu: "મેહંદી સમારોહ",
    },
    date: "23rd January 2026",
    time: "4:00 PM onwards",
    location: {
      en: "Bride's Residence",
      hi: "दुल्हन का निवास",
      gu: "વરરાજાનું નિવાસસ્થાન",
    },
    mapUrl: "https://maps.google.com/?q=YOUR_LOCATION_1",
    image:
      "https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    name: {
      en: "Sangeet Night",
      hi: "संगीत रात",
      gu: "સંગીત રાત્રિ",
    },
    date: "24th January 2026",
    time: "7:00 PM onwards",
    location: {
      en: "Grand Banquet Hall",
      hi: "ग्रैंड बैंक्वेट हॉल",
      gu: "ગ્રાન્ડ બેન્ક્વેટ હોલ",
    },
    mapUrl: "https://maps.google.com/?q=YOUR_LOCATION_2",
    image:
      "https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    name: {
      en: "Haldi Ceremony",
      hi: "हल्दी समारोह",
      gu: "હળદી સમારોહ",
    },
    date: "25th January 2026",
    time: "9:00 AM",
    location: {
      en: "Bride's Residence",
      hi: "दुल्हन का निवास",
      gu: "વરરાજાનું નિવાસસ્થાન",
    },
    mapUrl: "https://maps.google.com/?q=YOUR_LOCATION_1",
    image:
      "https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    name: {
      en: "Wedding Ceremony",
      hi: "विवाह समारोह",
      gu: "લગ્ન સમારોહ",
    },
    date: "25th January 2026",
    time: "6:00 PM",
    location: {
      en: "Grand Palace Gardens",
      hi: "ग्रांड पैलेस गार्डन",
      gu: "ગ્રાન્ડ પેલેસ ગાર્ડન્સ",
    },
    mapUrl: "https://maps.google.com/?q=YOUR_LOCATION_3",
    image:
      "https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
];
