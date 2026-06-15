import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Target, 
  BarChart3, 
  BookOpen 
} from "lucide-react"; // Optional: Install lucide-react for icons

export default function Sidebar() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="w-64 bg-white border-r h-screen p-5 flex flex-col">
      {/* Logo / Title */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Fee Portal
        </h1>
        <p className="text-xs text-gray-500 mt-1">Student Management</p>
      </div>

      <nav className="flex-1 space-y-8">
        {/* Overview Section */}
        <div>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3 px-3">
            Overview
          </h2>
          <div className="flex flex-col gap-1">
            <Link
              to="/"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive("/") 
                  ? "bg-blue-50 text-blue-700" 
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <LayoutDashboard size={20} />
              Dashboard
            </Link>

            <Link
              to="/students"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive("/students") 
                  ? "bg-blue-50 text-blue-700" 
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Users size={20} />
              Students
            </Link>

            <Link
              to="/payments"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive("/payments") 
                  ? "bg-blue-50 text-blue-700" 
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <CreditCard size={20} />
              Payments
            </Link>

            <Link
              to="/tracking"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive("/tracking") 
                  ? "bg-blue-50 text-blue-700" 
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Target size={20} />
              Tracking
            </Link>
          </div>
        </div>

        {/* Manage Section */}
        <div>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3 px-3">
            Manage
          </h2>
          <div className="flex flex-col gap-1">
            <Link
              to="/analytics"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive("/analytics") 
                  ? "bg-blue-50 text-blue-700" 
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <BarChart3 size={20} />
              Analytics
            </Link>

            <Link
              to="/courses"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive("/courses") 
                  ? "bg-blue-50 text-blue-700" 
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <BookOpen size={20} />
              Courses
            </Link>
          </div>
        </div>
      </nav>

      {/* Optional Footer */}
      <div className="pt-6 border-t mt-auto">
        <div className="px-4 py-3 text-xs text-gray-500">
          © 2026 Fee Portal
        </div>
      </div>
    </div>
  );
}