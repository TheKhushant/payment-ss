import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  createPayment,
  getStudentPayments,
} from "../services/paymentService";


import { getStudent } from "../services/studentService";

export default function AddPayment() {
  const { studentId } = useParams();

  const [student, setStudent] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("Cash");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);

      const studentData = await getStudent(studentId!);
      const paymentData = await getStudentPayments(studentId!);

      setStudent(studentData);
      setPayments(paymentData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setIsLoading(false); // ✅ Add this
    }
  };

  const handleSubmit = async () => {
    if (!amount || Number(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    try {
      await createPayment({
        studentId,
        amount: Number(amount),
        method,
        transactionId: `TXN-${Date.now()}`,
      });

      alert("Payment Added Successfully");
      await loadData();
      setAmount("");
    } catch (err) {
      console.error(err);
      alert("Failed to add payment");
    }
  };

  const lastPayment = payments.length > 0 ? payments[0] : null;

  const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const totalFee = student?.courseFee || student?.courseId?.fee || 0;
  const pendingAmount = totalFee - totalPaid;

  const upcomingInstallment = student?.installments?.find(
    (i: any) => i.status !== "paid"
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg font-medium text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add Payment</h1>
            <p className="text-sm text-gray-600">Student Fee Management</p>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">Student ID</div>
            <div className="font-mono text-sm font-medium">{studentId}</div>
          </div>
        </div>

        {student && (
          <div className="bg-white shadow-xl rounded-2xl p-6 mb-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-5">Student Details</h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-4 text-sm">
              <div><span className="text-gray-500">Name:</span> <span className="font-medium">{student.name}</span></div>
              <div><span className="text-gray-500">Mobile:</span> <span className="font-medium">{student.mobile}</span></div>
              <div><span className="text-gray-500">Email:</span> <span className="font-medium">{student.email}</span></div>
              <div><span className="text-gray-500">College:</span> <span className="font-medium">{student.college}</span></div>
              <div><span className="text-gray-500">Course:</span> <span className="font-medium">{student.courseId?.name}</span></div>
              <div>
                <span className="text-gray-500">Status:</span>{" "}
                <span className={`inline-flex px-3 py-0.5 rounded-full text-xs font-medium ${
                  student.status === "active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                }`}>
                  {student.status}
                </span>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <div className="text-xs text-blue-600 font-medium">TOTAL FEE</div>
                <div className="text-2xl font-bold text-gray-900 mt-1">₹{totalFee.toLocaleString()}</div>
              </div>
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                <div className="text-xs text-emerald-600 font-medium">TOTAL PAID</div>
                <div className="text-2xl font-bold text-gray-900 mt-1">₹{totalPaid.toLocaleString()}</div>
              </div>
              <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                <div className="text-xs text-red-600 font-medium">PENDING</div>
                <div className="text-2xl font-bold text-gray-900 mt-1">₹{pendingAmount.toLocaleString()}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6 text-sm">
              {lastPayment && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-medium mb-3 text-gray-800">Last Payment</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between"><span className="text-gray-500">Amount</span> <span>₹{lastPayment.amount}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Method</span> <span>{lastPayment.method}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Date</span> 
                      <span>{new Date(lastPayment.date).toLocaleDateString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              )}

              {upcomingInstallment && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-medium mb-3 text-gray-800">Upcoming Installment</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between"><span className="text-gray-500">Amount</span> <span>₹{upcomingInstallment.amount}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Status</span> 
                      <span className="text-amber-600 font-medium">{upcomingInstallment.status}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Payment History */}
        {payments.length > 0 && (
          <div className="bg-white shadow-xl rounded-2xl p-6 mb-6 border border-gray-100">
            <h3 className="text-xl font-semibold mb-4">Payment History</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-gray-600">
                    <th className="py-3 text-left font-medium">Date</th>
                    <th className="py-3 text-left font-medium">Amount</th>
                    <th className="py-3 text-left font-medium">Method</th>
                    <th className="py-3 text-left font-medium">Transaction ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {payments.map((payment: any) => (
                    <tr key={payment._id} className="hover:bg-gray-50">
                      <td className="py-3">
                        {new Date(payment.date).toLocaleDateString('en-IN')}
                      </td>
                      <td className="py-3 font-semibold text-emerald-700">₹{Number(payment.amount).toLocaleString()}</td>
                      <td className="py-3">{payment.method}</td>
                      <td className="py-3 font-mono text-gray-500 text-xs">{payment.transactionId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add Payment Form */}
        <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-100">
          <h3 className="text-xl font-semibold mb-6">Record New Payment</h3>

          <div className="max-w-md space-y-5">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">PAYMENT AMOUNT (₹)</label>
              <input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full border border-gray-300 focus:border-blue-500 rounded-xl px-4 py-3 text-lg font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">PAYMENT METHOD</label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full border border-gray-300 focus:border-blue-500 rounded-xl px-4 py-3 text-base"
              >
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`
                flex items-center justify-center gap-2
                px-4 py-2 rounded text-white
                ${isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"}
              `}
            >
              {isLoading && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}

              {isLoading ? "Saving..." : "Save Payment"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}