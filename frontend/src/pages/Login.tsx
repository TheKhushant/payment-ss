import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error ] = useState('');
  const [loading ] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(email, password);

      navigate("/");
    } catch (err: any) {
      alert(err.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{
        /* Rich textured desk/leather background */
        background: `
          radial-gradient(ellipse at 20% 50%, rgba(60,40,20,0.4) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 50%, rgba(30,20,10,0.3) 0%, transparent 50%),
          radial-gradient(ellipse at 50% 100%, rgba(20,15,10,0.5) 0%, transparent 70%),
          linear-gradient(135deg, #2a1f1a 0%, #1a1410 50%, #0d0a08 100%)
        `
      }}
    >
      {/* Ambient light glow behind card */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[600px] bg-amber-900/10 rounded-full blur-[120px]" />
      </div>

      {/* Main card — physical slab with beveled edges, inner shadow, texture */}
      <div className="relative max-w-md w-full p-8 rounded-2xl select-none"
        style={{
          background: `
            linear-gradient(145deg, #f5f0e8 0%, #e8e0d0 50%, #d4c8b0 100%)
          `,
          border: '1px solid rgba(255,255,255,0.3)',
          borderTop: '1px solid rgba(255,255,255,0.6)',
          borderBottom: '1px solid rgba(0,0,0,0.2)',
          boxShadow: `
            inset 0 1px 2px rgba(255,255,255,0.8),
            inset 0 -2px 4px rgba(0,0,0,0.1),
            0 20px 40px rgba(0,0,0,0.4),
            0 2px 4px rgba(0,0,0,0.2),
            0 0 0 1px rgba(0,0,0,0.05)
          `
        }}
      >
        {/* Subtle paper texture overlay */}
        <div className="absolute inset-0 rounded-2xl opacity-30 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.15'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px'
          }}
        />

        {/* Header with physical lock/portal icon */}
        <div className="text-center mb-8 relative">
          {/* Physical button-like icon container */}
          <div className="mx-auto w-20 h-20 rounded-2xl flex items-center justify-center relative"
            style={{
              background: 'linear-gradient(145deg, #2563eb 0%, #1d4ed8 50%, #1e3a8a 100%)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderTop: '2px solid rgba(255,255,255,0.4)',
              borderBottom: '2px solid rgba(0,0,0,0.3)',
              boxShadow: `
                inset 0 1px 2px rgba(255,255,255,0.3),
                inset 0 -2px 4px rgba(0,0,0,0.2),
                0 4px 8px rgba(30,58,138,0.4),
                0 8px 16px rgba(30,58,138,0.2)
              `
            }}
          >
            {/* Glossy highlight */}
            <span className="absolute inset-x-3 top-1 h-[35%] bg-gradient-to-b from-white/40 to-transparent rounded-lg pointer-events-none" />
            <LogIn className="w-9 h-9 text-white relative drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" strokeWidth={2.5} />
          </div>
          
          <h2 className="mt-6 text-3xl font-bold text-gray-800 tracking-tight"
            style={{
              textShadow: '0 1px 1px rgba(255,255,255,0.8), 0 -1px 1px rgba(0,0,0,0.05)'
            }}
          >
            Welcome Back
          </h2>
          <p className="mt-2 text-gray-600 font-medium"
            style={{ textShadow: '0 1px 0 rgba(255,255,255,0.5)' }}
          >
            Sign in to your account
          </p>
        </div>

        {/* Error message — physical warning panel */}
        {error && (
          <div className="mb-5 p-4 rounded-xl relative overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, #fef2f2 0%, #fee2e2 100%)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderTop: '1px solid rgba(255,255,255,0.6)',
              boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.8), 0 2px 4px rgba(239,68,68,0.15)'
            }}
          >
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 rounded-l-xl" />
            <p className="text-red-700 text-sm font-semibold pl-2">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input — physical text field with inset depth */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 pl-1"
              style={{ textShadow: '0 1px 0 rgba(255,255,255,0.6)' }}
            >
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@gmail.com"
                required
                className="w-full px-4 py-3.5 rounded-xl text-gray-800 font-medium placeholder-gray-400 outline-none transition-all duration-200"
                style={{
                  background: 'linear-gradient(180deg, #e8e4dc 0%, #f0ece4 100%)',
                  border: '2px solid transparent',
                  borderTop: '2px solid rgba(0,0,0,0.15)',
                  borderBottom: '2px solid rgba(255,255,255,0.6)',
                  boxShadow: `
                    inset 0 2px 6px rgba(0,0,0,0.15),
                    inset 0 1px 2px rgba(0,0,0,0.1),
                    0 1px 0 rgba(255,255,255,0.8)
                  `,
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(37,99,235,0.5)';
                  e.target.style.boxShadow = `
                    inset 0 2px 6px rgba(0,0,0,0.1),
                    inset 0 1px 2px rgba(0,0,0,0.05),
                    0 0 0 3px rgba(37,99,235,0.15),
                    0 0 0 1px rgba(37,99,235,0.3)
                  `;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'transparent';
                  e.target.style.boxShadow = `
                    inset 0 2px 6px rgba(0,0,0,0.15),
                    inset 0 1px 2px rgba(0,0,0,0.1),
                    0 1px 0 rgba(255,255,255,0.8)
                  `;
                }}
              />
            </div>
          </div>

          {/* Password Input with physical toggle button */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 pl-1"
              style={{ textShadow: '0 1px 0 rgba(255,255,255,0.6)' }}
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3.5 pr-14 rounded-xl text-gray-800 font-medium placeholder-gray-400 outline-none transition-all duration-200"
                style={{
                  background: 'linear-gradient(180deg, #e8e4dc 0%, #f0ece4 100%)',
                  border: '2px solid transparent',
                  borderTop: '2px solid rgba(0,0,0,0.15)',
                  borderBottom: '2px solid rgba(255,255,255,0.6)',
                  boxShadow: `
                    inset 0 2px 6px rgba(0,0,0,0.15),
                    inset 0 1px 2px rgba(0,0,0,0.1),
                    0 1px 0 rgba(255,255,255,0.8)
                  `,
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(37,99,235,0.5)';
                  e.target.style.boxShadow = `
                    inset 0 2px 6px rgba(0,0,0,0.1),
                    inset 0 1px 2px rgba(0,0,0,0.05),
                    0 0 0 3px rgba(37,99,235,0.15),
                    0 0 0 1px rgba(37,99,235,0.3)
                  `;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'transparent';
                  e.target.style.boxShadow = `
                    inset 0 2px 6px rgba(0,0,0,0.15),
                    inset 0 1px 2px rgba(0,0,0,0.1),
                    0 1px 0 rgba(255,255,255,0.8)
                  `;
                }}
              />
              {/* Physical eye toggle button */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-2 w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-150 active:translate-y-[1px]"
                style={{
                  background: 'linear-gradient(145deg, #d4c8b0 0%, #c4b8a0 100%)',
                  border: '1px solid rgba(0,0,0,0.1)',
                  borderTop: '1px solid rgba(255,255,255,0.4)',
                  borderBottom: '1px solid rgba(0,0,0,0.2)',
                  boxShadow: `
                    inset 0 1px 1px rgba(255,255,255,0.5),
                    inset 0 -1px 2px rgba(0,0,0,0.1),
                    0 2px 4px rgba(0,0,0,0.15)
                  `
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.2), 0 1px 2px rgba(0,0,0,0.1)';
                  e.currentTarget.style.background = 'linear-gradient(145deg, #c4b8a0 0%, #b4a890 100%)';
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.boxShadow = 'inset 0 1px 1px rgba(255,255,255,0.5), inset 0 -1px 2px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.15)';
                  e.currentTarget.style.background = 'linear-gradient(145deg, #d4c8b0 0%, #c4b8a0 100%)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'inset 0 1px 1px rgba(255,255,255,0.5), inset 0 -1px 2px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.15)';
                  e.currentTarget.style.background = 'linear-gradient(145deg, #d4c8b0 0%, #c4b8a0 100%)';
                }}
              >
                {showPassword ? (
                  <EyeOff size={18} className="text-gray-600 drop-shadow-[0_1px_0_rgba(255,255,255,0.5)]" />
                ) : (
                  <Eye size={18} className="text-gray-600 drop-shadow-[0_1px_0_rgba(255,255,255,0.5)]" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button — large physical glossy button */}
          <button
            type="submit"
            disabled={loading}
            className="relative w-full py-4 rounded-xl font-bold text-white text-sm uppercase tracking-widest overflow-hidden transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 active:translate-y-[2px] group"
            style={{
              background: 'linear-gradient(180deg, #3b82f6 0%, #2563eb 40%, #1d4ed8 100%)',
              border: '1px solid rgba(30,58,138,0.3)',
              borderTop: '2px solid rgba(147,197,253,0.5)',
              borderBottom: '2px solid rgba(30,58,138,0.5)',
              boxShadow: `
                inset 0 1px 2px rgba(255,255,255,0.3),
                inset 0 -2px 4px rgba(0,0,0,0.2),
                0 4px 8px rgba(37,99,235,0.4),
                0 8px 16px rgba(37,99,235,0.2),
                0 0 0 1px rgba(0,0,0,0.05)
              `,
              textShadow: '0 1px 2px rgba(0,0,0,0.3)'
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.boxShadow = `
                inset 0 2px 8px rgba(0,0,0,0.4),
                0 1px 2px rgba(0,0,0,0.2),
                0 0 0 1px rgba(0,0,0,0.05)
              `;
              e.currentTarget.style.background = 'linear-gradient(180deg, #1d4ed8 0%, #1e40af 100%)';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.boxShadow = `
                inset 0 1px 2px rgba(255,255,255,0.3),
                inset 0 -2px 4px rgba(0,0,0,0.2),
                0 4px 8px rgba(37,99,235,0.4),
                0 8px 16px rgba(37,99,235,0.2),
                0 0 0 1px rgba(0,0,0,0.05)
              `;
              e.currentTarget.style.background = 'linear-gradient(180deg, #3b82f6 0%, #2563eb 40%, #1d4ed8 100%)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = `
                inset 0 1px 2px rgba(255,255,255,0.3),
                inset 0 -2px 4px rgba(0,0,0,0.2),
                0 4px 8px rgba(37,99,235,0.4),
                0 8px 16px rgba(37,99,235,0.2),
                0 0 0 1px rgba(0,0,0,0.05)
              `;
              e.currentTarget.style.background = 'linear-gradient(180deg, #3b82f6 0%, #2563eb 40%, #1d4ed8 100%)';
            }}
          >
            {/* Glossy highlight */}
            <span className="absolute inset-x-4 top-1 h-[40%] bg-gradient-to-b from-white/25 to-transparent rounded-lg pointer-events-none" />
            
            {loading ? (
              <span className="relative flex items-center gap-3">
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in...
              </span>
            ) : (
              <span className="relative flex items-center gap-3">
                <LogIn size={18} className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]" />
                Sign In
              </span>
            )}
          </button>
        </form>

        {/* Demo credentials — engraved metal plate style */}
        <div className="mt-6 p-4 rounded-xl text-center relative"
          style={{
            background: 'linear-gradient(145deg, #d4c8b0 0%, #c8bc9c 50%, #b8ac8c 100%)',
            border: '1px solid rgba(0,0,0,0.08)',
            borderTop: '1px solid rgba(255,255,255,0.3)',
            borderBottom: '1px solid rgba(0,0,0,0.15)',
            boxShadow: `
              inset 0 2px 6px rgba(0,0,0,0.1),
              inset 0 1px 2px rgba(0,0,0,0.05),
              0 1px 2px rgba(255,255,255,0.5)
            `
          }}
        >
          <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2"
            style={{ textShadow: '0 1px 0 rgba(255,255,255,0.4)' }}
          >
            Demo Credentials
          </p>
          <p className="font-mono text-sm text-gray-700 font-semibold"
            style={{ textShadow: '0 1px 0 rgba(255,255,255,0.3)' }}
          >
            admin@gmail.com / admin123
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;