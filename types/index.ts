export type Language = "en" | "hi" | "gu" | "ko";

// AND UPDATE Event interface:
export interface Event {
  name: {
    en: string;
    hi: string;
    gu: string;
    ko: string; // ADD
  };
  date: string;
  time: string;
  location: {
    en: string;
    hi: string;
    gu: string;
    ko: string; // ADD
  };
  mapUrl: string;
  image: string;
}

// UPDATE Guest interface:
export interface Guest {
  id: string;
  name: string;
  nameHi: string;
  nameGu: string;
  nameKo: string; // ADD
}
