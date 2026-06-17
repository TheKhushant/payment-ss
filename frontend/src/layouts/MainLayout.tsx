import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="flex min-h-screen relative overflow-hidden" style={{
      background: "linear-gradient(135deg, #5C4033 0%, #6B3410 50%, #5C4033 100%)",
      boxShadow: "inset 0 0 100px rgba(0,0,0,0.6)",
    }}>
      {/* Leather texture overlay */}
      <div className="absolute inset-0 opacity-15 pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='4' height='4' viewBox='0 0 4 4' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1h2v2H1z' fill='%23000' fill-opacity='0.3'/%3E%3C/svg%3E")`,
        backgroundSize: "3px 3px",
      }} />

      <div className="relative z-10 flex w-full">
        <Sidebar />

        <div className="flex-1 flex flex-col relative">
          {/* Inner shadow for depth where sidebar meets content */}
          <div className="absolute left-0 top-0 bottom-0 w-4 pointer-events-none" style={{
            background: "linear-gradient(90deg, rgba(0,0,0,0.3) 0%, transparent 100%)",
          }} />
          
          <Header />

          <div className="flex-1 p-1 relative overflow-hidden" style={{
            background: "linear-gradient(135deg, #DEB887 0%, #F5DEB3 50%, #DEB887 100%)",
            boxShadow: "inset 0 0 40px rgba(0,0,0,0.2)",
          }}>
            {/* Subtle paper texture overlay */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h1v1H0zM3 3h1v1H3z' fill='%23000' fill-opacity='0.2'/%3E%3C/svg%3E")`,
              backgroundSize: "4px 4px",
            }} />
            
            {/* Stitching border for content area */}
            <div className="absolute inset-3 border-2 border-dashed border-yellow-800/30 rounded-xl pointer-events-none" />
            
            <div className="relative z-10">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}