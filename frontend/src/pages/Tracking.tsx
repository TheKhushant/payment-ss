import { useEffect, useState } from "react";
import { getStudents } from "../services/studentService";
import { getInstallmentStatus, isPositiveInstallment } from "../utils/installmentUtils";

export default function Tracking() {
  const [trackingData, setTrackingData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [showStudentModal, setShowStudentModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const students = await getStudents();

      const rows: any[] = [];

      students.forEach((student: any) => {
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
            fullStudent: student,
            installmentId: installment._id,
          });
        });
      });

      // Sort by dueDate
      // rows.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
      rows.sort((a, b) => {
        const aDate = a.dueDate
          ? new Date(a.dueDate).getTime()
          : Number.MAX_SAFE_INTEGER;

        const bDate = b.dueDate
          ? new Date(b.dueDate).getTime()
          : Number.MAX_SAFE_INTEGER;

        return aDate - bDate;
      });
      setTrackingData(rows);
    } catch (err) {
      console.error("Error loading tracking data:", err);
    } finally { 
      setLoading(false);
    }
  };

  // Upcoming Payments (Next 7 days) - Sorted by due date
  const upcomingPayments = trackingData
    .filter((p: any) => p.status === "upcoming")
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

    const upcomingTotal = upcomingPayments.reduce(
    (sum: number, p: any) => sum + Number(p.amount || 0),
    0
  );

  // Overdue Payments - Sorted by due date (oldest first)
  const overduePayments = trackingData
    .filter((p: any) => p.status === "overdue")
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  const overdueTotal = overduePayments.reduce(
    (sum: number, p: any) => sum + Number(p.amount || 0),
    0
  );
  const openStudentInfo = (payment: any) => {
    setSelectedPayment(payment);
    setShowStudentModal(true);
  };

  // console.log("UPCOMING", upcomingPayments);
  // console.log("OVERDUE", overduePayments);

  const leatherBg = "linear-gradient(135deg, #8B4513 0%, #A0522D 25%, #8B4513 50%, #6B3410 75%, #8B4513 100%)";
  const leatherShadow = "inset 0 0 60px rgba(0,0,0,0.5)";
  const noisePattern = `url("data:image/svg+xml,%3Csvg width='4' height='4' viewBox='0 0 4 4' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1h2v2H1z' fill='%23000' fill-opacity='0.3'/%3E%3C/svg%3E")`;

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

  const btnBase = (from: string, to: string, textColor: string) => ({
    background: `linear-gradient(145deg, ${from}, ${to}, ${from})`,
    boxShadow: "5px 5px 10px rgba(0,0,0,0.4), -2px -2px 5px rgba(255,255,255,0.1), inset 1px 1px 2px rgba(255,255,255,0.2)",
    border: "1px solid rgba(0,0,0,0.3)",
    color: textColor,
    textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
    borderRadius: "12px",
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

  return (
    <div className="min-h-screen p-6 relative overflow-hidden" style={{ background: leatherBg, boxShadow: leatherShadow }}>
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: noisePattern, backgroundSize: "3px 3px" }} />
      <div className="absolute inset-3 border-2 border-dashed border-yellow-700/40 rounded-xl pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="p-4 rounded-lg" style={{
            background: "linear-gradient(145deg, #B8860B, #DAA520, #B8860B)",
            boxShadow: "inset 2px 2px 5px rgba(255,255,255,0.4), inset -2px -2px 5px rgba(0,0,0,0.3), 3px 3px 8px rgba(0,0,0,0.4)",
            border: "1px solid #8B6914",
          }}>
            <h1 className="text-3xl font-bold" style={{ color: "#4A3728", textShadow: "1px 1px 2px rgba(255,255,255,0.6), -1px -1px 1px rgba(0,0,0,0.3)" }}>
              Payment Tracking
            </h1>
          </div>
          <SkeuoButton
            label="🔄 Refresh"
            onClick={loadData}
            base={btnBase("#6B3410", "#8B4513", "#D2B48C")}
            hover={btnHover("#7B3F00", "#A0522D")}
            active={btnActive("#CD853F", "#DEB887", "#3E2723")}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Payments */}
          <div className="p-6 relative" style={cardBase}>
            <div style={cardHighlight} />
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div>
                <h2 className="text-2xl font-bold" style={{ color: "#2F855A", textShadow: "1px 1px 2px rgba(255,255,255,0.5)" }}>Upcoming Payments</h2>
                <p className="text-sm font-bold" style={{ color: "#8B4513", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>ALL Upcoming Payments</p>
              </div>
              <div className="text-right p-3 rounded-lg" style={{
                background: "linear-gradient(145deg, #48bb78, #68d391, #48bb78)",
                boxShadow: "inset 2px 2px 5px rgba(0,0,0,0.3), inset -1px -1px 3px rgba(255,255,255,0.3), 3px 3px 8px rgba(0,0,0,0.3)",
                border: "1px solid rgba(0,0,0,0.2)",
              }}>
                <p className="text-xs font-bold" style={{ color: "#fff", textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}>Total Due</p>
                <p className="text-3xl font-bold" style={{ color: "#fff", textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}>₹{upcomingTotal.toLocaleString()}</p>
              </div>
            </div>
              <div className="grid grid-cols-4 gap-4 px-3 py-2 mb-2 font-bold text-sm border-b">
                <div>Student</div>
                <div>Course</div>
                <div className="text-center">Due Date</div>
                <div className="text-right">Amount</div>
              </div>
            <div className="space-y-4 max-h-[calc(100vh-280px)] overflow-auto pr-2 relative z-10">
              {loading ? (
                <p className="text-center py-12 font-bold" style={{ color: "#8B4513", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>Loading upcoming payments...</p>
              ) : upcomingPayments.length === 0 ? (
                <p className="text-center py-12 font-bold" style={{ color: "#2F855A", textShadow: "1px 1px 2px rgba(255,255,255,0.5)" }}>No upcoming payments in next 60 days 🎉</p>
              ) : (
                upcomingPayments.map((payment: any) => (
                  <div
                    key={payment._id}
                    className="p-3 rounded-xl cursor-pointer hover:scale-[1.01] transition-all relative overflow-hidden transition-all duration-150 hover:translate-y-[-2px]"
                    style={{
                      background: "linear-gradient(145deg, #DEB887, #F5DEB3, #DEB887)",
                      boxShadow: "4px 4px 8px rgba(0,0,0,0.3), -2px -2px 5px rgba(255,255,255,0.2), inset 1px 1px 2px rgba(255,255,255,0.3)",
                      border: "1px solid rgba(0,0,0,0.15)",
                    }}
                  >
                    <div style={{
                      position: "absolute", inset: 0, borderRadius: "12px", pointerEvents: "none",
                      background: "linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)",
                    }} />
                    <div
                      onClick={() => openStudentInfo(payment)}
                      className="grid grid-cols-4 gap-4 items-center w-full cursor-pointer relative z-10"
                    >
                      <div className="font-bold truncate">
                        {payment.studentName}
                      </div>

                      <div className="truncate">
                        {payment.course}
                      </div>

                      <div className="text-center font-semibold">
                        {new Date(payment.dueDate).toLocaleDateString("en-IN")}
                      </div>

                      <div className="text-right font-bold">
                        ₹{Number(payment.amount).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Overdue Payments */}
          <div className="p-6 relative" style={cardBase}>
            <div style={cardHighlight} />
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div>
                <h2 className="text-2xl font-bold" style={{ color: "#C53030" }}>
                  Overdue Payments
                </h2>
                <p className="text-sm font-bold" style={{ color: "#8B4513" }}>
                  Immediate Attention Required
                </p>
              </div>

              <div className="text-right p-3 rounded-lg" style={{
                background: "linear-gradient(145deg, #c53030, #e53e3e, #c53030)",
                boxShadow: "3px 3px 8px rgba(0,0,0,0.3)",
              }}>
                <p className="text-xs font-bold text-white">
                  Total Overdue
                </p>
                <p className="text-3xl font-bold text-white">
                  ₹{overdueTotal.toLocaleString()}
                </p>
              </div>
            </div>
              <div className="grid grid-cols-4 gap-4 px-3 py-2 mb-2 font-bold text-sm border-b">
                <div>Student</div>
                <div>Course</div>
                <div className="text-center">Due Date</div>
                <div className="text-right">Amount</div>
              </div>
            <div className="space-y-4 max-h-[calc(100vh-280px)] overflow-auto pr-2 relative z-10">
              {loading ? (
                <p className="text-center py-12 font-bold" style={{ color: "#8B4513", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>Loading overdue payments...</p>
              ) : overduePayments.length === 0 ? (
                <p className="text-center py-12 font-bold" style={{ color: "#2F855A", textShadow: "1px 1px 2px rgba(255,255,255,0.5)" }}>No overdue payments 🎉 Great Job!</p>
              ) : (
                overduePayments.map((payment: any) => (
                  <div
                    key={payment._id}
                    className="flex justify-between items-center p-5 rounded-xl relative overflow-hidden transition-all duration-150 hover:translate-y-[-2px]"
                    style={{
                      background: "linear-gradient(145deg, #c53030, #e53e3e, #c53030)",
                      boxShadow: "4px 4px 8px rgba(0,0,0,0.4), -2px -2px 5px rgba(255,255,255,0.15), inset 1px 1px 2px rgba(255,255,255,0.3)",
                      border: "1px solid rgba(0,0,0,0.2)",
                    }}
                  >
                    <div style={{
                      position: "absolute", inset: 0, borderRadius: "12px", pointerEvents: "none",
                      background: "linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 50%, rgba(0,0,0,0.2) 100%)",
                    }} />
                    <div
                      onClick={() => openStudentInfo(payment)}
                      className="grid grid-cols-4 gap-4 items-center w-full cursor-pointer relative z-10"
                    >
                      <div className="font-bold truncate">
                        {payment.studentName}
                      </div>

                      <div className="truncate">
                        {payment.course}
                      </div>

                      <div className="text-center font-semibold">
                        {new Date(payment.dueDate).toLocaleDateString("en-IN")}
                      </div>

                      <div className="text-right font-bold">
                        ₹{Number(payment.amount).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Student Information Modal */}
        {showStudentModal && selectedPayment && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: "rgba(0,0,0,0.7)" }}>
            <div className="relative w-full max-w-lg max-h-[90vh] overflow-hidden" style={{
              background: "linear-gradient(145deg, #F5DEB3, #DEB887, #F5DEB3)",
              boxShadow: "12px 12px 24px rgba(0,0,0,0.5), -4px -4px 12px rgba(255,255,255,0.1), inset 1px 1px 3px rgba(255,255,255,0.3)",
              border: "1px solid rgba(0,0,0,0.3)",
              borderRadius: "20px",
            }}>
              <div style={{
                position: "absolute", inset: 0, borderRadius: "20px", pointerEvents: "none",
                background: "linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.15) 100%)",
              }} />
              
              <div className="p-6 relative z-10" style={{ borderBottom: "2px solid #8B4513" }}>
                <h3 className="text-2xl font-bold" style={{ color: "#4A3728", textShadow: "1px 1px 2px rgba(255,255,255,0.5)" }}>Student Information</h3>
                <p className="font-bold" style={{ color: "#8B4513", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>{selectedPayment.studentName}</p>
              </div>

              <div className="p-6 space-y-6 overflow-auto max-h-[65vh] relative z-10">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg" style={{
                    background: "linear-gradient(145deg, #DEB887, #F5DEB3, #DEB887)",
                    boxShadow: "2px 2px 4px rgba(0,0,0,0.2), inset 1px 1px 2px rgba(255,255,255,0.3)",
                    border: "1px solid rgba(0,0,0,0.15)",
                  }}>
                    <p className="text-xs font-bold uppercase" style={{ color: "#8B4513", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>EMAIL</p>
                    <p className="font-bold" style={{ color: "#3E2723", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>{selectedPayment.studentEmail || "Not available"}</p>
                  </div>
                  <div className="p-3 rounded-lg" style={{
                    background: "linear-gradient(145deg, #DEB887, #F5DEB3, #DEB887)",
                    boxShadow: "2px 2px 4px rgba(0,0,0,0.2), inset 1px 1px 2px rgba(255,255,255,0.3)",
                    border: "1px solid rgba(0,0,0,0.15)",
                  }}>
                    <p className="text-xs font-bold uppercase" style={{ color: "#8B4513", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>MOBILE</p>
                    <p className="font-bold" style={{ color: "#3E2723", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>{selectedPayment.studentMobile || "Not available"}</p>
                  </div>
                </div>

                <div className="p-3 rounded-lg" style={{
                  background: "linear-gradient(145deg, #DEB887, #F5DEB3, #DEB887)",
                  boxShadow: "2px 2px 4px rgba(0,0,0,0.2), inset 1px 1px 2px rgba(255,255,255,0.3)",
                  border: "1px solid rgba(0,0,0,0.15)",
                }}>
                  <p className="text-xs font-bold uppercase" style={{ color: "#8B4513", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>COURSE</p>
                  <p className="font-bold" style={{ color: "#3E2723", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>{selectedPayment.course}</p>
                </div>

                {selectedPayment.college && (
                  <div className="p-3 rounded-lg" style={{
                    background: "linear-gradient(145deg, #DEB887, #F5DEB3, #DEB887)",
                    boxShadow: "2px 2px 4px rgba(0,0,0,0.2), inset 1px 1px 2px rgba(255,255,255,0.3)",
                    border: "1px solid rgba(0,0,0,0.15)",
                  }}>
                    <p className="text-xs font-bold uppercase" style={{ color: "#8B4513", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>COLLEGE</p>
                    <p className="font-bold" style={{ color: "#3E2723", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>{selectedPayment.college}</p>
                  </div>
                )}

                <div className="pt-4" style={{ borderTop: "2px solid #8B4513" }}>
                  <p className="text-xs font-bold uppercase mb-2" style={{ color: "#8B4513", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>PAYMENT DETAILS</p>
                  <div className="p-4 rounded-xl" style={{
                    background: "linear-gradient(145deg, #DEB887, #F5DEB3, #DEB887)",
                    boxShadow: "inset 2px 2px 5px rgba(0,0,0,0.2), inset -1px -1px 3px rgba(255,255,255,0.5), 2px 2px 4px rgba(0,0,0,0.2)",
                    border: "1px solid rgba(0,0,0,0.15)",
                  }}>
                    <div className="flex justify-between mb-2">
                      <span className="font-bold" style={{ color: "#8B4513", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>Amount Due</span>
                      <span className="font-bold" style={{ color: "#C05621", textShadow: "1px 1px 2px rgba(0,0,0,0.2), 0 1px 1px rgba(255,255,255,0.5)" }}>₹{Number(selectedPayment.amount).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold" style={{ color: "#8B4513", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>Due Date</span>
                      <span className="font-bold" style={{ color: "#3E2723", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>{new Date(selectedPayment.dueDate).toLocaleDateString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 flex gap-3 relative z-10" style={{ borderTop: "2px solid #8B4513" }}>
                <SkeuoButton
                  label="Close"
                  onClick={() => setShowStudentModal(false)}
                  base={btnBase("#6B3410", "#8B4513", "#D2B48C")}
                  hover={btnHover("#7B3F00", "#A0522D")}
                  active={btnActive("#CD853F", "#DEB887", "#3E2723")}
                  fullWidth
                />
                {/* <SkeuoButton
                  label="Full Profile"
                  onClick={() => window.location.href = `/students/${selectedPayment.studentId}`}
                  base={btnBase("#3182ce", "#63b3ed", "#fff")}
                  hover={btnHover("#2b6cb0", "#4299e1")}
                  active={btnActive("#90cdf4", "#bee3f8", "#2b6cb0")}
                  fullWidth
                /> */}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  function SkeuoButton({ label, onClick, base, hover, active, disabled, fullWidth }: any) {
    const [isPressed, setIsPressed] = useState(false);

    return (
      <button
        onClick={onClick}
        disabled={disabled}
        onMouseEnter={(e) => { if (!disabled && !isPressed) Object.assign(e.currentTarget.style, hover); }}
        onMouseLeave={(e) => { setIsPressed(false); Object.assign(e.currentTarget.style, base); }}
        onMouseDown={(e) => { if (!disabled) { setIsPressed(true); Object.assign(e.currentTarget.style, active); } }}
        onMouseUp={(e) => { if (!disabled) { setIsPressed(false); Object.assign(e.currentTarget.style, hover); } }}
        className={`py-3 font-bold text-sm transition-all duration-150 relative overflow-hidden ${fullWidth ? "flex-1" : "px-5"}`}
        style={{ ...base, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.6 : 1 }}
      >
        <span style={{
          position: "absolute", inset: 0, borderRadius: "12px", pointerEvents: "none",
          background: "linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.2) 100%)",
        }} />
        <span className="relative z-10">{label}</span>
      </button>
    );
  }
}