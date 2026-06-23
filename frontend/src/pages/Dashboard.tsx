import { useEffect, useState } from "react";
import { getStudents } from "../services/studentService";
import { getPayments } from "../services/paymentService";
import { useNavigate } from "react-router-dom";
import { getInstallmentStatus, isPositiveInstallment } from "../utils/installmentUtils";

export default function Dashboard() {
  const [students, setStudents] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [trackingData, setTrackingData] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [studentData, paymentData] = await Promise.all([
        getStudents(), getPayments(),
      ]);
      setStudents(studentData || []);
      setPayments(paymentData || []);

      const rows: any[] = [];
      studentData.forEach((student: any) => {
        if (!student.installments || !Array.isArray(student.installments)) return;
        student.installments.forEach((installment: any) => {
          if (!isPositiveInstallment(installment)) return;
          const effectiveStatus = getInstallmentStatus(installment);
          if (effectiveStatus === "paid") return;
          rows.push({
            _id: installment._id || `${student._id}-${installment.dueDate}`,
            studentId: student._id,
            studentName: student.name,
            studentEmail: student.email,
            studentMobile: student.mobile,
            college: student.college,
            course: student.courseId?.name || student.course || "—",
            amount: installment.amount,
            dueDate: installment.dueDate,
            status: effectiveStatus,
          });
        });
      });
      rows.sort((a, b) => {
        const aDate = a.dueDate ? new Date(a.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
        const bDate = b.dueDate ? new Date(b.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
        return aDate - bDate;
      });
      setTrackingData(rows);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const totalStudents = students.length;

  const totalAmount = students.reduce(
    (sum: number, student: any) =>
      sum +
      (
        Number(student.courseFee || 0) -
        Number(student.discount || 0) -
        Number(student.scholarship || 0)
      ),
    0
  );

  const totalRevenue = payments.reduce(
    (sum: number, p: any) => sum + Number(p.amount || 0),
    0
  );
  
  const today = new Date().toISOString().split("T")[0];
  const todaysCollections = payments.filter((p: any) => p.paymentDate?.split("T")[0] === today).reduce((sum: number, p: any) => sum + Number(p.amount || 0), 0);
  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthlyCollection = payments.filter((p: any) => p.paymentDate?.startsWith(currentMonth)).reduce((sum: number, p: any) => sum + Number(p.amount || 0), 0);
  const pendingAmount = trackingData.reduce((sum: number, p: any) => sum + Number(p.amount || 0), 0);

  const upcomingPayments = trackingData.filter((p: any) => p.status === "upcoming").sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  const overduePayments = trackingData.filter((p: any) => p.status === "overdue").sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  const todaysPendingPayments = trackingData.filter((p: any) => {
    if (!p.dueDate) return false;
    return new Date(p.dueDate).toISOString().split("T")[0] === today;
  });

  const recentPayments = [...payments].sort((a: any, b: any) => 
    new Date(b.paymentDate || b.createdAt).getTime() - new Date(a.paymentDate || a.createdAt).getTime()
  ).slice(0, 10);

  // Leather texture background
  const leatherBg = "linear-gradient(135deg, #8B4513 0%, #A0522D 25%, #8B4513 50%, #6B3410 75%, #8B4513 100%)";
  const leatherShadow = "inset 0 0 60px rgba(0,0,0,0.5), 5px 0 15px rgba(0,0,0,0.3)";
  const noisePattern = `url("data:image/svg+xml,%3Csvg width='4' height='4' viewBox='0 0 4 4' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1h2v2H1z' fill='%23000' fill-opacity='0.3'/%3E%3C/svg%3E")`;

  // 3D button styles
  const btnBase = (from: string, to: string, textColor: string) => ({
    background: `linear-gradient(145deg, ${from}, ${to}, ${from})`,
    boxShadow: "5px 5px 10px rgba(0,0,0,0.4), -2px -2px 5px rgba(255,255,255,0.1), inset 1px 1px 2px rgba(255,255,255,0.2)",
    border: "1px solid rgba(0,0,0,0.3)",
    color: textColor,
    textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
  });

  const btnHover = (from: string, to: string) => ({
    background: `linear-gradient(145deg, ${from}, ${to}, ${from})`,
    transform: "translateY(-1px)",
    boxShadow: "6px 6px 12px rgba(0,0,0,0.5), -2px -2px 5px rgba(255,255,255,0.15), inset 1px 1px 2px rgba(255,255,255,0.3)",
  });

  const btnActive = (from: string, to: string, textColor: string) => ({
    background: `linear-gradient(145deg, ${from}, ${to}, ${from})`,
    boxShadow: "inset 3px 3px 6px rgba(0,0,0,0.4), inset -1px -1px 3px rgba(255,255,255,0.2)",
    transform: "translateY(2px)",
    color: textColor,
    textShadow: "0 1px 1px rgba(255,255,255,0.5)",
  });

  // Card styles
  const cardBase = {
    background: "linear-gradient(145deg, #F5DEB3, #DEB887, #F5DEB3)",
    boxShadow: "8px 8px 16px rgba(0,0,0,0.4), -3px -3px 8px rgba(255,255,255,0.1), inset 1px 1px 3px rgba(255,255,255,0.3)",
    border: "1px solid rgba(0,0,0,0.2)",
    borderRadius: "16px",
  };

  const cardHighlight = {
    position: "absolute" as const, inset: 0, borderRadius: "16px", pointerEvents: "none" as const,
    background: "linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.15) 100%)",
  };

  const todaysPendingAmount = todaysPendingPayments.reduce(
    (sum: number, p: any) => sum + Number(p.amount || 0),
    0
  );

  const upcomingPaymentsAmount = upcomingPayments.reduce(
    (sum: number, p: any) => sum + Number(p.amount || 0),
    0
  );

  if (loading) return (
    <div className="flex items-center justify-center h-screen" style={{ background: leatherBg }}>
      <div className="p-8 rounded-xl" style={{
        background: "linear-gradient(145deg, #CD853F, #DEB887, #CD853F)",
        boxShadow: "inset 3px 3px 6px rgba(0,0,0,0.4), inset -1px -1px 3px rgba(255,255,255,0.2)",
      }}>
        <p className="text-lg font-bold" style={{ color: "#3E2723", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>
          Loading...
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-3 md:p-5 relative overflow-hidden" style={{ background: leatherBg, boxShadow: leatherShadow }}>
      {/* Leather texture overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: noisePattern, backgroundSize: "3px 3px" }} />
      
      {/* Stitching border */}
      <div className="absolute inset-3 border-2 border-dashed border-yellow-700/40 rounded-xl pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between gap-3 md:gap-0 items-start md:items-center mb-5">
          <div className="p-4 rounded-lg" style={{
            background: "linear-gradient(145deg, #B8860B, #DAA520, #B8860B)",
            boxShadow: "inset 2px 2px 5px rgba(255,255,255,0.4), inset -2px -2px 5px rgba(0,0,0,0.3), 3px 3px 8px rgba(0,0,0,0.4)",
            border: "1px solid #8B6914",
          }}> 
            <h1 className="text-xl md:text-2xl font-bold" style={{ color: "#4A3728", textShadow: "1px 1px 2px rgba(255,255,255,0.6), -1px -1px 1px rgba(0,0,0,0.3)" }}>
              Dashboard
            </h1>
          </div>

          <div className="flex gap-3">
            {/* <SkeuoButton label="Tracking" onClick={() => navigate("/tracking")} {...btnBase("gray", "#6B3410", "#8B4513", "#D2B48C")} hover={btnHover("#7B3F00", "#A0522D")} active={btnActive("#CD853F", "#DEB887", "#3E2723")} />
            <SkeuoButton label="Courses" onClick={() => navigate("/courses")} {...btnBase("gray", "#6B3410", "#8B4513", "#D2B48C")} hover={btnHover("#7B3F00", "#A0522D")} active={btnActive("#CD853F", "#DEB887", "#3E2723")} />
            <SkeuoButton label="Add Payments" onClick={() => navigate("/addpayment")} {...btnBase("blue", "#1a365d", "#2c5282", "#E2E8F0")} hover={btnHover("#2a4365", "#3182ce")} active={btnActive("#63b3ed", "#90cdf4", "#1a365d")} /> */}
            <SkeuoButton label="+ New Student" onClick={() => navigate("/create-student")} {...btnBase("#22543d", "#276749", "#E2E8F0")} hover={btnHover("#276749", "#38a169")} active={btnActive("#68d391", "#9ae6b4", "#22543d")} />
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-8 gap-4 mb-6">
          <MetricCard title="Total Students" value={totalStudents.toString()} color="#4A3728" />
          
          <MetricCard
            title="Total Amount"
            value={`₹${totalAmount.toLocaleString()}`}
            color="#2F855A"
          />

          <MetricCard title="Total Revenue" value={`₹${totalRevenue.toLocaleString()}`} color="#4A3728" />
          <MetricCard title="Today's Collections" value={`₹${todaysCollections.toLocaleString()}`} color="#2F855A" />
          <MetricCard title="Monthly Collection" value={`₹${monthlyCollection.toLocaleString()}`} color="#4A3728" />
          <MetricCard title="Pending Amount" value={`₹${pendingAmount.toLocaleString()}`} color="#C05621" />
          <MetricCard title="Upcoming Payments" value={upcomingPayments.length.toString()} color="#4A3728" />
          <MetricCard title="Overdue Payments" value={overduePayments.length.toString()} color="#C53030" />
        </div>

        {/* Lists Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ListCard
          title="Today's Pending Payments"
          data={todaysPendingPayments}
          type="pending"
          totalAmount={todaysPendingAmount}
        />

        <ListCard
          title="Upcoming Payments (Next 7 Days)"
          data={upcomingPayments}
          type="upcoming"
          totalAmount={upcomingPaymentsAmount}
        />

        <ListCard
          title="Recent Payments"
          data={recentPayments}
          type="recent"
        />
        </div>
      </div>
    </div>
  );

  function SkeuoButton({ label, onClick, hover, active, ...style }: any) {
    const [isPressed, setIsPressed] = useState(false);
    return (
      <button
        onClick={onClick}
        onMouseEnter={(e) => { if (!isPressed) Object.assign(e.currentTarget.style, hover); }}
        onMouseLeave={(e) => { setIsPressed(false); Object.assign(e.currentTarget.style, style); }}
        onMouseDown={(e) => { setIsPressed(true); Object.assign(e.currentTarget.style, active); }}
        onMouseUp={(e) => { Object.assign(e.currentTarget.style, hover); }}
        className="px-3 py-2 rounded-lg font-semibold text-  md:text-sm transition-all duration-150 relative overflow-hidden"
        style={style}
      >
        <span style={{ position: "absolute", inset: 0, borderRadius: "8px", pointerEvents: "none", background: "linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.2) 100%)" }} />
        <span className="relative z-10">{label}</span>
      </button>
    );
  }

  function MetricCard({ title, value, color }: { title: string; value: string; color: string }) {
    return (
      <div className="p-4 relative" style={cardBase}>
        <div style={cardHighlight} />
        <p className="text-sm font-bold uppercase tracking-wider" style={{ color: "#8B4513", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>{title}</p>
        <h2 className="text-2xl font-bold mt-2" style={{ color, textShadow: "1px 1px 2px rgba(0,0,0,0.3), 0 1px 1px rgba(255,255,255,0.5)" }}>{value}</h2>
      </div>
    );
  }

  function ListCard({ title, data, type, totalAmount }: { title: string; data: any[]; type: string, totalAmount?: number; }) {
    return (
      <div className="p-6 relative" style={cardBase}>
        <div style={cardHighlight} />

        <div className="flex justify-between items-center mb-4">
          <h3
            className="font-bold text-lg"
            style={{
              color: "#4A3728",
              textShadow: "1px 1px 2px rgba(255,255,255,0.5)",
            }}
          >
            {title}
          </h3>

          {totalAmount !== undefined && (
            <span
              className="font-bold text-sm px-3 py-1 rounded-lg"
              style={{
                background: "#F5DEB3",
                color: "#2F855A",
                boxShadow: "inset 1px 1px 2px rgba(255,255,255,0.3)",
              }}
            >
              ₹{totalAmount.toLocaleString()}
            </span>
          )}
        </div>
        {data.length === 0 ? (
          <p className="py-8 text-center font-medium" style={{ color: "#8B4513", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>No {type === "recent" ? "recent" : type} payments</p>
        ) : (
          <div className="space-y-3 max-h-96 overflow-auto">
            {data.map((item: any, idx: number) => (
              <div key={item._id || idx} className="flex justify-between items-center p-3 rounded-xl relative overflow-hidden" style={{
                background: "linear-gradient(145deg, #DEB887, #F5DEB3, #DEB887)",
                boxShadow: "3px 3px 6px rgba(0,0,0,0.3), -1px -1px 3px rgba(255,255,255,0.2), inset 1px 1px 2px rgba(255,255,255,0.3)",
                border: "1px solid rgba(0,0,0,0.15)",
              }}>
                <span style={{ position: "absolute", inset: 0, borderRadius: "12px", pointerEvents: "none", background: "linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)" }} />
                <div className="relative z-10">
                  <p className="font-bold" style={{ color: "#3E2723", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>
                    {type === "recent" ? (item.studentId?.name || item.studentName || "Student") : item.studentName}
                  </p>
                  <p className="text-sm font-medium" style={{ color: "#8B4513", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>
                    {type === "pending" ? "Due today" : type === "upcoming" ? `Due: ${new Date(item.dueDate).toLocaleDateString('en-IN')}` : new Date(item.paymentDate || item.createdAt).toLocaleDateString('en-IN')}
                  </p>
                </div>
                <div className="text-right relative z-10">
                  <p className="font-bold" style={{ 
                    color: type === "recent" ? "#2F855A" : type === "pending" ? "#C05621" : "#4A3728",
                    textShadow: "1px 1px 2px rgba(0,0,0,0.2), 0 1px 1px rgba(255,255,255,0.5)" 
                  }}>
                    ₹{item.amount}
                  </p>
                  {type === "recent" && (
                    <p className="text-xs font-bold uppercase" style={{ color: "#8B4513", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>{item.status || "Paid"}</p>
                  )}
                  {type !== "recent" && (
                    <p className="text-xs font-medium" style={{ color: "#8B4513", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>{item.course}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}