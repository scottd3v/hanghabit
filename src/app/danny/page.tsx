'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

// Danny's birthday - January 15, 2019 (currently 5, turning 6)
const DANNY_BIRTHDAY = new Date('2019-01-15');

const calculateAge = (birthday: Date): number => {
  const today = new Date();
  let age = today.getFullYear() - birthday.getFullYear();
  const monthDiff = today.getMonth() - birthday.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthday.getDate())) {
    age--;
  }
  return age;
};

const SESSION_KEY = 'danny-authenticated';

export default function DannyPortal() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [showDesktop, setShowDesktop] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const currentAge = calculateAge(DANNY_BIRTHDAY);
  const correctPassword = currentAge.toString();

  // Update time every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Check session on mount
  useEffect(() => {
    const session = sessionStorage.getItem(SESSION_KEY);
    if (session === 'true') {
      setIsAuthenticated(true);
      setShowDesktop(true);
    }
  }, []);

  // Focus input on mount
  useEffect(() => {
    if (!isAuthenticated && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAuthenticated]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === correctPassword) {
      sessionStorage.setItem(SESSION_KEY, 'true');
      localStorage.setItem('danny-last-login', new Date().toISOString());
      setIsAuthenticated(true);
      setTimeout(() => setShowDesktop(true), 800);
    } else {
      setError(true);
      setPassword('');
      setTimeout(() => setError(false), 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Only allow single digit
    if (password.length >= 1 && e.key !== 'Backspace' && e.key !== 'Enter') {
      e.preventDefault();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 flex items-center justify-center p-4 md:p-8">
      {/* Desk surface gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-slate-700/20 via-transparent to-transparent" />

      {/* MacBook Air */}
      <div className="relative w-full max-w-4xl animate-fade-in">
        {/* Screen bezel */}
        <div className="relative bg-gradient-to-b from-[#e2e2e7] via-[#c8c8cc] to-[#a8a8ac] rounded-t-[20px] p-[12px] shadow-[0_-2px_20px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.5)]">
          {/* Camera notch area */}
          <div className="absolute top-[6px] left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-gradient-to-b from-slate-600 to-slate-800 shadow-inner" />

          {/* Screen */}
          <div className="relative bg-black rounded-[8px] overflow-hidden shadow-[inset_0_0_30px_rgba(0,0,0,0.5)]" style={{ aspectRatio: '16/10' }}>

            {/* Login Screen */}
            {!showDesktop && (
              <div
                className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ${isAuthenticated ? 'opacity-0 scale-110' : 'opacity-100 scale-100'}`}
                style={{
                  background: 'linear-gradient(135deg, #065f46 0%, #059669 25%, #10b981 50%, #34d399 75%, #6ee7b7 100%)',
                }}
              >
                {/* Floating particles */}
                <div className="absolute inset-0 overflow-hidden">
                  {[...Array(20)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute rounded-full bg-white/10 animate-float"
                      style={{
                        width: Math.random() * 20 + 10 + 'px',
                        height: Math.random() * 20 + 10 + 'px',
                        left: Math.random() * 100 + '%',
                        top: Math.random() * 100 + '%',
                        animationDelay: Math.random() * 5 + 's',
                        animationDuration: Math.random() * 10 + 10 + 's',
                      }}
                    />
                  ))}
                </div>

                {/* Name watermark */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                  <span
                    className="text-[20vw] md:text-[180px] font-black text-white/[0.07] tracking-tight"
                    style={{ fontFamily: "'Nunito', sans-serif" }}
                  >
                    Danny
                  </span>
                </div>

                {/* Login content */}
                <div className="relative z-10 flex flex-col items-center">
                  {/* Avatar */}
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6 shadow-lg border-4 border-white/30">
                    <span className="text-5xl md:text-6xl">🦕</span>
                  </div>

                  {/* Name */}
                  <h1
                    className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg"
                    style={{ fontFamily: "'Nunito', sans-serif" }}
                  >
                    Danny
                  </h1>

                  {/* Password form */}
                  <form onSubmit={handlePasswordSubmit} className="mt-6">
                    <div className={`relative ${error ? 'animate-shake' : ''}`}>
                      <input
                        ref={inputRef}
                        type="password"
                        inputMode="numeric"
                        value={password}
                        onChange={(e) => setPassword(e.target.value.replace(/\D/g, '').slice(0, 1))}
                        onKeyDown={handleKeyPress}
                        className="w-48 md:w-56 h-12 md:h-14 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white text-center text-2xl font-bold placeholder:text-white/50 focus:outline-none focus:border-white/60 focus:bg-white/30 transition-all"
                        placeholder="Enter age"
                        autoComplete="off"
                      />
                      {error && (
                        <p className="absolute -bottom-8 left-0 right-0 text-center text-white/90 text-sm font-medium">
                          Try again!
                        </p>
                      )}
                    </div>
                    <button type="submit" className="sr-only">Submit</button>
                  </form>

                  {/* Hint */}
                  <p className="mt-12 text-white/60 text-sm" style={{ fontFamily: "'Nunito', sans-serif" }}>
                    Type how old you are!
                  </p>
                </div>
              </div>
            )}

            {/* Desktop */}
            {showDesktop && (
              <div
                className="absolute inset-0 animate-fade-in"
                style={{
                  background: 'linear-gradient(135deg, #065f46 0%, #059669 25%, #10b981 50%, #34d399 75%, #6ee7b7 100%)',
                }}
              >
                {/* Floating particles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {[...Array(15)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute rounded-full bg-white/10 animate-float"
                      style={{
                        width: Math.random() * 15 + 8 + 'px',
                        height: Math.random() * 15 + 8 + 'px',
                        left: Math.random() * 100 + '%',
                        top: Math.random() * 100 + '%',
                        animationDelay: Math.random() * 5 + 's',
                        animationDuration: Math.random() * 10 + 10 + 's',
                      }}
                    />
                  ))}
                </div>

                {/* Name watermark */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                  <span
                    className="text-[25vw] md:text-[220px] font-black text-white/[0.05] tracking-tight"
                    style={{ fontFamily: "'Nunito', sans-serif" }}
                  >
                    Danny
                  </span>
                </div>

                {/* Menu bar */}
                <div className="absolute top-0 left-0 right-0 h-7 bg-black/20 backdrop-blur-md flex items-center justify-between px-4 text-white/90 text-xs font-medium">
                  <div className="flex items-center gap-4">
                    <span className="text-sm"></span>
                    <span style={{ fontFamily: "'Nunito', sans-serif" }}>Danny&apos;s Computer</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span>🔋 100%</span>
                    <span style={{ fontFamily: "'Nunito', sans-serif" }}>{currentTime}</span>
                  </div>
                </div>

                {/* Desktop icons */}
                <div className="absolute inset-0 pt-12 p-6">
                  <div className="flex flex-col gap-6">
                    {/* Dino Jump */}
                    <button
                      onClick={() => router.push('/danny/dino')}
                      className="group flex flex-col items-center gap-2 w-24 p-2 rounded-xl hover:bg-white/10 transition-all duration-200"
                    >
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-orange-400 via-orange-500 to-red-500 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-200 group-hover:-rotate-3">
                        <span className="text-4xl md:text-5xl group-hover:animate-bounce">🦖</span>
                      </div>
                      <span
                        className="text-white text-xs font-semibold drop-shadow-md text-center leading-tight"
                        style={{ fontFamily: "'Nunito', sans-serif" }}
                      >
                        Dino Jump
                      </span>
                    </button>

                    {/* Homework Help - Coming Soon */}
                    <div className="group flex flex-col items-center gap-2 w-24 p-2 rounded-xl opacity-60 cursor-not-allowed">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-blue-400 via-blue-500 to-purple-500 flex items-center justify-center shadow-lg grayscale-[30%]">
                        <span className="text-4xl md:text-5xl">📚</span>
                      </div>
                      <span
                        className="text-white text-xs font-semibold drop-shadow-md text-center leading-tight"
                        style={{ fontFamily: "'Nunito', sans-serif" }}
                      >
                        Homework
                        <br />
                        <span className="text-[10px] opacity-70">(Coming Soon)</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Dock */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
                  <div className="flex items-end gap-2 px-3 py-2 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg">
                    <button
                      onClick={() => router.push('/danny/dino')}
                      className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-orange-400 via-orange-500 to-red-500 flex items-center justify-center shadow-md hover:scale-110 hover:-translate-y-2 transition-all duration-200"
                    >
                      <span className="text-2xl md:text-3xl">🦖</span>
                    </button>
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-blue-400 via-blue-500 to-purple-500 flex items-center justify-center shadow-md opacity-50 grayscale-[30%]">
                      <span className="text-2xl md:text-3xl">📚</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* MacBook bottom / keyboard area */}
        <div className="relative bg-gradient-to-b from-[#a8a8ac] via-[#c8c8cc] to-[#d8d8dc] rounded-b-[20px] h-4 md:h-5 shadow-[0_4px_20px_rgba(0,0,0,0.3),inset_0_-1px_0_rgba(0,0,0,0.1)]">
          {/* Notch/indent */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 md:w-24 h-1 bg-gradient-to-b from-[#888] to-[#999] rounded-b-full" />
        </div>

        {/* Shadow underneath */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[80%] h-4 bg-black/20 blur-xl rounded-full" />
      </div>

      {/* Nunito font */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');

        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(-10px) translateX(-10px);
          }
          75% {
            transform: translateY(-30px) translateX(5px);
          }
        }

        .animate-float {
          animation: float 15s ease-in-out infinite;
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }

        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}
