
import { Clock, Sun, Moon, BookOpen, Star, Sparkles, Calendar, Maximize, Minimize, Edit3, Plus, Trash2, Settings, PartyPopper, Heart, Eye, X, Check, Baby, Flower2, Volume2, ShieldCheck, User, Users, Image as ImageIcon, Upload, FileText } from 'lucide-react';
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { ZmanimData, Lesson, SynagogueTimes, CelebrationSettings, CelebrationType, EventConfig, DedicationConfig, CustomContentConfig } from './types';
import { fetchDailyHalakha } from './services/geminiService';

// --- איורים משודרגים ---

const TreeIllustration = ({ colorScale = 1 }) => (
  <svg viewBox="0 0 200 240" className="w-full h-full drop-shadow-2xl opacity-80">
    <defs>
      <linearGradient id="trunkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style={{ stopColor: '#5d4037', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#3e2723', stopOpacity: 1 }} />
      </linearGradient>
      <radialGradient id="leafGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" style={{ stopColor: '#81c784', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#2e7d32', stopOpacity: 1 }} />
      </radialGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <g transform={`scale(${colorScale})`} transform-origin="center">
      <path d="M90,240 Q100,180 100,140 M100,150 Q120,120 140,110 M100,160 Q70,120 50,115 M100,180 Q130,160 150,165" stroke="url(#trunkGrad)" strokeWidth="8" fill="none" strokeLinecap="round" />
      <path d="M100,240 L100,120" stroke="url(#trunkGrad)" strokeWidth="10" fill="none" />
      <circle cx="100" cy="70" r="45" fill="url(#leafGrad)" opacity="0.9" filter="url(#glow)" />
      <circle cx="70" cy="90" r="35" fill="url(#leafGrad)" opacity="0.85" />
      <circle cx="135" cy="95" r="38" fill="url(#leafGrad)" opacity="0.85" />
      <circle cx="105" cy="40" r="30" fill="#a5d6a7" opacity="0.7" />
      <circle cx="85" cy="75" r="6" fill="#fbbf24" filter="url(#glow)" />
      <circle cx="115" cy="65" r="6" fill="#fbbf24" filter="url(#glow)" />
      <circle cx="100" cy="100" r="5" fill="#f59e0b" />
      <circle cx="140" cy="85" r="5" fill="#fbbf24" filter="url(#glow)" />
      <circle cx="65" cy="100" r="6" fill="#f59e0b" />
    </g>
  </svg>
);

const CornerDecoration = () => (
  <svg viewBox="0 0 100 100" className="w-32 h-32 text-amber-500/30">
    <path d="M0,0 L100,0 M0,0 L0,100 M10,10 L90,10 M10,10 L10,90" fill="none" stroke="currentColor" strokeWidth="2" />
    <circle cx="10" cy="10" r="5" fill="currentColor" />
  </svg>
);

const PacifierIllustration = ({ color = "#38bdf8" }) => (
  <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-lg opacity-40">
    <circle cx="50" cy="40" r="15" fill={color} opacity="0.3" />
    <path d="M30,60 Q50,90 70,60" fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" />
    <rect x="35" y="45" width="30" height="15" rx="5" fill={color} />
    <circle cx="50" cy="30" r="10" fill={color} />
  </svg>
);

const BottleIllustration = ({ color = "#38bdf8" }) => (
  <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-lg opacity-40">
    <rect x="35" y="40" width="30" height="45" rx="5" fill="white" stroke={color} strokeWidth="3" />
    <rect x="35" y="35" width="30" height="8" rx="2" fill={color} />
    <path d="M42,35 Q50,20 58,35" fill="#fde68a" />
    <line x1="40" y1="50" x2="60" y2="50" stroke={color} strokeWidth="1" />
    <line x1="40" y1="60" x2="55" y2="60" stroke={color} strokeWidth="1" />
    <line x1="40" y1="70" x2="60" y2="70" stroke={color} strokeWidth="1" />
  </svg>
);

const RattleIllustration = ({ color = "#38bdf8" }) => (
  <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-lg opacity-40">
    <circle cx="50" cy="35" r="20" fill="none" stroke={color} strokeWidth="5" />
    <circle cx="50" cy="35" r="8" fill={color} />
    <rect x="47" y="55" width="6" height="30" rx="3" fill={color} />
    <circle cx="50" cy="85" r="8" fill="none" stroke={color} strokeWidth="4" />
  </svg>
);

const GroomIllustration = () => (
  <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
    <defs>
      <linearGradient id="suitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#1e293b', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#020617', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <path d="M40,200 L40,165 Q40,140 80,135 L120,135 Q160,140 160,165 L160,200 Z" fill="url(#suitGrad)" />
    <path d="M85,135 L115,135 L100,165 Z" fill="white" />
    <path d="M92,138 L108,138 L100,146 Z" fill="#020617" />
    <rect x="92" y="125" width="16" height="10" fill="#fde2e4" />
    <circle cx="100" cy="95" r="32" fill="#fde2e4" />
    <path d="M80,75 Q100,60 120,75" fill="#0f172a" />
  </svg>
);

const BrideIllustration = () => (
  <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
    <defs>
      <linearGradient id="dressGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#fff5f5', stopOpacity: 1 }} />
      </linearGradient>
      <radialGradient id="veilGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 0.6 }} />
        <stop offset="100%" style={{ stopColor: '#ffffff', stopOpacity: 0 }} />
      </radialGradient>
    </defs>
    <path d="M40,100 Q100,30 160,100 L180,200 Q100,210 20,200 Z" fill="url(#veilGrad)" />
    <path d="M55,200 Q55,145 100,135 Q145,145 145,200 Z" fill="url(#dressGrad)" />
    <rect x="92" y="125" width="16" height="10" fill="#fde2e4" />
    <circle cx="100" cy="95" r="32" fill="#fde2e4" />
    <path d="M82,72 Q100,60 118,72" fill="none" stroke="#fbbf24" strokeWidth="2" />
  </svg>
);

const WeddingRingsIllustration = () => (
  <div className="relative animate-pulse">
    <svg viewBox="0 0 240 160" className="w-56 md:w-80 h-auto drop-shadow-[0_0_25px_rgba(251,191,36,0.4)]">
      <defs>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#b45309', stopOpacity: 1 }} />
          <stop offset="20%" style={{ stopColor: '#f59e0b', stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: '#fef3c7', stopOpacity: 1 }} />
          <stop offset="80%" style={{ stopColor: '#f59e0b', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#78350f', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <circle cx="150" cy="80" r="55" fill="none" stroke="url(#goldGrad)" strokeWidth="15" />
      <circle cx="90" cy="80" r="55" fill="none" stroke="url(#goldGrad)" strokeWidth="15" />
    </svg>
  </div>
);

const BabyIllustration = ({ gender = 'boy' }) => {
  const isGirl = gender === 'girl';
  const accentColor = isGirl ? "#f472b6" : "#38bdf8";
  const softColor = isGirl ? "#fdf2f8" : "#bae6fd";
  return (
    <div className="relative animate-bounce-slow">
      <svg viewBox="0 0 200 200" className="w-64 h-64 drop-shadow-2xl">
        <defs>
          <linearGradient id="babyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: softColor, stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: accentColor, stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        <path d="M40,140 Q100,180 160,140 L160,100 Q100,120 40,100 Z" fill="#ffffff" stroke={accentColor} strokeWidth="4" />
        <circle cx="100" cy="90" r="35" fill="#fef2f2" />
        <path d="M85,85 Q90,80 95,85" stroke="#475569" fill="none" strokeWidth="2" />
        <path d="M105,85 Q110,80 115,85" stroke="#475569" fill="none" strokeWidth="2" />
        {isGirl ? (
          <g transform="translate(100, 60)"><path d="M-15,-10 L15,10 M15,-10 L-15,10" stroke={accentColor} strokeWidth="10" strokeLinecap="round" /><circle r="6" fill={accentColor} /></g>
        ) : (
          <path d="M65,90 Q100,40 135,90" fill="url(#babyGrad)" />
        )}
        <circle cx="100" cy="110" r="8" fill={accentColor} />
      </svg>
    </div>
  );
};

// --- עזרים ---
const getHebrewDayLetters = (day: number): string => {
  const letters: { [key: number]: string } = {
    1: 'א', 2: 'ב', 3: 'ג', 4: 'ד', 5: 'ה', 6: 'ו', 7: 'ז', 8: 'ח', 9: 'ט', 10: 'י',
    11: 'יא', 12: 'יב', 13: 'יג', 14: 'יד', 15: 'טו', 16: 'טז', 17: 'יז', 18: 'יח', 19: 'יט', 20: 'כ',
    21: 'כא', 22: 'כב', 23: 'כג', 24: 'כד', 25: 'כה', 26: 'כו', 27: 'כז', 28: 'כח', 29: 'כט', 30: 'ל'
  };
  const val = letters[day] || day.toString();
  return val.length === 1 ? val + "'" : val.slice(0, -1) + '״' + val.slice(-1);
};

const App: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const [celebrations, setCelebrations] = useState<CelebrationSettings>(() => {
    const saved = localStorage.getItem('synagogue_celebration_v7');
    if (saved) return JSON.parse(saved);
    return {
      wedding: { isActive: false, familyName: "כהן", coupleNames: "דוד ורחל", displayDuration: 15 },
      son_birth: { isActive: false, familyName: "לוי", coupleNames: "", displayDuration: 15 },
      daughter_birth: { isActive: false, familyName: "ישראלי", coupleNames: "", displayDuration: 15 },
      dedication: { isActive: false, successName: "פלוני בן פלוני", familySubText: "וכל יוצאי חלציו", displayDuration: 15 },
      custom: { isActive: false, imageData: "", displayDuration: 15, title: "מודעה מיוחדת" }
    };
  });

  const [activePageIndex, setActivePageIndex] = useState(0);
  const [isEditingCelebration, setIsEditingCelebration] = useState(false);
  const [tempCelebrations, setTempCelebrations] = useState<CelebrationSettings>(celebrations);

  const activePages = useMemo(() => {
    const pages: ('main' | CelebrationType)[] = ['main'];
    if (celebrations.wedding.isActive) pages.push('wedding');
    if (celebrations.son_birth.isActive) pages.push('son_birth');
    if (celebrations.daughter_birth.isActive) pages.push('daughter_birth');
    if (celebrations.dedication.isActive) pages.push('dedication');
    if (celebrations.custom.isActive && celebrations.custom.imageData) pages.push('custom');
    return pages;
  }, [celebrations]);

  const currentPage = activePages[activePageIndex] || 'main';

  useEffect(() => {
    if (activePages.length <= 1) {
      setActivePageIndex(0);
      return;
    }
    const currentType = activePages[activePageIndex];
    const duration = currentType === 'main' ? 20 : (celebrations[currentType as CelebrationType]?.displayDuration || 15);
    const timer = setTimeout(() => {
      setActivePageIndex((prev) => (prev + 1) % activePages.length);
    }, duration * 1000);
    return () => clearTimeout(timer);
  }, [activePageIndex, activePages, celebrations]);

  const [marqueeText, setMarqueeText] = useState<string>(() => localStorage.getItem('synagogue_marquee') || "ברוכים הבאים לבית הכנסת • נא לשמור על קדושת המקום והשקט");
  const [isEditingMarquee, setIsEditingMarquee] = useState(false);
  const [tempMarqueeText, setTempMarqueeText] = useState("");
  const [lessons, setLessons] = useState<Lesson[]>(() => {
    const saved = localStorage.getItem('synagogue_lessons');
    return saved ? JSON.parse(saved) : [
      { title: "הדף היומי", teacher: "הרב לוי", time: "21:00", days: "כל יום" },
      { title: "הלכה ומוסר", teacher: "רב הקהילה", time: "08:30", days: "יום ו'" },
    ];
  });
  const [isEditingLessons, setIsEditingLessons] = useState(false);
  const [tempLessons, setTempLessons] = useState<Lesson[]>([]);
  const [synagogueTimes, setSynagogueTimes] = useState<Omit<SynagogueTimes, 'minchaDaily'>>(() => {
    const saved = localStorage.getItem('synagogue_times');
    return saved ? JSON.parse(saved) : { minchaGedolaShabbat: "13:00", minchaKetanaShabbat: "16:30" };
  });
  const [isEditingSynagogueTimes, setIsEditingSynagogueTimes] = useState(false);
  const [tempSynagogueTimes, setTempSynagogueTimes] = useState(synagogueTimes);
  const [zmanim, setZmanim] = useState<ZmanimData>({ sunrise: "--:--", sunset: "--:--", misheyakir: "--:--", candleLighting: "--:--", havdalah: "--:--", hebrewDate: "", parasha: "טוען..." });
  const [halakha, setHalakha] = useState<string>("טוען הלכה יומית...");

  const hebrewDateLocal = useMemo(() => {
    try {
      const formatter = new Intl.DateTimeFormat('he-IL-u-ca-hebrew', { 
        calendar: 'hebrew', 
        day: 'numeric', 
        month: 'long' 
      });
      const parts = formatter.formatToParts(currentTime);
      const dayVal = parts.find(p => p.type === 'day')?.value;
      const monthVal = parts.find(p => p.type === 'month')?.value;
      
      if (dayVal && monthVal) {
        const dayLetters = getHebrewDayLetters(parseInt(dayVal));
        return `${dayLetters} ${monthVal}`;
      }
      return "";
    } catch (e) {
      return "";
    }
  }, [currentTime]);

  const calculatedMinchaDaily = useMemo(() => {
    if (!zmanim.sunset || zmanim.sunset === "--:--") return "--:--";
    try {
      const [hours, minutes] = zmanim.sunset.split(':').map(Number);
      const date = new Date();
      date.setHours(hours, minutes, 0, 0);
      date.setMinutes(date.getMinutes() - 20);
      return date.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit', hour12: false });
    } catch (e) {
      return "--:--";
    }
  }, [zmanim.sunset]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen();
    else if (document.exitFullscreen) document.exitFullscreen();
    setIsFullscreen(!isFullscreen);
  };

  const fetchZmanim = useCallback(async (lat: number, lng: number) => {
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const shabbatUrl = `https://www.hebcal.com/shabbat?cfg=json&latitude=${lat}&longitude=${lng}&m=50&lg=h&tgt=1`;
      const zmanimUrl = `https://www.hebcal.com/zmanim?cfg=json&latitude=${lat}&longitude=${lng}&date=${todayStr}`;
      const [shRes, zmRes] = await Promise.all([fetch(shabbatUrl).then(r => r.json()), fetch(zmanimUrl).then(r => r.json())]);
      const format = (iso: string) => iso ? new Date(iso).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit', hour12: false }) : "--:--";
      setZmanim({ candleLighting: format(shRes.items?.find((i: any) => i.category === 'candles')?.date), havdalah: format(shRes.items?.find((i: any) => i.category === 'havdalah')?.date), parasha: shRes.items?.find((i: any) => i.category === 'parashat')?.hebrew || "פרשת השבוע", sunrise: format(zmRes.times.sunrise), sunset: format(zmRes.times.sunset), misheyakir: format(zmRes.times.misheyakir), hebrewDate: "" });
    } catch (e) { console.error(e); }
  }, []);

  const refreshHalakha = useCallback(async () => {
    setHalakha("טוען הלכה חדשה...");
    const newHalakha = await fetchDailyHalakha();
    setHalakha(newHalakha);
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(p => fetchZmanim(p.coords.latitude, p.coords.longitude), () => fetchZmanim(31.7683, 35.2137));
    refreshHalakha();
    const interval = setInterval(refreshHalakha, 3600000);
    return () => clearInterval(interval);
  }, [fetchZmanim, refreshHalakha]);

  const renderCelebrationPage = (type: CelebrationType) => {
    if (type === 'custom') {
      const data = celebrations.custom;
      return (
        <div className="h-screen w-screen bg-slate-950 flex flex-col items-center justify-center relative animate-fade-in overflow-hidden">
          <div className="fixed top-8 left-8 z-50">
            <button onClick={() => { setTempCelebrations(celebrations); setIsEditingCelebration(true); }} className="p-3 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full shadow-lg transition-all"><Settings size={28} className="text-white" /></button>
          </div>
          <div className="w-full h-full flex items-center justify-center p-4">
            <img src={data.imageData} alt="Custom Content" className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl border-4 border-white/10" />
          </div>
          <div className="absolute bottom-6 left-1/4 right-1/4 h-2 bg-white/10 rounded-full overflow-hidden z-20">
              <div 
                className="h-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" 
                style={{ animation: `progress ${data.displayDuration}ms linear forwards` }} 
              />
          </div>
        </div>
      );
    }

    if (type === 'dedication') {
        const data = celebrations.dedication;
        return (
          <div className="h-screen w-screen flex flex-col bg-[#fdfbf7] overflow-hidden relative animate-fade-in font-sans">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#fdfbf7] via-[#f5f1e6] to-[#e6dfcc] opacity-100"></div>
            <div className="absolute inset-6 border-4 border-amber-600/30 rounded-3xl pointer-events-none"></div>
            <div className="absolute inset-8 border border-amber-600/20 rounded-2xl pointer-events-none"></div>
            <div className="absolute top-4 left-4 rotate-0 opacity-40"><CornerDecoration /></div>
            <div className="absolute top-4 right-4 rotate-90 opacity-40"><CornerDecoration /></div>
            <div className="absolute bottom-4 left-4 -rotate-90 opacity-40"><CornerDecoration /></div>
            <div className="absolute bottom-4 right-4 rotate-180 opacity-40"><CornerDecoration /></div>
            <div className="absolute top-1/2 -translate-y-1/2 right-4 w-[28vw] h-[75vh] opacity-25 z-0 scale-x-[-1] blur-[1px]"><TreeIllustration colorScale={1.1} /></div>
            <div className="absolute top-1/2 -translate-y-1/2 left-4 w-[24vw] h-[65vh] opacity-15 z-0 blur-[2px]"><TreeIllustration colorScale={0.9} /></div>
            <div className="fixed top-8 left-8 z-50">
              <button onClick={() => { setTempCelebrations(celebrations); setIsEditingCelebration(true); }} className="p-3 bg-white/40 hover:bg-white/70 backdrop-blur-md rounded-full shadow-lg border border-amber-900/10 transition-all"><Settings size={28} className="text-amber-900" /></button>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-12 z-10 relative">
              <h1 className="text-[6rem] font-black font-serif-hebrew text-amber-900/90 drop-shadow-[0_2px_1px_rgba(255,255,255,0.8)]">"עץ חיים היא למחזיקים בה ותומכיה מאושר"</h1>
              <div className="w-1/3 h-px bg-gradient-to-r from-transparent via-amber-600/30 to-transparent"></div>
              <div className="space-y-6">
                <h2 className="text-6xl font-bold font-serif-hebrew text-slate-800">התהלים השיעורים והלימוד השבוע להצלחת</h2>
                <div className="text-[12rem] font-black font-serif-hebrew text-transparent bg-clip-text bg-gradient-to-b from-[#1a365d] to-[#0f172a] drop-shadow-[0_10px_15px_rgba(0,0,0,0.2)] leading-none py-4 px-12 italic">{data.successName}</div>
              </div>
              <div className="space-y-6">
                <div className="flex items-center gap-4 justify-center"><div className="h-px w-20 bg-amber-600/20"></div><h2 className="text-8xl font-black font-serif-hebrew text-amber-900">ומשפחתו</h2><div className="h-px w-20 bg-amber-600/20"></div></div>
                <div className="text-7xl font-bold font-serif-hebrew text-[#1e3a8a]">{data.familySubText}</div>
              </div>
              <div className="pt-12"><div className="bg-emerald-900/5 px-16 py-8 rounded-[4rem] border border-emerald-900/10 shadow-inner"><h3 className="text-7xl font-black font-serif-hebrew text-[#1b4332]">ולרפואת כל חולי עם ישראל והצלחת צה"ל</h3></div></div>
            </div>
            <div className="absolute bottom-6 left-1/4 right-1/4 h-2 bg-amber-900/5 rounded-full overflow-hidden z-20 border border-amber-900/5">
                <div className="h-full bg-gradient-to-r from-amber-400 to-amber-600" style={{ animation: `progress ${data.displayDuration}ms linear forwards` }} />
            </div>
          </div>
        );
    }

    const data = celebrations[type as keyof Omit<CelebrationSettings, 'dedication' | 'custom'>];
    const isWedding = type === 'wedding';
    const isSon = type === 'son_birth';
    const isDaughter = type === 'daughter_birth';

    const theme = {
      wedding: { bg: "bg-[#fffbf2]", accent: "text-red-900", sub: "text-red-800", border: "border-red-200", marquee: "bg-red-900", itemColor: "#991b1b" },
      son_birth: { bg: "bg-[#f0f9ff]", accent: "text-blue-900", sub: "text-blue-800", border: "border-blue-200", marquee: "bg-blue-900", itemColor: "#1e3a8a" },
      daughter_birth: { bg: "bg-[#fff1f2]", accent: "text-pink-900", sub: "text-pink-800", border: "border-pink-200", marquee: "bg-pink-800", itemColor: "#9d174d" }
    }[type as 'wedding'|'son_birth'|'daughter_birth'];

    return (
      <div className={`h-screen w-screen flex flex-col ${theme.bg} overflow-hidden relative animate-fade-in font-sans`}>
        {/* רקע עם איורים מרחפים */}
        {(isSon || isDaughter) && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-12 left-12 animate-bounce-slow opacity-30 scale-150 rotate-12"><PacifierIllustration color={theme.itemColor} /></div>
            <div className="absolute top-1/4 right-20 animate-pulse opacity-30 scale-125 -rotate-12"><BottleIllustration color={theme.itemColor} /></div>
            <div className="absolute bottom-24 left-24 animate-bounce opacity-30 scale-150 rotate-45"><RattleIllustration color={theme.itemColor} /></div>
            <div className="absolute bottom-1/3 right-12 animate-pulse opacity-30 scale-110 -rotate-45"><PacifierIllustration color={theme.itemColor} /></div>
            <div className="absolute top-1/3 left-1/4 animate-bounce-slow opacity-20 scale-100 rotate-90"><BottleIllustration color={theme.itemColor} /></div>
            <div className="absolute bottom-12 right-1/3 animate-bounce opacity-25 scale-125 -rotate-90"><RattleIllustration color={theme.itemColor} /></div>
          </div>
        )}

        <div className="fixed top-4 left-4 z-50"><button onClick={() => { setTempCelebrations(celebrations); setIsEditingCelebration(true); }} className={`p-3 bg-white/50 backdrop-blur-md rounded-full shadow-lg border border-slate-200`}><Settings size={24} /></button></div>
        <div className="flex-1 flex flex-col items-center justify-center p-8 z-10 text-center">
          {isWedding && <div className="flex items-center gap-12 mb-12"><div className="w-64 h-64 rounded-full border-8 border-amber-400/30 bg-white shadow-2xl overflow-hidden"><GroomIllustration /></div><WeddingRingsIllustration /><div className="w-64 h-64 rounded-full border-8 border-amber-400/30 bg-white shadow-2xl overflow-hidden"><BrideIllustration /></div></div>}
          {(isSon || isDaughter) && <div className="flex items-center gap-16 mb-12 relative">
              <div className="absolute -inset-12 bg-white/40 blur-3xl rounded-full"></div>
              <BabyIllustration gender={isSon ? 'boy' : 'girl'} />
            </div>}
          <div className="space-y-10 relative">
            <h1 className={`text-9xl font-black font-serif-hebrew ${theme.accent} drop-shadow-lg`}>מזל טוב</h1>
            <div className={`bg-white/60 backdrop-blur-sm border-y-4 ${theme.border} py-12 px-24 transform rotate-1 rounded-[3rem] shadow-xl`}>
               <p className={`text-6xl font-bold font-serif-hebrew ${theme.sub}`}>למשפחת <span className={`font-black`}>{data.familyName}</span> היקרים</p>
               {isWedding ? (
                 <p className="text-5xl font-bold font-serif-hebrew text-red-700 mt-8">לרגל נישואי <span className="font-black text-red-950 underline decoration-red-400 decoration-4 underline-offset-8">{data.coupleNames}</span></p>
               ) : (
                 <p className={`text-5xl font-bold font-serif-hebrew ${isSon ? 'text-blue-700' : 'text-pink-700'} mt-8`}>להולדת הב{isSon ? 'ן' : 'ת'} <span className="font-black">{isSon ? 'היקר והאהוב' : 'היקרה והאהובה'}</span></p>
               )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (currentPage !== 'main') {
    return (
      <>
        {renderCelebrationPage(currentPage)}
        {isEditingCelebration && (<CelebrationEditModal temp={tempCelebrations} setTemp={setTempCelebrations} onCancel={() => setIsEditingCelebration(false)} onSave={() => { setCelebrations(tempCelebrations); localStorage.setItem('synagogue_celebration_v7', JSON.stringify(tempCelebrations)); setIsEditingCelebration(false); setActivePageIndex(0); }} />)}
        <style>{`
          @keyframes progress { from { width: 0%; } to { width: 100%; } }
          @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
          .animate-bounce-slow { animation: bounce-slow 4s ease-in-out infinite; }
        `}</style>
      </>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col p-4 space-y-4 bg-slate-950 overflow-hidden text-slate-100 font-sans">
      <div className="fixed top-4 left-4 z-50 flex flex-col gap-2">
        <button onClick={toggleFullscreen} className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-all shadow-lg" title="מסך מלא"><Maximize size={20} /></button>
        <button onClick={() => { setTempCelebrations(celebrations); setIsEditingCelebration(true); }} className="p-2 bg-red-500/20 rounded-xl text-red-400 border border-red-500/30 hover:bg-red-500/40 transition-all shadow-lg" title="עדכון מזל טוב והקדשה"><Heart size={20} /></button>
        <button onClick={() => { setTempMarqueeText(marqueeText); setIsEditingMarquee(true); }} className="p-2 bg-blue-500/20 rounded-xl text-blue-300 border border-blue-500/30 hover:bg-blue-500/40 transition-all shadow-lg" title="עדכון הודעות"><Edit3 size={20} /></button>
        <button onClick={() => { setTempLessons([...lessons]); setIsEditingLessons(true); }} className="p-2 bg-emerald-500/20 rounded-xl text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/40 transition-all shadow-lg" title="עדכון שיעורים"><BookOpen size={20} /></button>
        <button onClick={() => { setTempSynagogueTimes(synagogueTimes); setIsEditingSynagogueTimes(true); }} className="p-2 bg-indigo-500/20 rounded-xl text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/40 transition-all shadow-lg" title="עדכון זמני תפילה"><Settings size={20} /></button>
      </div>

      <header className="grid grid-cols-1 md:grid-cols-3 items-center bg-slate-900/60 backdrop-blur-2xl rounded-[2.5rem] p-6 border border-white/10 shadow-2xl">
        <div className="text-center md:text-right">
          <h1 className="text-8xl font-black text-amber-400 font-serif-hebrew drop-shadow-lg">{currentTime.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}</h1>
          <div className="flex items-center gap-2 text-slate-400 mt-2 font-bold"><Clock size={18} /> <span>זמן מקומי</span></div>
        </div>
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-4 text-white">
            <Calendar size={48} className="text-amber-400" />
            <h2 className="text-7xl font-black font-serif-hebrew">{hebrewDateLocal}</h2>
          </div>
          <div className="bg-amber-500 px-12 py-3 rounded-full text-slate-950 shadow-xl border-2 border-amber-300">
            <span className="text-5xl font-black font-serif-hebrew">{zmanim.parasha}</span>
          </div>
        </div>
        <div></div>
      </header>

      <div className="bg-amber-500/5 border-y border-amber-500/30 py-2 text-center">
        <span className="text-3xl font-black text-amber-100 font-serif-hebrew">מוקדש לע"נ יעל בת שפרה ת.נ.צ.ב.ה</span>
      </div>

      <main className="flex-1 flex gap-4 min-h-0">
        <div className="flex-[2.5] grid grid-cols-3 gap-3">
          <ZmanimItem icon={<Sun size={32} className="text-amber-300" />} label="טלית ותפילין" value={zmanim.misheyakir} sub="משיכיר" />
          <ZmanimItem icon={<Sun size={32} className="text-orange-400" />} label="זריחה" value={zmanim.sunrise} sub="הנץ החמה" />
          <ZmanimItem icon={<Moon size={32} className="text-blue-400" />} label="שקיעה" value={zmanim.sunset} sub="שקיעת החמה" />
          <ZmanimItem icon={<Star size={32} className="text-amber-400" />} label="כניסת שבת" value={zmanim.candleLighting} sub="הדלקת נרות" primary />
          <ZmanimItem icon={<Sun size={32} className="text-indigo-300" />} label="מנחה" value={calculatedMinchaDaily} sub="שקיעה - 20 ד'" primary />
          <ZmanimItem icon={<Moon size={32} className="text-indigo-400" />} label="יציאת שבת" value={zmanim.havdalah} sub="מוצאי שבת" primary />
          <ZmanimItem icon={<Sun size={32} className="text-orange-500" />} label="מנחה גדולה" value={synagogueTimes.minchaGedolaShabbat} sub="שבת" isManual />
          <ZmanimItem icon={<Sun size={32} className="text-amber-500" />} label="מנחה קטנה" value={synagogueTimes.minchaKetanaShabbat} sub="שבת" isManual />
          <div className="bg-slate-900/40 rounded-[2rem] border border-white/5 flex flex-col items-center justify-center p-3">
             <Sun size={24} className="text-amber-500 mb-1" />
             <span className="text-md font-black text-slate-300">זמני בית הכנסת</span>
          </div>
        </div>
        <div className="flex-[1.2] bg-slate-900/80 rounded-[2.5rem] border border-white/10 p-6 flex flex-col shadow-2xl overflow-hidden">
          <div className="flex items-center gap-4 mb-4"><BookOpen size={28} className="text-blue-400" /><h3 className="text-3xl font-black">שיעורי תורה</h3></div>
          <div className="flex-1 space-y-3 overflow-y-auto">{lessons.map((l, i) => (<div key={i} className="bg-white/5 p-4 rounded-[1.5rem] border border-white/10 flex justify-between items-center"><div className="flex flex-col"><div className="text-xl font-black text-amber-200">{l.title}</div><div className="text-slate-400 font-bold">{l.teacher} • {l.days}</div></div><div className="bg-blue-600 px-3 py-1 rounded-lg font-black">{l.time}</div></div>))}</div>
          <div className="mt-4 pt-4 border-t border-white/10"><div className="flex justify-between items-center mb-2"><span className="text-2xl font-black text-amber-400">הלכה יומית</span><button onClick={refreshHalakha} className="p-1 hover:bg-white/10 rounded-full transition-all text-amber-500/50 hover:text-amber-500" title="רענן הלכה"><Sparkles size={18} /></button></div><div className="bg-amber-900/30 p-5 rounded-2xl border border-amber-500/20 text-center relative group"><p className="text-2xl font-black italic text-amber-50">"{halakha}"</p></div></div>
        </div>
      </main>

      <footer className="h-18 bg-amber-500 rounded-3xl flex items-center overflow-hidden shadow-2xl shrink-0"><div className="bg-amber-700 h-full px-8 flex items-center font-black text-2xl text-white italic shadow-2xl z-20">הודעות</div><div className="flex-1 overflow-hidden"><div className="animate-marquee text-3xl font-black text-slate-950 py-2">{marqueeText.split('•').map((m, i) => <span key={i} className="mx-12 flex items-center gap-4 inline-flex"><Star size={24} className="fill-slate-950" /> {m.trim()}</span>)}</div></div></footer>

      {isEditingCelebration && (<CelebrationEditModal temp={tempCelebrations} setTemp={setTempCelebrations} onCancel={() => setIsEditingCelebration(false)} onSave={() => { setCelebrations(tempCelebrations); localStorage.setItem('synagogue_celebration_v7', JSON.stringify(tempCelebrations)); setIsEditingCelebration(false); setActivePageIndex(0); }} />)}
      {isEditingMarquee && (<div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-6"><div className="bg-slate-900 border border-amber-500 rounded-[2.5rem] p-10 w-full max-w-2xl shadow-2xl"><h3 className="text-3xl font-black text-amber-400 mb-6">עריכת הודעות</h3><textarea value={tempMarqueeText} onChange={(e) => setTempMarqueeText(e.target.value)} className="w-full h-48 bg-slate-950 border border-white/10 rounded-2xl p-6 text-2xl text-white outline-none focus:border-amber-500" /><div className="flex justify-end gap-4 mt-8"><button onClick={() => setIsEditingMarquee(false)} className="px-8 py-3 rounded-xl bg-slate-800 font-bold">ביטול</button><button onClick={() => { setMarqueeText(tempMarqueeText); localStorage.setItem('synagogue_marquee', tempMarqueeText); setIsEditingMarquee(false); }} className="px-8 py-3 rounded-xl bg-amber-500 text-slate-950 font-black">שמור</button></div></div></div>)}
      {isEditingLessons && (<div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-6 overflow-y-auto"><div className="bg-slate-900 border border-emerald-500 rounded-[2.5rem] p-8 w-full max-w-3xl shadow-2xl my-8"><h3 className="text-3xl font-black text-emerald-400 mb-6 border-b border-white/10 pb-4">ניהול שיעורי תורה</h3><div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 mb-6">{tempLessons.map((lesson, idx) => (<div key={idx} className="bg-slate-950 p-4 rounded-2xl border border-white/5 space-y-3 relative group"><button onClick={() => setTempLessons(tempLessons.filter((_, i) => i !== idx))} className="absolute top-2 left-2 p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-all opacity-0 group-hover:opacity-100"><Trash2 size={18} /></button><div className="grid grid-cols-2 gap-4"><input type="text" placeholder="שם השיעור" value={lesson.title} onChange={(e) => { const n = [...tempLessons]; n[idx].title = e.target.value; setTempLessons(n); }} className="bg-slate-900 p-3 rounded-xl border border-white/10 text-white outline-none focus:border-emerald-500" /><input type="text" placeholder="שם המרצה" value={lesson.teacher} onChange={(e) => { const n = [...tempLessons]; n[idx].teacher = e.target.value; setTempLessons(n); }} className="bg-slate-900 p-3 rounded-xl border border-white/10 text-white outline-none focus:border-emerald-500" /><input type="text" placeholder="שעה (00:00)" value={lesson.time} onChange={(e) => { const n = [...tempLessons]; n[idx].time = e.target.value; setTempLessons(n); }} className="bg-slate-900 p-3 rounded-xl border border-white/10 text-white outline-none focus:border-emerald-500" /><input type="text" placeholder="ימים" value={lesson.days} onChange={(e) => { const n = [...tempLessons]; n[idx].days = e.target.value; setTempLessons(n); }} className="bg-slate-900 p-3 rounded-xl border border-white/10 text-white outline-none focus:border-emerald-500" /></div></div>))}<button onClick={() => setTempLessons([...tempLessons, { title: "", teacher: "", time: "", days: "" }])} className="w-full p-4 border-2 border-dashed border-white/10 rounded-2xl text-emerald-300 hover:bg-emerald-500/10 flex items-center justify-center gap-2 transition-all font-bold"><Plus size={20} /> הוסף שיעור חדש</button></div><div className="flex justify-end gap-4 pt-6 border-t border-white/10"><button onClick={() => setIsEditingLessons(false)} className="px-8 py-3 rounded-xl bg-slate-800 font-bold">ביטול</button><button onClick={() => { setLessons(tempLessons); localStorage.setItem('synagogue_lessons', JSON.stringify(tempLessons)); setIsEditingLessons(false); }} className="px-8 py-3 rounded-xl bg-emerald-600 text-white font-black shadow-lg">שמור עדכונים</button></div></div></div>)}
      {isEditingSynagogueTimes && (<div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-6"><div className="bg-slate-900 border border-indigo-500 rounded-[2.5rem] p-10 w-full max-w-xl shadow-2xl"><h3 className="text-3xl font-black text-indigo-400 mb-8 border-b border-white/10 pb-4">זמני תפילה (שבת)</h3><div className="space-y-6"><div className="space-y-2"><label className="text-slate-400 font-bold block">מנחה גדולה:</label><input type="text" value={tempSynagogueTimes.minchaGedolaShabbat} onChange={(e) => setTempSynagogueTimes({...tempSynagogueTimes, minchaGedolaShabbat: e.target.value})} className="w-full bg-slate-950 p-4 rounded-xl border border-white/10 text-2xl text-white outline-none focus:border-indigo-500" placeholder="13:00" /></div><div className="space-y-2"><label className="text-slate-400 font-bold block">מנחה קטנה:</label><input type="text" value={tempSynagogueTimes.minchaKetanaShabbat} onChange={(e) => setTempSynagogueTimes({...tempSynagogueTimes, minchaKetanaShabbat: e.target.value})} className="w-full bg-slate-950 p-4 rounded-xl border border-white/10 text-2xl text-white outline-none focus:border-indigo-500" placeholder="16:30" /></div></div><div className="flex justify-end gap-4 mt-10"><button onClick={() => setIsEditingSynagogueTimes(false)} className="px-8 py-3 rounded-xl bg-slate-800 font-bold">ביטול</button><button onClick={() => { setSynagogueTimes(tempSynagogueTimes); localStorage.setItem('synagogue_times', JSON.stringify(tempSynagogueTimes)); setIsEditingSynagogueTimes(false); }} className="px-10 py-3 rounded-xl bg-indigo-600 text-white font-black shadow-lg">שמור</button></div></div></div>)}
    </div>
  );
};

const ZmanimItem = ({ icon, label, value, sub, primary, isManual }: any) => (
  <div className={`flex flex-col items-center justify-center p-3 rounded-[2.5rem] border transition-all ${primary ? 'bg-amber-500/10 border-amber-500/40' : isManual ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-slate-900/50 border-white/5 shadow-inner'}`}>
    <div className={`mb-2 p-2 rounded-[1.2rem] ${primary ? 'bg-amber-500/20' : 'bg-slate-950'}`}>{icon}</div>
    <span className={`text-2xl font-black mb-1 text-center tracking-tight leading-none ${primary ? 'text-amber-400' : 'text-slate-300'}`}>{label}</span>
    <span className="text-4xl font-black text-white drop-shadow-md mb-1">{value || "--:--"}</span>
    <span className={`text-[10px] font-black px-4 py-1 rounded-full shadow-lg ${primary ? 'bg-amber-500 text-slate-950' : 'bg-white/10 text-slate-400'}`}>{sub}</span>
  </div>
);

const CelebrationEditModal = ({ temp, setTemp, onCancel, onSave }: any) => {
  const [activeTab, setActiveTab] = useState<CelebrationType>('wedding');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentConfig = temp[activeTab];

  const updateConfig = (key: string, value: any) => {
    setTemp({ ...temp, [activeTab]: { ...currentConfig, [key]: value } });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateConfig('imageData', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const themeClass = {
    wedding: 'border-red-600',
    son_birth: 'border-blue-600',
    daughter_birth: 'border-pink-600',
    dedication: 'border-[#457fb1]',
    custom: 'border-emerald-600'
  }[activeTab];

  const textClass = {
    wedding: 'text-red-900',
    son_birth: 'text-blue-900',
    daughter_birth: 'text-pink-900',
    dedication: 'text-[#2d4d29]',
    custom: 'text-emerald-900'
  }[activeTab];

  return (
    <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-lg flex items-center justify-center p-4 overflow-y-auto">
      <div className={`bg-[#fffbf2] border-8 ${themeClass} rounded-[3rem] p-8 md:p-12 w-full max-w-4xl text-[#422006] shadow-2xl my-8 transition-colors duration-500`}>
        <h3 className={`text-4xl md:text-5xl font-black mb-8 font-serif-hebrew border-b-4 pb-4 text-center ${textClass}`}>ניהול הודעות ותוכן ללופ</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-10">
          <TabButton active={activeTab === 'wedding'} onClick={() => setActiveTab('wedding')} icon={<Heart size={24} />} label="חתונה" activeClass="bg-red-50 border-red-600 text-red-600" activeBadge={temp.wedding.isActive} />
          <TabButton active={activeTab === 'son_birth'} onClick={() => setActiveTab('son_birth')} icon={<Baby size={24} />} label="בן" activeClass="bg-blue-50 border-blue-600 text-blue-600" activeBadge={temp.son_birth.isActive} />
          <TabButton active={activeTab === 'daughter_birth'} onClick={() => setActiveTab('daughter_birth')} icon={<Flower2 size={24} />} label="בת" activeClass="bg-pink-50 border-pink-600 text-pink-600" activeBadge={temp.daughter_birth.isActive} />
          <TabButton active={activeTab === 'dedication'} onClick={() => setActiveTab('dedication')} icon={<Users size={24} />} label="הקדשה" activeClass="bg-blue-50 border-[#457fb1] text-[#457fb1]" activeBadge={temp.dedication.isActive} />
          <TabButton active={activeTab === 'custom'} onClick={() => setActiveTab('custom')} icon={<ImageIcon size={24} />} label="תמונה" activeClass="bg-emerald-50 border-emerald-600 text-emerald-600" activeBadge={temp.custom.isActive} />
        </div>

        <div className="space-y-8 animate-fade-in" key={activeTab}>
          <div className="flex items-center justify-between bg-slate-800/5 p-6 rounded-3xl border border-slate-200">
            <span className="text-2xl font-black">הצג דף זה בלופ</span>
            <button onClick={() => updateConfig('isActive', !currentConfig.isActive)} className={`w-20 h-10 rounded-full transition-all flex items-center p-1 ${currentConfig.isActive ? 'bg-green-600 justify-end' : 'bg-slate-300 justify-start'}`}>
              <div className="w-8 h-8 bg-white rounded-full shadow-md"></div>
            </button>
          </div>

          {activeTab === 'custom' && (
            <div className="space-y-6">
              <div className="flex flex-col items-center gap-6 p-8 border-4 border-dashed border-emerald-200 rounded-3xl bg-emerald-50/50">
                {temp.custom.imageData ? (
                  <div className="relative group">
                    <img src={temp.custom.imageData} className="max-h-48 rounded-xl shadow-lg border-2 border-white" />
                    <button onClick={() => updateConfig('imageData', '')} className="absolute -top-3 -left-3 bg-red-600 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={20} /></button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4 text-emerald-800">
                    <Upload size={64} className="opacity-30" />
                    <span className="text-xl font-bold">העלו תמונה או מודעה (JPG/PNG)</span>
                  </div>
                )}
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
                <button onClick={() => fileInputRef.current?.click()} className="px-10 py-4 bg-emerald-600 text-white rounded-2xl font-black text-xl hover:scale-105 transition-all shadow-lg flex items-center gap-2">
                  <Upload size={24} /> {temp.custom.imageData ? 'החלף תמונה' : 'בחר קובץ מהמחשב'}
                </button>
              </div>
              <div className="space-y-2">
                <label className="text-xl font-bold">כותרת למודעה (פנימי):</label>
                <input type="text" value={temp.custom.title} onChange={(e) => updateConfig('title', e.target.value)} className="w-full bg-white border-4 border-slate-100 rounded-2xl p-4 text-2xl font-black outline-none focus:border-emerald-500" />
              </div>
            </div>
          )}

          {activeTab === 'dedication' && (
            <>
              <div className="space-y-2"><label className="text-xl font-bold">להצלחת (שם):</label><input type="text" value={temp.dedication.successName} onChange={(e) => updateConfig('successName', e.target.value)} className="w-full bg-white border-4 border-slate-100 rounded-2xl p-4 text-2xl font-black outline-none focus:border-blue-500" /></div>
              <div className="space-y-2"><label className="text-xl font-bold">טקסט מתחת ל"ומשפחתו":</label><input type="text" value={temp.dedication.familySubText} onChange={(e) => updateConfig('familySubText', e.target.value)} className="w-full bg-white border-4 border-slate-100 rounded-2xl p-4 text-2xl font-black outline-none focus:border-blue-500" /></div>
            </>
          )}

          {(activeTab === 'wedding' || activeTab === 'son_birth' || activeTab === 'daughter_birth') && (
            <>
              <div className="space-y-2"><label className="text-xl font-bold">שם המשפחה:</label><input type="text" value={currentConfig.familyName} onChange={(e) => updateConfig('familyName', e.target.value)} className="w-full bg-white border-4 border-slate-100 rounded-2xl p-4 text-2xl font-black outline-none focus:border-amber-500" /></div>
              {activeTab === 'wedding' && <div className="space-y-2"><label className="text-xl font-bold">שמות החתן והכלה:</label><input type="text" value={currentConfig.coupleNames} onChange={(e) => updateConfig('coupleNames', e.target.value)} className="w-full bg-white border-4 border-slate-100 rounded-2xl p-4 text-2xl font-black outline-none focus:border-amber-500" /></div>}
            </>
          )}

          <div className="space-y-2">
            <label className="text-xl font-bold">זמן תצוגה בלופ (שניות):</label>
            <input type="number" value={currentConfig.displayDuration} onChange={(e) => updateConfig('displayDuration', parseInt(e.target.value))} className="w-full bg-white border-4 border-slate-100 rounded-2xl p-4 text-2xl font-black outline-none focus:border-amber-500" />
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mt-12">
          <button onClick={onCancel} className="px-8 py-3 rounded-2xl bg-slate-100 text-slate-600 font-bold text-lg">ביטול</button>
          <button onClick={onSave} className="px-12 py-3 rounded-2xl text-white font-black text-xl shadow-xl hover:scale-105 transition-all bg-green-600">שמור את כל ההגדרות</button>
        </div>
      </div>
    </div>
  );
};

const TabButton = ({ active, onClick, icon, label, activeClass, activeBadge }: any) => (
  <button onClick={onClick} className={`p-3 md:p-4 rounded-3xl border-4 flex flex-col items-center gap-2 transition-all relative ${active ? activeClass + ' shadow-lg scale-105' : 'bg-white border-slate-200 opacity-60 hover:opacity-100'}`}>
    {icon}
    <span className="text-sm md:text-lg font-black">{label}</span>
    {activeBadge && <div className="absolute -top-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white animate-pulse"></div>}
  </button>
);

export default App;
