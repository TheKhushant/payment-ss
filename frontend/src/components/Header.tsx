export default function Header() {
  return (
    <div className="relative p-4 overflow-hidden" style={{
      background: "linear-gradient(145deg, #8B4513 0%, #A0522D 25%, #8B4513 50%, #6B3410 75%, #8B4513 100%)",
      boxShadow: "0 5px 15px rgba(0,0,0,0.4), inset 0 2px 5px rgba(255,255,255,0.1)",
      borderBottom: "3px solid #5C4033",
    }}>
      {/* Leather texture overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='4' height='4' viewBox='0 0 4 4' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1h2v2H1z' fill='%23000' fill-opacity='0.3'/%3E%3C/svg%3E")`,
        backgroundSize: "3px 3px",
      }} />
      
      {/* Stitching effect */}
      <div className="absolute inset-1 border-2 border-dashed border-yellow-700/40 rounded pointer-events-none" />
      
      {/* Embossed metal plate for title */}
      <div className="relative z-10 inline-block px-6 py-2 rounded-lg" style={{
        background: "linear-gradient(145deg, #B8860B, #DAA520, #B8860B)",
        boxShadow: "inset 2px 2px 5px rgba(255,255,255,0.4), inset -2px -2px 5px rgba(0,0,0,0.3), 3px 3px 8px rgba(0,0,0,0.4)",
        border: "1px solid #8B6914",
      }}>
        <h2 className="text-lg font-bold" style={{
          color: "#4A3728",
          textShadow: "1px 1px 2px rgba(255,255,255,0.6), -1px -1px 1px rgba(0,0,0,0.3)",
        }}>
          SS.Infotech Payment Portal
        </h2>
      </div>
    </div>
  );
}