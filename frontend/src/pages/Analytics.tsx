import { useEffect, useState } from "react";
import { getPayments } from "../services/paymentService";
import { getCourses } from "../services/courseService";
// Install if not present: npm install recharts
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from "recharts";

export default function Analytics() {
  const [payments, setPayments] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [paymentData, courseData] = await Promise.all([
        getPayments(),
        getCourses()
      ]);
      setPayments(paymentData || []);
      setCourses(courseData || []);
    } catch (err) {
      console.error(err);
    }
  };

  // Revenue Calculations
  const today = new Date().toISOString().split("T")[0];
  const currentMonth = new Date().toISOString().slice(0, 7);
  const currentYear = new Date().getFullYear().toString();

  const dailyRevenue = payments
    .filter(p => p.paymentDate?.split("T")[0] === today)
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);

  const weeklyRevenue = payments
    .filter(p => {
      const date = new Date(p.paymentDate);
      const diffTime = Math.abs(new Date().getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24));
      return diffDays <= 7;
    })
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);

  const monthlyRevenue = payments
    .filter(p => p.paymentDate?.startsWith(currentMonth))
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);

  const yearlyRevenue = payments
    .filter(p => p.paymentDate?.startsWith(currentYear))
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);

  const totalCollected = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);

  const pendingRevenue = payments
    .filter(p => p.status === "pending" || !p.status)
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);

  const collectionRate = totalCollected > 0 
    ? Math.round((totalCollected / (totalCollected + pendingRevenue)) * 100) 
    : 0;

  const avgPerStudent = payments.length > 0 
    ? Math.round(totalCollected / payments.length) 
    : 0;

  // Mock / Sample Data for Charts (Replace with real logic)
  const revenueTrendData = [
    { month: "Jan", revenue: 45000 },
    { month: "Feb", revenue: 52000 },
    { month: "Mar", revenue: 48000 },
    { month: "Apr", revenue: 61000 },
    { month: "May", revenue: 55000 },
    { month: "Jun", revenue: 72000 },
  ];

  const monthlyCollectionData = [
    { month: "Jan", collected: 45000, pending: 8000 },
    { month: "Feb", collected: 52000, pending: 6000 },
    { month: "Mar", collected: 48000, pending: 12000 },
    { month: "Apr", collected: 61000, pending: 4000 },
    { month: "May", collected: 55000, pending: 9000 },
    { month: "Jun", collected: 72000, pending: 3000 },
  ];

  const courseRevenueData = courses.map((course, i) => ({
    name: course.name || `Course ${i+1}`,
    revenue: Math.floor(Math.random() * 80000) + 20000,
  }));

  const pendingByCourseData = [
    { name: "Full Stack", pending: 45000 },
    { name: "Data Science", pending: 28000 },
    { name: "Digital Marketing", pending: 15000 },
    { name: "UI/UX", pending: 12000 },
  ];

  const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444"];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Revenue Analytics</h1>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <p className="text-gray-500">Daily Revenue</p>
          <h2 className="text-4xl font-bold mt-2">₹{dailyRevenue.toLocaleString()}</h2>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <p className="text-gray-500">Weekly Revenue</p>
          <h2 className="text-4xl font-bold mt-2">₹{weeklyRevenue.toLocaleString()}</h2>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <p className="text-gray-500">Monthly Revenue</p>
          <h2 className="text-4xl font-bold mt-2">₹{monthlyRevenue.toLocaleString()}</h2>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <p className="text-gray-500">Yearly Revenue</p>
          <h2 className="text-4xl font-bold mt-2">₹{yearlyRevenue.toLocaleString()}</h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <p className="text-gray-500">Total Collected</p>
          <h2 className="text-4xl font-bold mt-2 text-emerald-600">₹{totalCollected.toLocaleString()}</h2>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <p className="text-gray-500">Pending Revenue</p>
          <h2 className="text-4xl font-bold mt-2 text-orange-600">₹{pendingRevenue.toLocaleString()}</h2>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <p className="text-gray-500">Collection Rate</p>
          <h2 className="text-4xl font-bold mt-2 text-blue-600">{collectionRate}%</h2>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <p className="text-gray-500">Avg per Student</p>
          <h2 className="text-4xl font-bold mt-2">₹{avgPerStudent.toLocaleString()}</h2>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Revenue Trend - Last 6 Months */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <h3 className="font-semibold text-lg mb-4">Revenue Trend (Last 6 Months)</h3>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={revenueTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`₹${value}`, "Revenue"]} />
              <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} dot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Collection */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <h3 className="font-semibold text-lg mb-4">Monthly Collection vs Pending</h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={monthlyCollectionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`₹${value}`, ""]} />
              <Bar dataKey="collected" fill="#10b981" name="Collected" />
              <Bar dataKey="pending" fill="#f59e0b" name="Pending" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Course Revenue */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <h3 className="font-semibold text-lg mb-4">Revenue by Course</h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={courseRevenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`₹${value}`, "Revenue"]} />
              <Bar dataKey="revenue" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pending Revenue by Course */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <h3 className="font-semibold text-lg mb-4">Pending Revenue by Course</h3>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={pendingByCourseData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                dataKey="pending"
                label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
              >
                {pendingByCourseData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`₹${value}`, "Pending"]} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}