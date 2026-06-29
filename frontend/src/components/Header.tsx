// frontend/src/components/Header.tsx
import { useAuth } from "../context/AuthContext";
import LogoutButton from "./LogoutButton";
import { ShieldCheck } from "lucide-react";

export default function Header() {
  const { user } = useAuth();

  return (
    <div className="relative px-6 py-4 flex items-center justify-between border-b"
      style={{
        // 3D layered background: center-radial ambient lighting + fine leather noise + dark mahogany base gradient
        backgroundImage: `
          radial-gradient(circle at 50% 0%, rgba(139, 69, 19, 0.45) 0%, transparent 75%),
          url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E"),
          linear-gradient(to bottom, #2C1810 0%, #150A05 100%)
        `,
        boxShadow: "0 10px 30px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)",
        borderImage: "linear-gradient(to right, #BF953F 0%, #FCF6BA 25%, #B38728 50%, #FBF5B7 75%, #AA771C 100%) 1",
      }}
    >
      {/* Dashed gold stitching detail for leather aesthetic */}
      <div className="absolute bottom-1.5 left-6 right-6 border-b border-dashed border-amber-600/15 pointer-events-none" />

      {/* Left Title: Gold Foil on Wood & Shield Logo */}
      <div className="flex items-center gap-3 relative z-10">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl relative" style={{
          background: "linear-gradient(145deg, #B8860B, #DAA520, #B8860B)",
          boxShadow: "inset 0 1px 2px rgba(255,255,255,0.4), 0 2px 6px rgba(0,0,0,0.4)",
          border: "1px solid #5C4033"
        }}>
          {/* Inner metallic highlight */}
          <span className="absolute inset-0.5 rounded-lg pointer-events-none" style={{
            background: "linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 100%)"
          }} />
          <ShieldCheck size={20} className="text-[#3E2723] drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]" />
        </div>
        
        <h2 className="text-xl md:text-2xl font-bold tracking-wider select-none" style={{
          fontFamily: "'Cinzel', serif",
          background: "linear-gradient(to bottom, #FFF4E0 0%, #F3C363 45%, #D49D2F 55%, #A87114 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.9)) drop-shadow(0 0 1px rgba(0,0,0,0.95))"
        }}>
          SS Infotech Payment Portal
        </h2>
      </div>

      {/* Right User greeting + Logout Button */}
      <div className="flex items-center gap-6 relative z-10">
        <div className="flex flex-col text-right select-none" style={{ fontFamily: "'Montserrat', sans-serif" }}>
          <span className="text-[10px] uppercase font-bold tracking-widest text-amber-200/50" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.8)" }}>
            Logged In As
          </span>
          <span className="text-sm md:text-base font-bold text-white tracking-wide" style={{ textShadow: "1px 1px 3px rgba(0,0,0,0.9)" }}>
            Welcome, <span className="text-amber-100">{user?.name || "Admin"}</span>
          </span>
        </div>
        
        <LogoutButton />
      </div>
    </div>
  );
}