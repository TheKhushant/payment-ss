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
        paymentMethod: "UPI", // Default or last used
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
    } catch (err) {
      console.error(err);
    }
  };

  // Search & Filter Students (with priority to pending/overdue)
  useEffect(() => {
    if (!searchTerm) {
      setFilteredStudents(students);
      return;
    }
    const term = searchTerm.toLowerCase();
    const result = students.filter(student =>
      student.name?.toLowerCase().includes(term) ||
      student.email?.toLowerCase().includes(term) ||
      student.mobile?.includes(term)
    );
    setFilteredStudents(result);
  }, [searchTerm, students]);

  const handleStudentSelect = (student: any) => {
    setFormData({
      ...formData,
      studentId: student._id,
      studentName: student.name,
    });
    setSearchTerm(student.name);
    
    // Auto-fill amount from pending dues if available
    const pendingForStudent = payments.find(
      p => p.studentId === student._id && (p.status === "pending" || !p.status)
    );
    if (pendingForStudent) {
      setFormData(prev => ({ ...prev, amount: Number(pendingForStudent.amount) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentId || formData.amount <= 0) {
      alert("Please select a student and enter amount");
      return;
    }

    try {
      // Call your payment service here
      // await recordPayment(formData);
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[95vh] overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold">Record New Payment</h2>
          <button onClick={onClose} className="text-2xl text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-auto max-h-[calc(95vh-140px)]">
          {/* Student Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Student Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Search student name, email or mobile..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:border-blue-500"
            />

            {searchTerm && (
              <div className="mt-2 max-h-60 overflow-auto border border-gray-200 rounded-2xl bg-white shadow-sm">
                {filteredStudents.slice(0, 8).map((student: any) => (
                  <div
                    key={student._id}
                    onClick={() => handleStudentSelect(student)}
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex justify-between border-b last:border-none"
                  >
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-gray-500">{student.mobile} • {student.course}</p>
                    </div>
                    {student.status === "pending" && (
                      <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full self-center">Pending</span>
                    )}
                  </div>
                ))}
                {filteredStudents.length === 0 && (
                  <p className="p-4 text-gray-500">No student found</p>
                )}
              </div>
            )}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount (₹) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:border-blue-500 text-2xl font-semibold"
              placeholder="Enter amount"
              required
            />
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
            <div className="grid grid-cols-2 gap-3">
              {["UPI", "SCANNER", "CASH", "BANK TRANSFER"].map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: method })}
                  className={`py-3 px-4 rounded-2xl border text-sm font-medium transition-all ${
                    formData.paymentMethod === method
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          {/* Transaction ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Transaction ID (Optional)</label>
            <input
              type="text"
              value={formData.transactionId}
              onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:border-blue-500"
              placeholder="e.g. TXN12345678"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:border-blue-500"
              placeholder="Any additional notes..."
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-semibold text-lg transition"
            >
              Record Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}