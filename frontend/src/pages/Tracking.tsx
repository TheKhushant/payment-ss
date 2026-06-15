import { useEffect, useState } from "react";
import { getPayments } from "../services/paymentService";
// You can also import getStudents if needed for full student details

export default function Tracking() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [showStudentModal, setShowStudentModal] = useState(false);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const data = await getPayments();
      setPayments(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Upcoming Payments (Next 7 days)
  const upcomingPayments = payments.filter((p: any) => {
    if (!p.dueDate || p.status === "paid") return false;
    const due = new Date(p.dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24));
    return diffDays > 0 && diffDays <= 7;
  });

  const upcomingTotal = upcomingPayments.reduce(
    (sum: number, p: any) => sum + Number(p.amount || 0),
    0
  );

  // Overdue Payments
  const overduePayments = payments.filter((p: any) => {
    if (!p.dueDate || p.status === "paid") return false;
    return new Date(p.dueDate) < new Date();
  });

  const openStudentInfo = (payment: any) => {
    setSelectedPayment(payment);
    setShowStudentModal(true);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Payment Tracking</h1>
        <button
          onClick={loadPayments}
          className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg"
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Payments */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-emerald-700">Upcoming Payments</h2>
              <p className="text-sm text-gray-500">Next 7 Days</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Due</p>
              <p className="text-3xl font-bold text-emerald-600">₹{upcomingTotal.toLocaleString()}</p>
            </div>
          </div>

          <div className="space-y-4 max-h-[calc(100vh-280px)] overflow-auto pr-2">
            {loading ? (
              <p className="text-center py-10 text-gray-500">Loading...</p>
            ) : upcomingPayments.length === 0 ? (
              <p className="text-center py-10 text-gray-500">No upcoming payments in next 7 days</p>
            ) : (
              upcomingPayments.map((payment: any, idx: number) => (
                <div
                  key={payment._id || idx}
                  className="flex justify-between items-center bg-gray-50 p-5 rounded-xl hover:bg-gray-100 transition"
                >
                  <div className="flex-1">
                    <p className="font-semibold">{payment.studentName || "Student"}</p>
                    <p className="text-sm text-gray-500">
                      Due: {new Date(payment.dueDate).toLocaleDateString()} 
                      • {payment.course}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-emerald-600">₹{Number(payment.amount).toLocaleString()}</p>
                    <button
                      onClick={() => openStudentInfo(payment)}
                      className="text-blue-600 hover:text-blue-700 text-sm mt-1"
                    >
                      View Student →
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Overdue Payments */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-red-700">Overdue Payments</h2>
            <p className="text-sm text-gray-500">Immediate Attention Required</p>
          </div>

          <div className="space-y-4 max-h-[calc(100vh-280px)] overflow-auto pr-2">
            {loading ? (
              <p className="text-center py-10 text-gray-500">Loading...</p>
            ) : overduePayments.length === 0 ? (
              <p className="text-center py-10 text-gray-500">No overdue payments 🎉</p>
            ) : (
              overduePayments.map((payment: any, idx: number) => (
                <div
                  key={payment._id || idx}
                  className="flex justify-between items-center bg-red-50 p-5 rounded-xl hover:bg-red-100 transition border border-red-100"
                >
                  <div className="flex-1">
                    <p className="font-semibold">{payment.studentName || "Student"}</p>
                    <p className="text-sm text-red-600">
                      Due: {new Date(payment.dueDate).toLocaleDateString()} 
                      • {payment.course}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-red-600">₹{Number(payment.amount).toLocaleString()}</p>
                    <button
                      onClick={() => openStudentInfo(payment)}
                      className="text-blue-600 hover:text-blue-700 text-sm mt-1"
                    >
                      View Student →
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Student Information Modal */}
      {showStudentModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b">
              <h3 className="text-2xl font-bold">Student Information</h3>
              <p className="text-gray-500">{selectedPayment.studentName}</p>
            </div>

            <div className="p-6 space-y-6 overflow-auto max-h-[65vh]">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">EMAIL</p>
                  <p className="font-medium">{selectedPayment.studentEmail || "Not available"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">MOBILE</p>
                  <p className="font-medium">{selectedPayment.studentMobile || "Not available"}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500">COURSE</p>
                <p className="font-medium">{selectedPayment.course}</p>
              </div>

              {selectedPayment.college && (
                <div>
                  <p className="text-xs text-gray-500">COLLEGE</p>
                  <p className="font-medium">{selectedPayment.college}</p>
                </div>
              )}

              <div className="pt-4 border-t">
                <p className="text-xs text-gray-500 mb-2">PAYMENT DETAILS</p>
                <div className="bg-gray-50 p-4 rounded-2xl">
                  <div className="flex justify-between mb-2">
                    <span>Amount Due</span>
                    <span className="font-bold">₹{Number(selectedPayment.amount).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Due Date</span>
                    <span>{new Date(selectedPayment.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t flex gap-3">
              <button
                onClick={() => setShowStudentModal(false)}
                className="flex-1 py-3 border border-gray-300 rounded-2xl font-medium hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => alert("Navigate to full student profile / edit page")}
                className="flex-1 py-3 bg-blue-600 text-white rounded-2xl font-medium hover:bg-blue-700"
              >
                Full Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}