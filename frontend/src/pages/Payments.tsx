import { useEffect, useState } from "react";
import { getPayments } from "../services/paymentService";

export default function Payments() {
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
      setPayments(data || []);
      setFilteredPayments(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Apply Filters
  useEffect(() => {
    let result = [...payments];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter((payment) =>
        payment.studentName?.toLowerCase().includes(term) ||
        payment.transactionId?.toLowerCase().includes(term) ||
        payment.course?.toLowerCase().includes(term) ||
        payment.studentEmail?.toLowerCase().includes(term)
      );
    }

    // Course filter
    if (selectedCourse !== "All") {
      result = result.filter((p) => p.course === selectedCourse);
    }

    // Duration filter
    if (selectedDuration !== "All") {
      result = result.filter((p) => p.duration === selectedDuration);
    }

    // Payment Method filter
    if (selectedMethod !== "All") {
      result = result.filter((p) => p.paymentMethod === selectedMethod);
    }

    // Status filter
    if (selectedStatus !== "All") {
      result = result.filter((p) => p.status === selectedStatus);
    }

    setFilteredPayments(result);
  }, [searchTerm, selectedCourse, selectedDuration, selectedMethod, selectedStatus, payments]);

  // Get unique values for filters
  const courses = ["All", ...new Set(payments.map((p) => p.course).filter(Boolean))];

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
        `"${p.studentName || ""}"`,
        p.amount,
        p.paymentDate ? new Date(p.paymentDate).toLocaleDateString() : "",
        p.paymentMethod,
        `"${p.course || ""}"`,
        p.duration,
        p.status,
        `"${p.transactionId || ""}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `payments_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Payments</h1>
        
        <div className="flex gap-3">
          <button
            onClick={exportToCSV}
            className="px-5 py-2.5 bg-gray-700 hover:bg-gray-800 text-white rounded-xl font-medium flex items-center gap-2 transition"
          >
            📥 Export CSV
          </button>
          <button
            onClick={() => alert("Open Add Payment Modal / Form")}
            className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium flex items-center gap-2 transition"
          >
            + Add Payment
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-wrap gap-4 items-end">
        {/* Search */}
        <div className="flex-1 min-w-[300px]">
          <label className="block text-sm font-medium text-gray-600 mb-1">Search</label>
          <input
            type="text"
            placeholder="Search by student name, transaction ID, course..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Course Filter */}
        <div className="min-w-[180px]">
          <label className="block text-sm font-medium text-gray-600 mb-1">Course</label>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500"
          >
            {courses.map((course, i) => (
              <option key={i} value={course}>{course}</option>
            ))}
          </select>
        </div>

        {/* Duration Filter */}
        <div className="min-w-[160px]">
          <label className="block text-sm font-medium text-gray-600 mb-1">Duration</label>
          <select
            value={selectedDuration}
            onChange={(e) => setSelectedDuration(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500"
          >
            <option value="All">Any Duration</option>
            <option value="1">1 Month</option>
            <option value="2">2 Months</option>
            <option value="3">3 Months</option>
            <option value="6">6 Months</option>
          </select>
        </div>

        {/* Payment Method */}
        <div className="min-w-[160px]">
          <label className="block text-sm font-medium text-gray-600 mb-1">Payment Method</label>
          <select
            value={selectedMethod}
            onChange={(e) => setSelectedMethod(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Methods</option>
            <option value="cash">Cash</option>
            <option value="upi">UPI</option>
            <option value="bank">Bank Transfer</option>
          </select>
        </div>

        {/* Status */}
        <div className="min-w-[160px]">
          <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        <button
          onClick={() => {
            setSearchTerm("");
            setSelectedCourse("All");
            setSelectedDuration("All");
            setSelectedMethod("All");
            setSelectedStatus("All");
          }}
          className="px-5 py-3 text-gray-600 hover:bg-gray-100 rounded-xl border border-gray-300 transition"
        >
          Reset Filters
        </button>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="p-4 text-left font-medium text-gray-600">Student Name</th>
                <th className="p-4 text-left font-medium text-gray-600">Amount</th>
                <th className="p-4 text-left font-medium text-gray-600">Payment Date</th>
                <th className="p-4 text-left font-medium text-gray-600">Method</th>
                <th className="p-4 text-left font-medium text-gray-600">Course</th>
                <th className="p-4 text-left font-medium text-gray-600">Duration</th>
                <th className="p-4 text-left font-medium text-gray-600">Status</th>
                <th className="p-4 text-left font-medium text-gray-600">Transaction ID</th>
                <th className="p-4 text-center font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="p-12 text-center text-gray-500">Loading payments...</td>
                </tr>
              ) : filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-12 text-center text-gray-500">No payments found</td>
                </tr>
              ) : (
                filteredPayments.map((payment: any, idx: number) => (
                  <tr key={payment._id || idx} className="border-b hover:bg-gray-50 transition">
                    <td className="p-4 font-medium">{payment.studentName || "—"}</td>
                    <td className="p-4 font-semibold text-green-600">₹{Number(payment.amount).toLocaleString()}</td>
                    <td className="p-4 text-gray-600">
                      {payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : "—"}
                    </td>
                    <td className="p-4 capitalize font-medium">{payment.paymentMethod || "—"}</td>
                    <td className="p-4 text-gray-600">{payment.course || "—"}</td>
                    <td className="p-4 text-gray-600">{payment.duration ? `${payment.duration} Month` : "—"}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          payment.status === "paid"
                            ? "bg-green-100 text-green-700"
                            : payment.status === "pending"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {payment.status ? payment.status.toUpperCase() : "PAID"}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500 font-mono text-sm">{payment.transactionId || "—"}</td>
                    <td className="p-4 text-center">
                      <button className="text-blue-600 hover:text-blue-700 font-medium">View</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}