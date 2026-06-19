import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getPayments, createPayment } from "../services/paymentService";
import { getInstallmentStatus, isPositiveInstallment } from "../utils/installmentUtils";

export default function Payments() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState<any[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("All");
  const [selectedDuration, setSelectedDuration] = useState("All");
  const [selectedMethod, setSelectedMethod] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const data = await getPayments();
      setPayments(Array.isArray(data) ? data : []);
      setFilteredPayments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load payments:", err);
      setPayments([]);
      setFilteredPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPayment = async () => {
  try {
    const studentId = prompt("Enter Student ID");

    if (!studentId) return;

    const amount = Number(prompt("Enter Amount"));

    if (!amount) return;

    const method = prompt("Payment Method (Cash/UPI/Bank Transfer)") || "Cash";

    const transactionId =
      prompt("Transaction ID") || `TXN-${Date.now()}`;

    await createPayment({
      studentId,
      amount,
      method,
      transactionId,
    });

    alert("Payment Added Successfully");

    loadPayments(); // refresh table
  } catch (error) {
    console.error(error);
    alert("Failed to add payment");
  }
};

  // Apply Filters
  useEffect(() => {
    let result = [...payments];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter((payment) =>
        payment.studentId?.name?.toLowerCase().includes(term) ||
        payment.transactionId?.toLowerCase().includes(term) ||
        payment.studentId?.email?.toLowerCase().includes(term) ||
        payment.studentId?.courseId?.name?.toLowerCase().includes(term)
      );
    }

    // Course filter
    if (selectedCourse !== "All") {
      result = result.filter((p) => (p.studentId?.courseId?.name || p.course) === selectedCourse);
    }

    // Duration filter
    if (selectedDuration !== "All") {
      result = result.filter((p) => String(p.studentId?.durationMonths || p.duration) === selectedDuration);
    }

    // Payment Method filter
    if (selectedMethod !== "All") {
      result = result.filter((p) => (p.method || "").toLowerCase() === selectedMethod.toLowerCase());
    }

    // Status filter
    if (selectedStatus !== "All") {
      result = result.filter((p) => {
        const upcomingInstallment =
          p.studentId?.installments?.find(
            (i: any) => isPositiveInstallment(i) && getInstallmentStatus(i) !== "paid"
          );

        const status = upcomingInstallment
          ? "Unpaid"
          : "Paid";

        return (
          status.toLowerCase() ===
          selectedStatus.toLowerCase()
        );
      });
    }

    setFilteredPayments(result);
  }, [searchTerm, selectedCourse, selectedDuration, selectedMethod, selectedStatus, payments]);

  // Get unique values for filters
  const courses = [
    "All",
    ...new Set(
      payments
        .map((p) => p.studentId?.courseId?.name || p.course)
        .filter(Boolean)
    ),
  ];

  // Export to CSV
  const exportToCSV = () => {
    if (filteredPayments.length === 0) {
      alert("No data to export");
      return;
    }

    const headers = ["Student Name", "Amount", "Date", "Method", "Course", "Duration", "Status", "Transaction ID"];

    const csvContent = [
      headers.join(","),
      ...filteredPayments.map((p) => [
        `"${p.studentId?.name || ""}"`,
        p.amount,
        p.date ? new Date(p.date).toLocaleDateString() : "",
        p.method || "",
        `"${p.studentId?.courseId?.name || p.course || ""}"`,
        p.studentId?.durationMonths || p.duration || "",
        p.status || "Paid",
        `"${p.transactionId || ""}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `payments_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
  };

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

  const inputStyle = {
    background: "linear-gradient(145deg, #DEB887, #F5DEB3, #DEB887)",
    boxShadow: "inset 3px 3px 6px rgba(0,0,0,0.3), inset -1px -1px 3px rgba(255,255,255,0.5), 2px 2px 5px rgba(0,0,0,0.2)",
    border: "1px solid rgba(0,0,0,0.2)",
    color: "#3E2723",
    textShadow: "0 1px 1px rgba(255,255,255,0.5)",
    borderRadius: "12px",
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

  const labelStyle = {
    color: "#6B3410",
    textShadow: "0 1px 1px rgba(255,255,255,0.5)",
    fontWeight: "bold",
    fontSize: "0.875rem",
    marginBottom: "0.25rem",
    display: "block",
  };

  return (
    <div className="min-h-screen p-6 relative overflow-hidden" style={{ background: leatherBg, boxShadow: leatherShadow }}>
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: noisePattern, backgroundSize: "3px 3px" }} />
      <div className="absolute inset-3 border-2 border-dashed border-yellow-700/40 rounded-xl pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="p-4 rounded-lg" style={{
            background: "linear-gradient(145deg, #B8860B, #DAA520, #B8860B)",
            boxShadow: "inset 2px 2px 5px rgba(255,255,255,0.4), inset -2px -2px 5px rgba(0,0,0,0.3), 3px 3px 8px rgba(0,0,0,0.4)",
            border: "1px solid #8B6914",
          }}>
            <h1 className="text-3xl font-bold" style={{ color: "#4A3728", textShadow: "1px 1px 2px rgba(255,255,255,0.6), -1px -1px 1px rgba(0,0,0,0.3)" }}>
              Payments
            </h1>
          </div>

          <div className="flex gap-3">
            <SkeuoButton
              label="📥 Export CSV"
              onClick={exportToCSV}
              base={btnBase("#4A5568", "#718096", "#E2E8F0")}
              hover={btnHover("#2D3748", "#4A5568")}
              active={btnActive("#A0AEC0", "#CBD5E0", "#2D3748")}
            />
            <SkeuoButton
              label="+ Add Payment"
              onClick={handleAddPayment}
              base={btnBase("#22543d", "#276749", "#E2E8F0")}
              hover={btnHover("#276749", "#38a169")}
              active={btnActive("#68d391", "#9ae6b4", "#22543d")}
            />
          </div>
        </div>

        {/* Filters Bar */}
        <div className="p-5 mb-6 flex flex-wrap gap-4 items-end relative" style={cardBase}>
          <div style={cardHighlight} />
          <div className="flex-1 min-w-[300px] relative z-10">
            <label style={labelStyle}>Search</label>
            <input
              type="text"
              placeholder="Search by student name, transaction ID, course..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3"
              style={inputStyle}
            />
          </div>

          <div className="min-w-[180px] relative z-10">
            <label style={labelStyle}>Course</label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full px-4 py-3"
              style={inputStyle}
            >
              {courses.map((course, i) => (
                <option key={i} value={course} style={{ background: "#F5DEB3" }}>{course}</option>
              ))}
            </select>
          </div>

          <div className="min-w-[160px] relative z-10">
            <label style={labelStyle}>Duration</label>
            <select
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(e.target.value)}
              className="w-full px-4 py-3"
              style={inputStyle}
            >
              <option value="All" style={{ background: "#F5DEB3" }}>Any Duration</option>
              <option value="1" style={{ background: "#F5DEB3" }}>1 Month</option>
              <option value="2" style={{ background: "#F5DEB3" }}>2 Months</option>
              <option value="3" style={{ background: "#F5DEB3" }}>3 Months</option>
              <option value="6" style={{ background: "#F5DEB3" }}>6 Months</option>
            </select>
          </div>

          <div className="min-w-[160px] relative z-10">
            <label style={labelStyle}>Payment Method</label>
            <select
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="w-full px-4 py-3"
              style={inputStyle}
            >
              <option value="All" style={{ background: "#F5DEB3" }}>All Methods</option>
              <option value="Cash" style={{ background: "#F5DEB3" }}>Cash</option>
              <option value="UPI" style={{ background: "#F5DEB3" }}>UPI</option>
              <option value="Bank Transfer" style={{ background: "#F5DEB3" }}>Bank Transfer</option>
            </select>
          </div>

          <div className="min-w-[160px] relative z-10">
            <label style={labelStyle}>Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-3"
              style={inputStyle}
            >
              <option value="All" style={{ background: "#F5DEB3" }}>All Status</option>
              <option value="Paid" style={{ background: "#F5DEB3" }}>Paid</option>
              <option value="Unpaid" style={{ background: "#F5DEB3" }}>Unpaid</option>
            </select>
          </div>

          <SkeuoButton
            label="Reset Filters"
            onClick={() => {
              setSearchTerm("");
              setSelectedCourse("All");
              setSelectedDuration("All");
              setSelectedMethod("All");
              setSelectedStatus("All");
            }}
            base={btnBase("#6B3410", "#8B4513", "#D2B48C")}
            hover={btnHover("#7B3F00", "#A0522D")}
            active={btnActive("#CD853F", "#DEB887", "#3E2723")}
          />
        </div>

        {/* Payments Table */}
        <div className="relative overflow-hidden" style={cardBase}>
          <div style={cardHighlight} />
          <div className="overflow-x-auto relative z-10">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "2px solid #8B4513" }}>
                  <th className="p-4 text-left font-bold" style={{ color: "#6B3410", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>Student Name</th>
                  <th className="p-4 text-left font-bold" style={{ color: "#6B3410", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>Paid Amount</th>
                  <th className="p-4 text-left font-bold" style={{ color: "#6B3410", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>Payment Date</th>
                  <th className="p-4 text-left font-bold" style={{ color: "#6B3410", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>Course</th>
                  <th className="p-4 text-left font-bold" style={{ color: "#6B3410", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>Duration</th>
                  <th className="p-4 text-left font-bold" style={{ color: "#6B3410", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>Installment Status</th>
                  <th className="p-4 text-left font-bold" style={{ color: "#6B3410", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>Unpaid Amount</th>
                  <th className="p-4 text-left font-bold" style={{ color: "#6B3410", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>Due Date</th>
                  <th className="p-4 text-left font-bold" style={{ color: "#6B3410", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>Transaction ID</th>
                  <th className="p-4 text-center font-bold" style={{ color: "#6B3410", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={10} className="p-12 text-center font-bold" style={{ color: "#8B4513", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>
                      Loading payments...
                    </td>
                  </tr>
                ) : filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="p-12 text-center font-bold" style={{ color: "#8B4513", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>
                      No payments found
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((payment: any, idx: number) => (
                    <tr key={payment._id || idx} className="border-b transition-colors hover:bg-white/20" style={{ borderColor: "rgba(139,69,19,0.2)" }}>
                      <td className="p-4 font-bold" style={{ color: "#3E2723", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>
                        {payment.studentId?.name || "—"}
                      </td>
                      <td className="p-4 font-bold" style={{ color: "#2F855A", textShadow: "1px 1px 2px rgba(0,0,0,0.2), 0 1px 1px rgba(255,255,255,0.5)" }}>
                        ₹{Number(payment.amount || 0).toLocaleString()}
                      </td>
                      <td className="p-4 font-bold" style={{ color: "#6B3410", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>
                        {payment.date ? new Date(payment.date).toLocaleDateString() : "—"}
                      </td>
                      <td className="p-4 font-bold" style={{ color: "#6B3410", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>
                        {payment.studentId?.courseId?.name || payment.course || "—"}
                      </td>
                      <td className="p-4 font-bold" style={{ color: "#6B3410", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>
                        {payment.studentId?.durationMonths || payment.duration || "—"}
                      </td>
                      <td className="p-4">
                        {(() => {
                          const upcomingInstallment = payment.studentId?.installments?.find((i: any) => isPositiveInstallment(i) && getInstallmentStatus(i) !== "paid");
                          return (
                            <span className="inline-flex px-4 py-1 rounded-full text-xs font-bold" style={{
                              background: upcomingInstallment
                                ? "linear-gradient(145deg, #c53030, #fc8181, #c53030)"
                                : "linear-gradient(145deg, #48bb78, #68d391, #48bb78)",
                              boxShadow: "inset 1px 1px 3px rgba(255,255,255,0.4), inset -1px -1px 3px rgba(0,0,0,0.2), 2px 2px 4px rgba(0,0,0,0.3)",
                              color: "#fff",
                              textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
                              border: "1px solid rgba(0,0,0,0.2)",
                            }}>
                              {upcomingInstallment ? "Unpaid" : "Paid"}
                            </span>
                          );
                        })()}
                      </td>
                      <td className="p-4 font-bold" style={{ color: "#C05621", textShadow: "1px 1px 2px rgba(0,0,0,0.2), 0 1px 1px rgba(255,255,255,0.5)" }}>
                        {(() => {
                          const totalFee = Number(payment.studentId?.courseFee || 0) - Number(payment.studentId?.discount || 0) - Number(payment.studentId?.scholarship || 0);
                          const totalPaid = payments.filter((p) => p.studentId?._id === payment.studentId?._id).reduce((sum, p) => sum + Number(p.amount || 0), 0);
                          const unpaidAmount = Math.max(0, totalFee - totalPaid);
                          return `₹${unpaidAmount.toLocaleString()}`;
                        })()}
                      </td>
                      <td className="p-4 font-bold" style={{ color: "#6B3410", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>
                        {(() => {
                          const upcomingInstallment = payment.studentId?.installments?.find((i: any) => isPositiveInstallment(i) && getInstallmentStatus(i) !== "paid");
                          return upcomingInstallment?.dueDate ? new Date(upcomingInstallment.dueDate).toLocaleDateString("en-IN") : "-";
                        })()}
                      </td>
                      <td className="p-4 font-mono text-sm font-bold" style={{ color: "#8B4513", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>
                        {payment.transactionId || "—"}
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => navigate(`/payments/new/${payment.studentId?._id}`)}
                          className="p-2 rounded-lg transition-all duration-150"
                          style={{
                            background: "linear-gradient(145deg, #3182ce, #63b3ed, #3182ce)",
                            boxShadow: "3px 3px 6px rgba(0,0,0,0.3), -1px -1px 3px rgba(255,255,255,0.2), inset 1px 1px 2px rgba(255,255,255,0.3)",
                            border: "1px solid rgba(0,0,0,0.2)",
                            color: "#fff",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "linear-gradient(145deg, #2b6cb0, #4299e1, #2b6cb0)";
                            e.currentTarget.style.transform = "translateY(-1px)";
                            e.currentTarget.style.boxShadow = "4px 4px 8px rgba(0,0,0,0.4), -1px -1px 3px rgba(255,255,255,0.3), inset 1px 1px 2px rgba(255,255,255,0.4)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "linear-gradient(145deg, #3182ce, #63b3ed, #3182ce)";
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "3px 3px 6px rgba(0,0,0,0.3), -1px -1px 3px rgba(255,255,255,0.2), inset 1px 1px 2px rgba(255,255,255,0.3)";
                          }}
                          onMouseDown={(e) => {
                            e.currentTarget.style.transform = "translateY(1px)";
                            e.currentTarget.style.boxShadow = "inset 2px 2px 5px rgba(0,0,0,0.3), inset -1px -1px 3px rgba(255,255,255,0.2)";
                          }}
                          onMouseUp={(e) => {
                            e.currentTarget.style.transform = "translateY(-1px)";
                            e.currentTarget.style.boxShadow = "4px 4px 8px rgba(0,0,0,0.4), -1px -1px 3px rgba(255,255,255,0.3), inset 1px 1px 2px rgba(255,255,255,0.4)";
                          }}
                        >
                          <Eye size={18} style={{ filter: "drop-shadow(1px 1px 1px rgba(0,0,0,0.5))" }} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  function SkeuoButton({ label, onClick, base, hover, active, disabled }: any) {
    const [isPressed, setIsPressed] = useState(false);

    return (
      <button
        onClick={onClick}
        disabled={disabled}
        onMouseEnter={(e) => { if (!disabled && !isPressed) Object.assign(e.currentTarget.style, hover); }}
        onMouseLeave={(e) => { setIsPressed(false); Object.assign(e.currentTarget.style, base); }}
        onMouseDown={(e) => { if (!disabled) { setIsPressed(true); Object.assign(e.currentTarget.style, active); } }}
        onMouseUp={(e) => { if (!disabled) { setIsPressed(false); Object.assign(e.currentTarget.style, hover); } }}
        className="px-5 py-2.5 font-bold text-sm transition-all duration-150 relative overflow-hidden flex items-center gap-2"
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


