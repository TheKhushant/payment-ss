// frontend/src/components/LogoutButton.tsx
import { LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const LogoutButton = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login', { replace: true });
    }
  };

  return (
    <button
      onClick={handleLogout}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsActive(false); }}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      className="relative flex items-center gap-2 px-5 py-2.5 text-white rounded-xl font-bold tracking-wide cursor-pointer"
      style={{
        background: isHovered
          ? "linear-gradient(135deg, #C22323 0%, #8F1010 100%)"
          : "linear-gradient(135deg, #A81B1B 0%, #7A0C0C 100%)",
        boxShadow: isActive
          ? "inset 0 3px 6px rgba(0,0,0,0.5), 0 1px 2px rgba(0,0,0,0.2)"
          : isHovered
            ? "0 6px 16px rgba(168, 27, 27, 0.5), inset 0 1px 0 rgba(255,255,255,0.3), 0 0 8px rgba(218, 165, 32, 0.3)"
            : "0 4px 10px rgba(122, 12, 12, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
        border: "1px solid rgba(218, 165, 32, 0.5)",
        transform: isActive ? "translateY(1px) scale(0.98)" : isHovered ? "translateY(-0.5px) scale(1.03)" : "translateY(0) scale(1)",
        transition: "all 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
        fontFamily: "'Montserrat', sans-serif",
      }}
    >
      {/* Premium glossy reflection highlight */}
      <span className="absolute inset-x-3 top-0.5 h-[30%] bg-gradient-to-b from-white/20 to-transparent rounded-lg pointer-events-none" />
      <LogOut size={16} className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)]" />
      <span className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)]">Logout</span>
    </button>
  );
};

export default LogoutButton;