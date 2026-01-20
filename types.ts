
export interface ZmanimData {
  sunrise: string;
  sunset: string;
  misheyakir: string;
  candleLighting: string;
  havdalah: string;
  hebrewDate: string;
  parasha: string;
}

export interface SynagogueTimes {
  minchaDaily: string;
  minchaGedolaShabbat: string;
  minchaKetanaShabbat: string;
}

export interface Lesson {
  title: string;
  teacher: string;
  time: string;
  days: string;
  description?: string;
}

export interface EventConfig {
  isActive: boolean;
  familyName: string;
  coupleNames: string;
  displayDuration: number;
}

export interface DedicationConfig {
  isActive: boolean;
  successName: string;      // השם להצלחת
  familySubText: string;    // הטקסט שמתחת ל"ומשפחתו"
  displayDuration: number;
}

export interface CustomContentConfig {
  isActive: boolean;
  imageData: string;        // Base64 של התמונה
  displayDuration: number;
  title: string;
}

export interface CelebrationSettings {
  wedding: EventConfig;
  son_birth: EventConfig;
  daughter_birth: EventConfig;
  dedication: DedicationConfig;
  custom: CustomContentConfig;
}

export type CelebrationType = 'wedding' | 'son_birth' | 'daughter_birth' | 'dedication' | 'custom';

export interface CelebrationData extends EventConfig {
  type: CelebrationType;
}
