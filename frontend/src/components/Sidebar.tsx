import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 bg-white border-r h-screen p-4">
      <h1 className="text-xl font-bold mb-6">
        Student Fee Portal
      </h1>

      <nav className="flex flex-col gap-3">
        <Link to="/">Dashboard</Link>
        <Link to="/students">Students</Link>
        <Link to="/payments">Payments</Link>
        <Link to="/courses">Courses</Link>
        <Link to="/tracking">Track Payment</Link>
        <Link to="/analytics">Analytics</Link>
      </nav>
    </div>
  );
}