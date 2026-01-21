
import { Clock, Sun, Moon, BookOpen, Star, Sparkles, Calendar, Maximize, Edit3, Plus, Trash2, Settings, Heart, Baby, Flower2, Image as ImageIcon, Upload, Phone, MapPin } from 'lucide-react';
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { ZmanimData, Lesson, SynagogueTimes, CelebrationSettings, CelebrationType } from './types';
import { fetchDailyHalakha } from './services/geminiService';

// --- איורים ---

const GoldBalloon = ({ className = "" }) => (
  <svg viewBox="0 0 100 120" className={className}>
    <defs>
      <radialGradient id="goldBalloonGrad" cx="30%" cy="30%" r="70%">
        <stop offset="0%" style={{ stopColor: '#fef3c7', stopOpacity: 1 }} />
        <stop offset="50%" style={{ stopColor: '#fbbf24', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#b45309', stopOpacity: 1 }} />
      </radialGradient>
    </defs>
    <path d="M50,100 Q10,100 10,50 Q10,0 50,0 Q90,0 90,50 Q90,100 50,100 Z" fill="url(#goldBalloonGrad)" />
    <path d="M50,100 L45,110 L55,110 Z" fill="#b45309" />
    <path d="M50,110 Q50,120 40,130" stroke="#fef3c7" fill="none" strokeWidth="1" />
  </svg>
);

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
    </defs>
    {/* Fix: transformOrigin is a CSS property and should be passed via the style prop in React SVG elements to resolve TypeScript errors */}
    <g transform={`scale(${colorScale})`} style={{ transformOrigin: "center" }}>
      <path d="M90,240 Q100,180 100,140 M100,150 Q120,120 140,110 M100,160 Q70,120 50,115 M100,180 Q130,160 150,165" stroke="url(#trunkGrad)" strokeWidth="8" fill="none" strokeLinecap="round" />
      <path d="M100,240 L100,120" stroke="url(#trunkGrad)" strokeWidth="10" fill="none" />
      <circle cx="100" cy="70" r="45" fill="url(#leafGrad)" opacity="0.9" />
      <circle cx="70" cy="90" r="35" fill="url(#leafGrad)" opacity="0.85" />
      <circle cx="135" cy="95" r="38" fill="url(#leafGrad)" opacity="0.85" />
      <circle cx="105" cy="40" r="30" fill="#a5d6a7" opacity="0.7" />
    </g>
  </svg>
);

const CornerDecoration = () => (
  <svg viewBox="0 0 100 100" className="w-32 h-32 text-amber-500/30">
    <path d="M0,0 L100,0 M0,0 L0,100 M10,10 L90,10 M10,10 L10,90" fill="none" stroke="currentColor" strokeWidth="2" />
    <circle cx="10" cy="10" r="5" fill="currentColor" />
  </svg>
);

const BabyIllustration = ({ gender = 'boy' }) => {
  const accentColor = gender === 'girl' ? "#f472b6" : "#38bdf8";
  return (
    <div className="relative animate-bounce-slow">
      <svg viewBox="0 0 200 200" className="w-64 h-64 drop-shadow-2xl">
        <circle cx="100" cy="90" r="35" fill="#fef2f2" />
        <path d="M40,140 Q100,180 160,140 L160,100 Q100,120 40,100 Z" fill="#ffffff" stroke={accentColor} strokeWidth="4" />
        <circle cx="100" cy="110" r="8" fill={accentColor} />
      </svg>
    </div>
  );
};

const App: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const [celebrations, setCelebrations] = useState<CelebrationSettings>(() => {
    const defaultSettings: CelebrationSettings = {
      wedding: { isActive: false, familyName: "כהן", coupleNames: "דוד ורחל", displayDuration: 15 },
      son_birth: { isActive: false, familyName: "לוי", coupleNames: "", displayDuration: 15 },
      daughter_birth: { isActive: false, familyName: "ישראלי", coupleNames: "", displayDuration: 15 },
      dedication: { isActive: false, successName: "פלוני בן פלוני", familySubText: "וכל יוצאי חלציו", displayDuration: 15 },
      custom: { isActive: false, imageData: "", displayDuration: 15, title: "מודעה מיוחדת" },
      hall_ad: { isActive: true, displayDuration: 15, contactPhone: "053-5301057", contactName: "ששון", images: ["", "", ""] }
    };
    
    const saved = localStorage.getItem('synagogue_celebration_v10');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...defaultSettings, ...parsed };
      } catch (e) {
        return defaultSettings;
      }
    }
    return defaultSettings;
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
    if (celebrations.hall_ad.isActive) pages.push('hall_ad');
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

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(p => fetchZmanim(p.coords.latitude, p.coords.longitude), () => fetchZmanim(31.7683, 35.2137));
    const halakhaTimer = setInterval(async () => {
      const newHalakha = await fetchDailyHalakha();
      setHalakha(newHalakha);
    }, 3600000);
    fetchDailyHalakha().then(setHalakha);
    return () => clearInterval(halakhaTimer);
  }, [fetchZmanim]);

  const renderCelebrationPage = (type: CelebrationType) => {
    if (type === 'hall_ad') {
        const data = celebrations.hall_ad;
        const defaultPhotos = [
            "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800"
        ];
        
        return (
          <div className="h-screen w-screen bg-[#333333] flex flex-col items-center justify-center relative animate-fade-in overflow-hidden font-sans p-12">
            <div className="absolute top-10 right-10 flex gap-2">
                <GoldBalloon className="w-16 animate-bounce" />
                <GoldBalloon className="w-20 -mt-4 animate-pulse" />
            </div>
            <div className="z-10 text-center space-y-6 max-w-6xl">
                <h1 className="text-[8rem] font-black font-serif-hebrew text-transparent bg-clip-text bg-gradient-to-b from-[#fef3c7] via-[#fbbf24] to-[#b45309] drop-shadow-xl">אולם משכנות נריה</h1>
                <p className="text-5xl font-black text-amber-200 italic">יש לכם אירוע קטן ואינטימי?</p>
                <div className="grid grid-cols-3 gap-8 mt-12 px-8">
                    {[0, 1, 2].map(idx => (
                      <div key={idx} className={`bg-white p-3 pb-10 shadow-2xl transform ${idx === 1 ? '-mt-6 rotate-2' : 'rotate-[-2deg]'}`}>
                          <div className="aspect-video bg-slate-200 overflow-hidden">
                               <img src={data.images[idx] || defaultPhotos[idx]} className="w-full h-full object-cover" alt="אולם" />
                          </div>
                      </div>
                    ))}
                </div>
                <div className="pt-8 space-y-6">
                    <div className="flex items-center justify-center gap-8 bg-slate-100/10 p-6 rounded-3xl border border-white/10">
                        <Phone className="text-amber-400" size={40} /><p className="text-6xl font-black text-white">{data.contactPhone}</p>
                        <div className="h-12 w-px bg-white/20"></div>
                        <p className="text-6xl font-black text-amber-400">{data.contactName}</p>
                    </div>
                </div>
            </div>
            <div className="absolute bottom-6 left-1/4 right-1/4 h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500" style={{ animation: `progress ${data.displayDuration}s linear forwards` }} />
            </div>
          </div>
        );
    }

    if (type === 'custom') {
      const data = celebrations.custom;
      return (
        <div className="h-screen w-screen bg-slate-950 flex flex-col items-center justify-center relative animate-fade-in">
          <img src={data.imageData} className="max-w-full max-h-full object-contain" alt="Custom" />
          <div className="absolute bottom-6 left-1/4 right-1/4 h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500" style={{ animation: `progress ${data.displayDuration}s linear forwards` }} />
          </div>
        </div>
      );
    }

    if (type === 'dedication') {
        const data = celebrations.dedication;
        return (
          <div className="h-screen w-screen flex flex-col bg-[#fdfbf7] relative animate-fade-in font-sans p-12">
            <div className="absolute inset-8 border-4 border-amber-600/30 rounded-3xl pointer-events-none"></div>
            <div className="absolute top-4 left-4"><CornerDecoration /></div>
            <div className="absolute bottom-4 right-4 rotate-180"><CornerDecoration /></div>
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-12">
                <h1 className="text-7xl font-black text-amber-900 font-serif-hebrew">"עץ חיים היא למחזיקים בה"</h1>
                <div className="space-y-4">
                    <h2 className="text-5xl font-bold">הלימוד השבוע להצלחת</h2>
                    <p className="text-[10rem] font-black text-blue-900 leading-none">{data.successName}</p>
                </div>
                <div className="text-6xl font-bold text-amber-900">ומשפחתו</div>
                <div className="text-5xl text-blue-800">{data.familySubText}</div>
            </div>
            <div className="absolute bottom-6 left-1/4 right-1/4 h-2 bg-amber-200 rounded-full overflow-hidden">
                <div className="h-full bg-amber-600" style={{ animation: `progress ${data.displayDuration}s linear forwards` }} />
            </div>
          </div>
        );
    }

    // Wedding, Son Birth, Daughter Birth
    const data = celebrations[type as 'wedding' | 'son_birth' | 'daughter_birth'];
    const isSon = type === 'son_birth';
    const isWedding = type === 'wedding';
    const theme = {
      wedding: { bg: "bg-[#fffbf2]", accent: "text-red-900", sub: "text-red-800", border: "border-red-200" },
      son_birth: { bg: "bg-[#f0f9ff]", accent: "text-blue-900", sub: "text-blue-800", border: "border-blue-200" },
      daughter_birth: { bg: "bg-[#fff1f2]", accent: "text-pink-900", sub: "text-pink-800", border: "border-pink-200" }
    }[type as 'wedding' | 'son_birth' | 'daughter_birth'];

    return (
      <div className={`h-screen w-screen flex flex-col ${theme.bg} overflow-hidden relative animate-fade-in font-sans`}>
        <div className="flex-1 flex flex-col items-center justify-center p-8 z-10 text-center">
          {isWedding ? <GoldBalloon className="w-48" /> : <BabyIllustration gender={isSon ? 'boy' : 'girl'} />}
          <div className="space-y-8 mt-12">
            <h1 className={`text-9xl font-black font-serif-hebrew ${theme.accent}`}>מזל טוב</h1>
            <div className={`bg-white/60 backdrop-blur-sm border-y-4 ${theme.border} py-12 px-24 rounded-[3rem] shadow-xl`}>
               <p className={`text-6xl font-bold font-serif-hebrew ${theme.sub}`}>למשפחת <span className="font-black">{data.familyName}</span> היקרים</p>
               <p className="text-5xl font-bold mt-8">
                 {isWedding ? `לרגל נישואי ${data.coupleNames}` : `להולדת הב${isSon ? 'ן' : 'ת'} היקר${isSon ? '' : 'ה'}`}
               </p>
            </div>
          </div>
        </div>
        <div className="absolute bottom-6 left-1/4 right-1/4 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500" style={{ animation: `progress ${data.displayDuration}s linear forwards` }} />
        </div>
      </div>
    );
  };

  if (currentPage !== 'main') {
    return (
      <>
        {renderCelebrationPage(currentPage as CelebrationType)}
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
        <button onClick={toggleFullscreen} className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-all shadow-lg"><Maximize size={20} /></button>
        <button onClick={() => { setTempCelebrations(celebrations); setIsEditingCelebration(true); }} className="p-2 bg-red-500/20 rounded-xl text-red-400 border border-red-500/30 hover:bg-red-500/40 shadow-lg"><Heart size={20} /></button>
        <button onClick={() => setIsEditingMarquee(true)} className="p-2 bg-blue-500/20 rounded-xl text-blue-300 border border-blue-500/30 hover:bg-blue-500/40 shadow-lg"><Edit3 size={20} /></button>
        <button onClick={() => setIsEditingLessons(true)} className="p-2 bg-emerald-500/20 rounded-xl text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/40 shadow-lg"><BookOpen size={20} /></button>
        <button onClick={() => setIsEditingSynagogueTimes(true)} className="p-2 bg-indigo-500/20 rounded-xl text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/40 shadow-lg"><Settings size={20} /></button>
      </div>

      <header className="grid grid-cols-1 md:grid-cols-3 items-center bg-slate-900/60 backdrop-blur-2xl rounded-[2.5rem] p-6 border border-white/10 shadow-2xl">
        <div className="text-center md:text-right">
          <h1 className="text-8xl font-black text-amber-400 font-serif-hebrew drop-shadow-lg">{currentTime.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}</h1>
        </div>
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-4 text-white"><Calendar size={48} className="text-amber-400" /><h2 className="text-6xl font-black font-serif-hebrew">לוח מועדים</h2></div>
          <div className="bg-amber-500 px-12 py-3 rounded-full text-slate-950 shadow-xl border-2 border-amber-300"><span className="text-5xl font-black font-serif-hebrew">{zmanim.parasha}</span></div>
        </div>
      </header>

      <main className="flex-1 flex gap-4 min-h-0">
        <div className="flex-[2.5] grid grid-cols-3 gap-3">
          <ZmanimItem icon={<Sun className="text-amber-300" />} label="טלית ותפילין" value={zmanim.misheyakir} sub="משיכיר" />
          <ZmanimItem icon={<Sun className="text-orange-400" />} label="זריחה" value={zmanim.sunrise} sub="הנץ" />
          <ZmanimItem icon={<Moon className="text-blue-400" />} label="שקיעה" value={zmanim.sunset} sub="שקיעת החמה" />
          <ZmanimItem icon={<Star className="text-amber-400" />} label="כניסת שבת" value={zmanim.candleLighting} sub="נרות" primary />
          <ZmanimItem icon={<Sun className="text-indigo-400" />} label="מנחה" value={synagogueTimes.minchaKetanaShabbat} sub="שבת" primary />
          <ZmanimItem icon={<Moon className="text-indigo-400" />} label="צאת שבת" value={zmanim.havdalah} sub="הבדלה" primary />
        </div>
        <div className="flex-[1.2] bg-slate-900/80 rounded-[2.5rem] border border-white/10 p-6 flex flex-col shadow-2xl overflow-hidden">
          <div className="flex items-center gap-4 mb-4 font-black"><BookOpen size={28} className="text-blue-400" /><h3 className="text-3xl">שיעורי תורה</h3></div>
          <div className="flex-1 space-y-3 overflow-y-auto">{lessons.map((l, i) => (<div key={i} className="bg-white/5 p-4 rounded-2xl border border-white/10 flex justify-between items-center"><div><div className="text-xl font-black text-amber-200">{l.title}</div><div className="text-slate-400 font-bold">{l.teacher}</div></div><div className="bg-blue-600 px-3 py-1 rounded-lg font-black">{l.time}</div></div>))}</div>
          <div className="mt-4 pt-4 border-t border-white/10 text-center"><p className="text-2xl font-black italic text-amber-50">"{halakha}"</p></div>
        </div>
      </main>

      <footer className="h-18 bg-amber-500 rounded-3xl flex items-center overflow-hidden shadow-2xl shrink-0">
        <div className="bg-amber-700 h-full px-8 flex items-center font-black text-2xl text-white italic z-20">הודעות</div>
        <div className="flex-1 overflow-hidden"><div className="animate-marquee text-3xl font-black text-slate-950 py-2">{marqueeText.split('•').map((m, i) => <span key={i} className="mx-12 flex items-center gap-4 inline-flex"><Star size={24} /> {m.trim()}</span>)}</div></div>
      </footer>

      {isEditingCelebration && (<CelebrationEditModal temp={tempCelebrations} setTemp={setTempCelebrations} onCancel={() => setIsEditingCelebration(false)} onSave={() => { setCelebrations(tempCelebrations); localStorage.setItem('synagogue_celebration_v10', JSON.stringify(tempCelebrations)); setIsEditingCelebration(false); setActivePageIndex(0); }} />)}
    </div>
  );
};

const ZmanimItem = ({ icon, label, value, sub, primary }: any) => (
  <div className={`flex flex-col items-center justify-center p-3 rounded-[2.5rem] border transition-all ${primary ? 'bg-amber-500/10 border-amber-500/40' : 'bg-slate-900/50 border-white/5 shadow-inner'}`}>
    <div className="mb-2">{icon}</div>
    <span className={`text-2xl font-black mb-1 text-center ${primary ? 'text-amber-400' : 'text-slate-300'}`}>{label}</span>
    <span className="text-4xl font-black text-white mb-1">{value || "--:--"}</span>
    <span className="text-[10px] font-black px-4 py-1 rounded-full bg-white/10 text-slate-400">{sub}</span>
  </div>
);

const CelebrationEditModal = ({ temp, setTemp, onCancel, onSave }: any) => {
  const [activeTab, setActiveTab] = useState<CelebrationType>('wedding');
  const [currentHallIdx, setCurrentHallIdx] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);
  const currentConfig = temp[activeTab];

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (activeTab === 'hall_ad') {
          const newImgs = [...temp.hall_ad.images];
          newImgs[currentHallIdx] = reader.result as string;
          setTemp({ ...temp, hall_ad: { ...temp.hall_ad, images: newImgs } });
        } else if (activeTab === 'custom') {
          setTemp({ ...temp, custom: { ...temp.custom, imageData: reader.result as string } });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const update = (k: string, v: any) => setTemp({ ...temp, [activeTab]: { ...currentConfig, [k]: v } });

  return (
    <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-lg flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#fffbf2] border-8 border-amber-600 rounded-[3rem] p-8 md:p-12 w-full max-w-4xl text-[#422006] shadow-2xl">
        <h3 className="text-4xl font-black mb-8 font-serif-hebrew border-b-4 pb-4 text-center">הגדרות לופ הודעות</h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 mb-8">
            {['wedding','son_birth','daughter_birth','dedication','hall_ad','custom'].map((t) => (
              <button key={t} onClick={() => setActiveTab(t as CelebrationType)} className={`p-3 rounded-2xl border-2 transition-all font-black text-xs ${activeTab === t ? 'bg-amber-100 border-amber-600' : 'bg-white border-slate-200 opacity-60'}`}>{t}</button>
            ))}
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border">
            <span className="font-bold">הצג בלופ:</span>
            <input type="checkbox" checked={currentConfig.isActive} onChange={(e) => update('isActive', e.target.checked)} className="w-8 h-8" />
          </div>

          {activeTab === 'hall_ad' && (
            <div className="grid grid-cols-3 gap-4">
              {[0, 1, 2].map(i => (
                <div key={i} onClick={() => { setCurrentHallIdx(i); fileRef.current?.click(); }} className="aspect-video bg-amber-50 border-2 border-dashed border-amber-300 rounded-xl cursor-pointer overflow-hidden flex items-center justify-center">
                  {temp.hall_ad.images[i] ? <img src={temp.hall_ad.images[i]} className="w-full h-full object-cover" /> : <Plus className="text-amber-400" />}
                </div>
              ))}
              <input type="file" ref={fileRef} className="hidden" onChange={handleFile} />
            </div>
          )}

          <div className="space-y-2"><label className="font-bold">זמן תצוגה (שניות):</label><input type="number" value={currentConfig.displayDuration} onChange={(e) => update('displayDuration', parseInt(e.target.value))} className="w-full bg-white p-4 rounded-xl border-2 font-black" /></div>
          {activeTab === 'dedication' && (
            <>
              <div className="space-y-2"><label className="font-bold">שם להקדשה:</label><input type="text" value={temp.dedication.successName} onChange={(e) => update('successName', e.target.value)} className="w-full bg-white p-4 rounded-xl border-2 font-black" /></div>
              <div className="space-y-2"><label className="font-bold">טקסט נוסף:</label><input type="text" value={temp.dedication.familySubText} onChange={(e) => update('familySubText', e.target.value)} className="w-full bg-white p-4 rounded-xl border-2 font-black" /></div>
            </>
          )}
          {(activeTab === 'wedding' || activeTab === 'son_birth' || activeTab === 'daughter_birth') && (
            <>
                <div className="space-y-2"><label className="font-bold">שם משפחה:</label><input type="text" value={currentConfig.familyName || ""} onChange={(e) => update('familyName', e.target.value)} className="w-full bg-white p-4 rounded-xl border-2 font-black" /></div>
                {activeTab === 'wedding' && <div className="space-y-2"><label className="font-bold">שמות הזוג:</label><input type="text" value={currentConfig.coupleNames || ""} onChange={(e) => update('coupleNames', e.target.value)} className="w-full bg-white p-4 rounded-xl border-2 font-black" /></div>}
            </>
          )}
        </div>

        <div className="flex justify-center gap-4 mt-12">
          <button onClick={onCancel} className="px-8 py-3 rounded-xl bg-slate-200 font-bold">ביטול</button>
          <button onClick={onSave} className="px-12 py-3 rounded-xl bg-green-600 text-white font-black shadow-lg">שמור הגדרות</button>
        </div>
      </div>
    </div>
  );
};

export default App;
