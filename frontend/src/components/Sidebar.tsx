import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Target, 
  BarChart3, 
  BookOpen 
} from "lucide-react";

export default function Sidebar() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="w-72 h-screen flex flex-col relative overflow-hidden"
      style={{
        // Leather texture background with gradient
        background: "linear-gradient(135deg, #8B4513 0%, #A0522D 25%, #8B4513 50%, #6B3410 75%, #8B4513 100%)",
        // Inner shadow for depth
        boxShadow: "inset 0 0 60px rgba(0,0,0,0.5), 5px 0 15px rgba(0,0,0,0.3)",
      }}
    >
      {/* Leather texture overlay using repeating pattern */}
      <div className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='4' height='4' viewBox='0 0 4 4' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1h2v2H1z' fill='%23000' fill-opacity='0.3'/%3E%3C/svg%3E")`,
          backgroundSize: "3px 3px",
        }}
      />

      {/* Stitching effect border */}
      <div className="absolute inset-2 border-2 border-dashed border-yellow-700/40 rounded-lg pointer-events-none" />

      {/* Content container */}
      <div className="relative z-10 flex flex-col h-full p-6">
        
        {/* Logo / Title - Embossed metal plate effect */}
        <div className="mb-10 p-4 rounded-lg"
          style={{
            background: "linear-gradient(145deg, #B8860B, #DAA520, #B8860B)",
            boxShadow: "inset 2px 2px 5px rgba(255,255,255,0.4), inset -2px -2px 5px rgba(0,0,0,0.3), 3px 3px 8px rgba(0,0,0,0.4)",
            border: "1px solid #8B6914",
          }}
        >
          <h1 className="text-2xl font-bold text-center"
            style={{
              color: "#4A3728",
              textShadow: "1px 1px 2px rgba(255,255,255,0.6), -1px -1px 1px rgba(0,0,0,0.3)",
            }}
          >
            Fee Portal
          </h1>
          <p className="text-xs text-center mt-1 font-semibold"
            style={{
              color: "#5C4033",
              textShadow: "0 1px 1px rgba(255,255,255,0.4)",
            }}
          >
            Student Management
          </p>
        </div>

        <nav className="flex-1 space-y-6">
          {/* Overview Section */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-3 px-3"
              style={{
                color: "#D2B48C",
                textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
                letterSpacing: "0.15em",
              }}
            >
              Overview
            </h2>
            <div className="flex flex-col gap-2">
              <SidebarLink to="/" icon={<LayoutDashboard size={18} />} label="Dashboard" isActive={isActive("/")} />
              <SidebarLink to="/students" icon={<Users size={18} />} label="Students" isActive={isActive("/students")} />
              <SidebarLink to="/payments" icon={<CreditCard size={18} />} label="Payments" isActive={isActive("/payments")} />
              <SidebarLink to="/tracking" icon={<Target size={18} />} label="Tracking" isActive={isActive("/tracking")} />
            </div>
          </div>

          {/* Manage Section */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-3 px-3"
              style={{
                color: "#D2B48C",
                textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
                letterSpacing: "0.15em",
              }}
            >
              Manage
            </h2>
            <div className="flex flex-col gap-2">
              <SidebarLink to="/analytics" icon={<BarChart3 size={18} />} label="Analytics" isActive={isActive("/analytics")} />
              <SidebarLink to="/courses" icon={<BookOpen size={18} />} label="Courses" isActive={isActive("/courses")} />
            </div>
          </div>
        </nav>

        {/* Footer - Metal badge style */}
        <div className="pt-4 mt-auto">
          <div className="p-3 rounded-full text-center text-xs font-bold"
            style={{
              background: "linear-gradient(145deg, #C0C0C0, #E8E8E8, #A0A0A0)",
              boxShadow: "inset 1px 1px 3px rgba(255,255,255,0.8), inset -1px -1px 3px rgba(0,0,0,0.3), 2px 2px 5px rgba(0,0,0,0.3)",
              color: "#4A4A4A",
              textShadow: "0 1px 1px rgba(255,255,255,0.8)",
              border: "1px solid #808080",
            }}
          >
            © 2026 Design & Developed by <br/> SS Infotech
          </div>
        </div>
      </div>
    </div>
  );
}

// Extracted component for 3D button effect
function SidebarLink({ to, icon, label, isActive }: { to: string; icon: React.ReactNode; label: string; isActive: boolean }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all duration-150 relative overflow-hidden"
      style={{
        // 3D raised button effect
        background: isActive 
          ? "linear-gradient(145deg, #CD853F, #DEB887, #CD853F)" // Pressed/active state (lighter)
          : "linear-gradient(145deg, #6B3410, #8B4513, #6B3410)", // Default state
        boxShadow: isActive
          ? "inset 3px 3px 6px rgba(0,0,0,0.4), inset -1px -1px 3px rgba(255,255,255,0.2)" // Pressed in shadow
          : "5px 5px 10px rgba(0,0,0,0.4), -2px -2px 5px rgba(255,255,255,0.1), inset 1px 1px 2px rgba(255,255,255,0.2)", // Raised shadow
        border: "1px solid rgba(0,0,0,0.3)",
        color: isActive ? "#3E2723" : "#D2B48C",
        textShadow: isActive 
          ? "0 1px 1px rgba(255,255,255,0.5)" 
          : "1px 1px 2px rgba(0,0,0,0.8)",
        transform: isActive ? "translateY(2px)" : "translateY(0)",
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = "linear-gradient(145deg, #7B3F00, #A0522D, #7B3F00)";
          e.currentTarget.style.transform = "translateY(-1px)";
          e.currentTarget.style.boxShadow = "6px 6px 12px rgba(0,0,0,0.5), -2px -2px 5px rgba(255,255,255,0.15), inset 1px 1px 2px rgba(255,255,255,0.3)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = "linear-gradient(145deg, #6B3410, #8B4513, #6B3410)";
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "5px 5px 10px rgba(0,0,0,0.4), -2px -2px 5px rgba(255,255,255,0.1), inset 1px 1px 2px rgba(255,255,255,0.2)";
        }
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = "translateY(2px)";
        e.currentTarget.style.boxShadow = "inset 3px 3px 6px rgba(0,0,0,0.4), inset -1px -1px 3px rgba(255,255,255,0.2)";
      }}
      onMouseUp={(e) => {
        if (!isActive) {
          e.currentTarget.style.transform = "translateY(-1px)";
          e.currentTarget.style.boxShadow = "6px 6px 12px rgba(0,0,0,0.5), -2px -2px 5px rgba(255,255,255,0.15), inset 1px 1px 2px rgba(255,255,255,0.3)";
        }
      }}
    >
      {/* Inner bevel/highlight for extra depth */}
      <span className="absolute inset-0 rounded-lg pointer-events-none"
        style={{
          background: "linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.2) 100%)",
        }}
      />
      <span className="relative z-10 flex items-center gap-3">
        <span style={{ 
          filter: isActive ? "drop-shadow(0 1px 1px rgba(255,255,255,0.5))" : "drop-shadow(1px 1px 1px rgba(0,0,0,0.5))",
          color: "inherit"
        }}>
          {icon}
        </span>
        {label}
      </span>
    </Link>
  );
}