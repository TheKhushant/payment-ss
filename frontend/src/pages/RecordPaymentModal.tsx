import { useState, useEffect } from "react";
import { getStudents } from "../services/studentService";
import { getPayments } from "../services/paymentService";

interface RecordPaymentProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function RecordPaymentModal({ isOpen, onClose, onSuccess }: RecordPaymentProps) {
  const [students, setStudents] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    studentId: "",
    studentName: "",
    amount: 0,
    transactionId: "",
    notes: "",
    paymentMethod: "UPI",
  });

  const [filteredStudents, setFilteredStudents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (isOpen) {
      loadData();
      setFormData({
        studentId: "",
        studentName: "",
        amount: 0,
        transactionId: "",
        notes: "",
        paymentMethod: "UPI",
      });
      setSearchTerm("");
    }
  }, [isOpen]);

  const loadData = async () => {
    try {
      const [studentData, paymentData] = await Promise.all([
        getStudents(),
        getPayments()
      ]);
      setStudents(studentData || []);
      setPayments(paymentData || []);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    if (!searchTerm) { setFilteredStudents(students); return; }
    const term = searchTerm.toLowerCase();
    const result = students.filter(student =>
      student.name?.toLowerCase().includes(term) ||
      student.email?.toLowerCase().includes(term) ||
      student.mobile?.includes(term)
    );
    setFilteredStudents(result);
  }, [searchTerm, students]);

  const handleStudentSelect = (student: any) => {
    setFormData({ ...formData, studentId: student._id, studentName: student.name });
    setSearchTerm(student.name);
    const pendingForStudent = payments.find(p => p.studentId === student._id && (p.status === "pending" || !p.status));
    if (pendingForStudent) setFormData(prev => ({ ...prev, amount: Number(pendingForStudent.amount) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentId || formData.amount <= 0) {
      alert("Please select a student and enter amount");
      return;
    }
    try {
      console.log("Recording Payment:", formData);
      alert("Payment recorded successfully!");
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to record payment");
    }
  };

  if (!isOpen) return null;

  const leatherBg = "linear-gradient(135deg, #8B4513 0%, #A0522D 25%, #8B4513 50%, #6B3410 75%, #8B4513 100%)";
  const noisePattern = `url("data:image/svg+xml,%3Csvg width='4' height='4' viewBox='0 0 4 4' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1h2v2H1z' fill='%23000' fill-opacity='0.3'/%3E%3C/svg%3E")`;

  const cardBase = {
    background: "linear-gradient(145deg, #F5DEB3, #DEB887, #F5DEB3)",
    boxShadow: "12px 12px 24px rgba(0,0,0,0.5), -4px -4px 12px rgba(255,255,255,0.1), inset 1px 1px 3px rgba(255,255,255,0.3)",
    border: "1px solid rgba(0,0,0,0.3)",
    borderRadius: "20px",
  };

  const cardHighlight = {
    position: "absolute" as const, inset: 0, borderRadius: "20px", pointerEvents: "none" as const,
    background: "linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.15) 100%)",
  };

  const inputStyle = {
    background: "linear-gradient(145deg, #DEB887, #F5DEB3, #DEB887)",
    boxShadow: "inset 3px 3px 6px rgba(0,0,0,0.3), inset -1px -1px 3px rgba(255,255,255,0.5), 2px 2px 5px rgba(0,0,0,0.2)",
    border: "1px solid rgba(0,0,0,0.2)",
    color: "#3E2723",
    textShadow: "0 1px 1px rgba(255,255,255,0.5)",
    borderRadius: "16px",
  };

  const btnBase = (from: string, to: string, textColor: string) => ({
    background: `linear-gradient(145deg, ${from}, ${to}, ${from})`,
    boxShadow: "5px 5px 10px rgba(0,0,0,0.4), -2px -2px 5px rgba(255,255,255,0.1), inset 1px 1px 2px rgba(255,255,255,0.2)",
    border: "1px solid rgba(0,0,0,0.3)",
    color: textColor,
    textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
    borderRadius: "16px",
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
    marginBottom: "0.5rem",
    display: "block",
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: "rgba(0,0,0,0.7)" }}>
      <div className="relative w-full max-w-lg max-h-[95vh] overflow-hidden" style={cardBase}>
        <div style={cardHighlight} />
        <div className="absolute inset-3 border-2 border-dashed border-yellow-700/40 rounded-[16px] pointer-events-none" />

        <div className="relative z-10">
          <div className="p-6 flex justify-between items-center" style={{ borderBottom: "2px solid #8B4513" }}>
            <h2 className="text-2xl font-bold" style={{ color: "#4A3728", textShadow: "1px 1px 2px rgba(255,255,255,0.5)" }}>
              Record New Payment
            </h2>
            <button
              onClick={onClose}
              className="text-2xl font-bold transition-all duration-150 hover:scale-110"
              style={{ color: "#8B4513", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-auto max-h-[calc(95vh-140px)]">
            {/* Student Selection */}
            <div>
              <label style={labelStyle}>
                Student Name <span style={{ color: "#c53030" }}>*</span>
              </label>
              <input
                type="text"
                placeholder="Search student name, email or mobile..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3"
                style={inputStyle}
              />

              {searchTerm && (
                <div className="mt-2 max-h-60 overflow-auto rounded-2xl relative z-20" style={{
                  background: "linear-gradient(145deg, #F5DEB3, #DEB887, #F5DEB3)",
                  boxShadow: "4px 4px 8px rgba(0,0,0,0.3), -2px -2px 5px rgba(255,255,255,0.2)",
                  border: "1px solid rgba(0,0,0,0.2)",
                }}>
                  {filteredStudents.slice(0, 8).map((student: any) => (
                    <div
                      key={student._id}
                      onClick={() => handleStudentSelect(student)}
                      className="px-4 py-3 cursor-pointer flex justify-between border-b transition-colors hover:bg-white/30"
                      style={{ borderColor: "rgba(139,69,19,0.2)" }}
                    >
                      <div>
                        <p className="font-bold" style={{ color: "#3E2723", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>{student.name}</p>
                        <p className="text-sm font-bold" style={{ color: "#8B4513", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>{student.mobile} • {student.course}</p>
                      </div>
                      {student.status === "pending" && (
                        <span className="text-xs font-bold px-2 py-1 rounded-full self-center" style={{
                          background: "linear-gradient(145deg, #C05621, #ED8936, #C05621)",
                          boxShadow: "inset 1px 1px 3px rgba(255,255,255,0.4), inset -1px -1px 3px rgba(0,0,0,0.2), 2px 2px 4px rgba(0,0,0,0.3)",
                          color: "#fff",
                          textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
                          border: "1px solid rgba(0,0,0,0.2)",
                        }}>
                          Pending
                        </span>
                      )}
                    </div>
                  ))}
                  {filteredStudents.length === 0 && (
                    <p className="p-4 font-bold" style={{ color: "#8B4513", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>No student found</p>
                  )}
                </div>
              )}
            </div>

            {/* Amount */}
            <div>
              <label style={labelStyle}>
                Amount (₹) <span style={{ color: "#c53030" }}>*</span>
              </label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                className="w-full px-4 py-3 text-2xl font-bold"
                style={inputStyle}
                placeholder="Enter amount"
                required
              />
            </div>

            {/* Payment Method */}
            <div>
              <label style={labelStyle}>Payment Method</label>
              <div className="grid grid-cols-2 gap-3">
                {["UPI", "SCANNER", "CASH", "BANK TRANSFER"].map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: method })}
                    className="py-3 px-4 text-sm font-bold transition-all duration-150 relative overflow-hidden"
                    style={formData.paymentMethod === method
                      ? {
                        background: "linear-gradient(145deg, #3182ce, #63b3ed, #3182ce)",
                        boxShadow: "inset 2px 2px 5px rgba(0,0,0,0.3), inset -1px -1px 3px rgba(255,255,255,0.3), 3px 3px 8px rgba(0,0,0,0.3)",
                        border: "1px solid rgba(0,0,0,0.2)",
                        color: "#fff",
                        textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
                        borderRadius: "16px",
                      }
                      : {
                        background: "linear-gradient(145deg, #DEB887, #F5DEB3, #DEB887)",
                        boxShadow: "3px 3px 6px rgba(0,0,0,0.2), -1px -1px 3px rgba(255,255,255,0.2), inset 1px 1px 2px rgba(255,255,255,0.3)",
                        border: "1px solid rgba(0,0,0,0.15)",
                        color: "#6B3410",
                        textShadow: "0 1px 1px rgba(255,255,255,0.5)",
                        borderRadius: "16px",
                      }
                    }
                  >
                    <span style={{
                      position: "absolute", inset: 0, borderRadius: "16px", pointerEvents: "none",
                      background: "linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)",
                    }} />
                    <span className="relative z-10">{method}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Transaction ID */}
            <div>
              <label style={labelStyle}>Transaction ID (Optional)</label>
              <input
                type="text"
                value={formData.transactionId}
                onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                className="w-full px-4 py-3"
                style={inputStyle}
                placeholder="e.g. TXN12345678"
              />
            </div>

            {/* Notes */}
            <div>
              <label style={labelStyle}>Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-4 py-3"
                style={inputStyle}
                placeholder="Any additional notes..."
              />
            </div>

            <div className="pt-4">
              <SkeuoButton
                label="Record Payment"
                onClick={handleSubmit}
                base={btnBase("#22543d", "#276749", "#E2E8F0")}
                hover={btnHover("#276749", "#38a169")}
                active={btnActive("#68d391", "#9ae6b4", "#22543d")}
                fullWidth
                large
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  function SkeuoButton({ label, onClick, base, hover, active, disabled, fullWidth, large }: any) {
    const [isPressed, setIsPressed] = useState(false);
    const sizeClasses = large ? "w-full py-4 text-lg" : fullWidth ? "w-full py-3" : "px-5 py-2.5";

    return (
      <button
        onClick={onClick}
        disabled={disabled}
        onMouseEnter={(e) => { if (!disabled && !isPressed) Object.assign(e.currentTarget.style, hover); }}
        onMouseLeave={(e) => { setIsPressed(false); Object.assign(e.currentTarget.style, base); }}
        onMouseDown={(e) => { if (!disabled) { setIsPressed(true); Object.assign(e.currentTarget.style, active); } }}
        onMouseUp={(e) => { if (!disabled) { setIsPressed(false); Object.assign(e.currentTarget.style, hover); } }}
        className={`font-bold transition-all duration-150 relative overflow-hidden ${sizeClasses}`}
        style={{ ...base, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.6 : 1 }}
      >
        <span style={{
          position: "absolute", inset: 0, borderRadius: "16px", pointerEvents: "none",
          background: "linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.2) 100%)",
        }} />
        <span className="relative z-10">{label}</span>
      </button>
    );
  }
}