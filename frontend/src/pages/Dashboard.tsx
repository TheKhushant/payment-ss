import { useEffect, useState } from "react";
import { getStudents } from "../services/studentService";
import { getPayments } from "../services/paymentService";
import { getCourses } from "../services/courseService";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [students, setStudents] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [studentData, paymentData, courseData] = await Promise.all([
        getStudents(),
        getPayments(),
        getCourses(),
      ]);
      setStudents(studentData || []);
      setPayments(paymentData || []);
      setCourses(courseData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Calculations
  const totalStudents = students.length;
  const activeStudents = students.filter((s: any) => s.status === "active" || !s.status).length; // adjust filter as per your data

  const totalRevenue = payments.reduce(
    (sum: number, payment: any) => sum + Number(payment.amount || 0),
    0
  );

  const today = new Date().toISOString().split("T")[0];
  const todaysCollections = payments
    .filter((p: any) => p.paymentDate?.split("T")[0] === today)
    .reduce((sum: number, p: any) => sum + Number(p.amount || 0), 0);

  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const monthlyCollection = payments
    .filter((p: any) => p.paymentDate?.startsWith(currentMonth))
    .reduce((sum: number, p: any) => sum + Number(p.amount || 0), 0);

  const pendingAmount = payments
    .filter((p: any) => p.status === "pending" || !p.status)
    .reduce((sum: number, p: any) => sum + Number(p.amount || 0), 0);

  const upcomingPayments = payments.filter((p: any) => {
    if (!p.dueDate) return false;
    const due = new Date(p.dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24));
    return diffDays > 0 && diffDays <= 7;
  });

  const overduePayments = payments.filter((p: any) => {
    if (!p.dueDate || p.status === "paid") return false;
    return new Date(p.dueDate) < new Date();
  });

  const todaysPendingPayments = payments.filter((p: any) => {
    if (!p.dueDate) return false;
    return p.dueDate.split("T")[0] === today && (p.status === "pending" || !p.status);
  });

  const recentPayments = [...payments]
    .sort((a: any, b: any) => new Date(b.paymentDate || b.createdAt).getTime() - new Date(a.paymentDate || a.createdAt).getTime())
    .slice(0, 10);

  const navigate = useNavigate();

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        
        <div className="flex gap-3">
          <button 
            onClick={() => navigate("/tracking")}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition"
          >
            Tracking
          </button>
          <button 
            onClick={() => navigate("/courses")}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition"
          >
            Courses
          </button>
          <button 
            onClick={() => navigate("/addpayment")}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
          >
            Add Payments
          </button>
          <button
            onClick={() => navigate("/create-student")}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center gap-1 transition"
          >
            + New Student
          </button>
        </div>
      </div>

      {/* Metrics Grid - 4 columns, 2 rows */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        {/* Row 1 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm">Total Students</p>
          <h2 className="text-4xl font-bold mt-2">{totalStudents}</h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm">Active Students</p>
          <h2 className="text-4xl font-bold mt-2 text-green-600">{activeStudents}</h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm">Total Revenue</p>
          <h2 className="text-4xl font-bold mt-2">₹{totalRevenue.toLocaleString()}</h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm">Today's Collections</p>
          <h2 className="text-4xl font-bold mt-2 text-emerald-600">₹{todaysCollections.toLocaleString()}</h2>
        </div>

        {/* Row 2 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm">Monthly Collection</p>
          <h2 className="text-4xl font-bold mt-2">₹{monthlyCollection.toLocaleString()}</h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm">Pending Amount</p>
          <h2 className="text-4xl font-bold mt-2 text-orange-600">₹{pendingAmount.toLocaleString()}</h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm">Upcoming Payments</p>
          <h2 className="text-4xl font-bold mt-2">{upcomingPayments.length}</h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm">Overdue Payments</p>
          <h2 className="text-4xl font-bold mt-2 text-red-600">{overduePayments.length}</h2>
        </div>
      </div>

      {/* Lists Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Pending Payments */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-lg mb-4">Today's Pending Payments</h3>
          {todaysPendingPayments.length === 0 ? (
            <p className="text-gray-500 py-8 text-center">No pending payments today</p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-auto">
              {todaysPendingPayments.map((payment: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium">{payment.studentName || "Student"}</p>
                    <p className="text-sm text-gray-500">Due today</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-orange-600">₹{payment.amount}</p>
                    <p className="text-xs text-gray-500">{payment.courseName}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Payments (Next 7 Days) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-lg mb-4">Upcoming Payments (Next 7 Days)</h3>
          {upcomingPayments.length === 0 ? (
            <p className="text-gray-500 py-8 text-center">No upcoming payments</p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-auto">
              {upcomingPayments.map((payment: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium">{payment.studentName || "Student"}</p>
                    <p className="text-sm text-gray-500">
                      Due: {new Date(payment.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{payment.amount}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Payments */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-lg mb-4">Recent Payments</h3>
          {recentPayments.length === 0 ? (
            <p className="text-gray-500 py-8 text-center">No recent payments</p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-auto">
              {recentPayments.map((payment: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium">{payment.studentName || "Student"}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(payment.paymentDate || payment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">₹{payment.amount}</p>
                    <p className="text-xs text-gray-500 capitalize">{payment.status || "Paid"}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}