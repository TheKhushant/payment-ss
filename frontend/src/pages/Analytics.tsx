import { useEffect, useState } from "react";
import { getPayments } from "../services/paymentService";
import { getCourses } from "../services/courseService";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from "recharts";

export default function Analytics() {
  const [payments, setPayments] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [paymentData, courseData] = await Promise.all([
        getPayments(),
        getCourses()
      ]);
      setPayments(paymentData || []);
      setCourses(courseData || []);
    } catch (err) { console.error(err); }
  };

  const today = new Date().toISOString().split("T")[0];
  const currentMonth = new Date().toISOString().slice(0, 7);
  const currentYear = new Date().getFullYear().toString();

  const dailyRevenue = payments.filter(p => p.paymentDate?.split("T")[0] === today).reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const weeklyRevenue = payments.filter(p => {
    const date = new Date(p.paymentDate);
    const diffTime = Math.abs(new Date().getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24));
    return diffDays <= 7;
  }).reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const monthlyRevenue = payments.filter(p => p.paymentDate?.startsWith(currentMonth)).reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const yearlyRevenue = payments.filter(p => p.paymentDate?.startsWith(currentYear)).reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const totalCollected = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const pendingRevenue = payments.filter(p => p.status === "pending" || !p.status).reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const collectionRate = totalCollected > 0 ? Math.round((totalCollected / (totalCollected + pendingRevenue)) * 100) : 0;
  const avgPerStudent = payments.length > 0 ? Math.round(totalCollected / payments.length) : 0;

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
    name: course.name || `Course ${i + 1}`,
    revenue: Math.floor(Math.random() * 80000) + 20000,
  }));

  const pendingByCourseData = [
    { name: "Full Stack", pending: 45000 },
    { name: "Data Science", pending: 28000 },
    { name: "Digital Marketing", pending: 15000 },
    { name: "UI/UX", pending: 12000 },
  ];

  const COLORS = ["#2F855A", "#3182ce", "#C05621", "#C53030"];

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

  const metricCard = (gradient: string[]) => ({
    background: `linear-gradient(145deg, ${gradient[0]}, ${gradient[1]}, ${gradient[0]})`,
    boxShadow: "inset 2px 2px 5px rgba(255,255,255,0.4), inset -2px -2px 5px rgba(0,0,0,0.3), 4px 4px 8px rgba(0,0,0,0.3)",
    border: "1px solid rgba(0,0,0,0.2)",
    borderRadius: "16px",
  });

  const metricHighlight = {
    position: "absolute" as const, inset: 0, borderRadius: "16px", pointerEvents: "none" as const,
    background: "linear-gradient(180deg, rgba(255,255,255,0.25) 0%, transparent 50%, rgba(0,0,0,0.2) 100%)",
  };

  return (
    <div className="min-h-screen p-6 relative overflow-hidden" style={{ background: leatherBg, boxShadow: leatherShadow }}>
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: noisePattern, backgroundSize: "3px 3px" }} />
      <div className="absolute inset-3 border-2 border-dashed border-yellow-700/40 rounded-xl pointer-events-none" />

      <div className="relative z-10">
        <div className="p-4 rounded-lg mb-8 inline-block" style={{
          background: "linear-gradient(145deg, #B8860B, #DAA520, #B8860B)",
          boxShadow: "inset 2px 2px 5px rgba(255,255,255,0.4), inset -2px -2px 5px rgba(0,0,0,0.3), 3px 3px 8px rgba(0,0,0,0.4)",
          border: "1px solid #8B6914",
        }}>
          <h1 className="text-3xl font-bold" style={{ color: "#4A3728", textShadow: "1px 1px 2px rgba(255,255,255,0.6), -1px -1px 1px rgba(0,0,0,0.3)" }}>
            Revenue Analytics
          </h1>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <MetricCard label="Daily Revenue" value={`₹${dailyRevenue.toLocaleString()}`} gradient={["#4A5568", "#718096"]} />
          <MetricCard label="Weekly Revenue" value={`₹${weeklyRevenue.toLocaleString()}`} gradient={["#2D3748", "#4A5568"]} />
          <MetricCard label="Monthly Revenue" value={`₹${monthlyRevenue.toLocaleString()}`} gradient={["#3182ce", "#63b3ed"]} />
          <MetricCard label="Yearly Revenue" value={`₹${yearlyRevenue.toLocaleString()}`} gradient={["#2b6cb0", "#4299e1"]} />
          <MetricCard label="Total Collected" value={`₹${totalCollected.toLocaleString()}`} gradient={["#22543d", "#276749"]} />
          <MetricCard label="Pending Revenue" value={`₹${pendingRevenue.toLocaleString()}`} gradient={["#C05621", "#ED8936"]} />
          <MetricCard label="Collection Rate" value={`${collectionRate}%`} gradient={["#2b6cb0", "#4299e1"]} />
          <MetricCard label="Avg per Student" value={`₹${avgPerStudent.toLocaleString()}`} gradient={["#6B3410", "#8B4513"]} />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <ChartCard title="Revenue Trend (Last 6 Months)">
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={revenueTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#8B4513" strokeOpacity={0.3} />
                <XAxis dataKey="month" stroke="#6B3410" fontWeight="bold" />
                <YAxis stroke="#6B3410" fontWeight="bold" />
                <Tooltip
                  formatter={(value) => [`₹${value}`, "Revenue"]}
                  contentStyle={{
                    background: "linear-gradient(145deg, #F5DEB3, #DEB887, #F5DEB3)",
                    border: "1px solid rgba(0,0,0,0.2)",
                    borderRadius: "12px",
                    boxShadow: "4px 4px 8px rgba(0,0,0,0.3)",
                  }}
                />
                <Line type="monotone" dataKey="revenue" stroke="#2F855A" strokeWidth={3} dot={{ r: 6, fill: "#2F855A", stroke: "#fff", strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Monthly Collection vs Pending">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={monthlyCollectionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#8B4513" strokeOpacity={0.3} />
                <XAxis dataKey="month" stroke="#6B3410" fontWeight="bold" />
                <YAxis stroke="#6B3410" fontWeight="bold" />
                <Tooltip
                  formatter={(value) => [`₹${value}`, ""]}
                  contentStyle={{
                    background: "linear-gradient(145deg, #F5DEB3, #DEB887, #F5DEB3)",
                    border: "1px solid rgba(0,0,0,0.2)",
                    borderRadius: "12px",
                    boxShadow: "4px 4px 8px rgba(0,0,0,0.3)",
                  }}
                />
                <Bar dataKey="collected" fill="#2F855A" radius={[8, 8, 0, 0]} />
                <Bar dataKey="pending" fill="#C05621" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Revenue by Course">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={courseRevenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#8B4513" strokeOpacity={0.3} />
                <XAxis dataKey="name" stroke="#6B3410" fontWeight="bold" />
                <YAxis stroke="#6B3410" fontWeight="bold" />
                <Tooltip
                  formatter={(value) => [`₹${value}`, "Revenue"]}
                  contentStyle={{
                    background: "linear-gradient(145deg, #F5DEB3, #DEB887, #F5DEB3)",
                    border: "1px solid rgba(0,0,0,0.2)",
                    borderRadius: "12px",
                    boxShadow: "4px 4px 8px rgba(0,0,0,0.3)",
                  }}
                />
                <Bar dataKey="revenue" fill="#3182ce" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Pending Revenue by Course">
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
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#F5DEB3" strokeWidth={3} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`₹${value}`, "Pending"]}
                  contentStyle={{
                    background: "linear-gradient(145deg, #F5DEB3, #DEB887, #F5DEB3)",
                    border: "1px solid rgba(0,0,0,0.2)",
                    borderRadius: "12px",
                    boxShadow: "4px 4px 8px rgba(0,0,0,0.3)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>
    </div>
  );

  function MetricCard({ label, value, gradient }: { label: string; value: string; gradient: string[] }) {
    return (
      <div className="p-6 relative overflow-hidden" style={metricCard(gradient)}>
        <div style={metricHighlight} />
        <p className="text-xs font-bold uppercase relative z-10" style={{ color: "rgba(255,255,255,0.9)", textShadow: "1px 1px 2px rgba(0,0,0,0.5)", letterSpacing: "0.1em" }}>
          {label}
        </p>
        <h2 className="text-4xl font-bold mt-2 relative z-10" style={{ color: "#fff", textShadow: "2px 2px 4px rgba(0,0,0,0.5), 0 1px 1px rgba(255,255,255,0.3)" }}>
          {value}
        </h2>
      </div>
    );
  }

  function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
    return (
      <div className="p-6 relative" style={cardBase}>
        <div style={cardHighlight} />
        <h3 className="font-bold text-lg mb-4 relative z-10" style={{ color: "#4A3728", textShadow: "1px 1px 2px rgba(255,255,255,0.5)", borderBottom: "2px solid #8B4513", paddingBottom: "12px" }}>
          {title}
        </h3>
        <div className="relative z-10">{children}</div>
      </div>
    );
  }
}