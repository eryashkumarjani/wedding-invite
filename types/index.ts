export type Language = "en" | "hi" | "gu";

export interface Event {
  name: {
    en: string;
    hi: string;
    gu: string;
  };
  date: string;
  time: string;
  location: {
    en: string;
    hi: string;
    gu: string;
  };
  mapUrl: string;
  image: string;
}
