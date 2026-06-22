import { deleteAllStudents, getStudents } from "../services/studentService";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {IndianRupee} from "lucide-react"

export default function Students() {
  const navigate = useNavigate();

  const [students, setStudents] = useState<any[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("All");
  const [selectedDuration, setSelectedDuration] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const data = await getStudents();
console.log("Students Data:", data);

      const sortedData = [...(data || [])].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      );

      setStudents(sortedData);
      setFilteredStudents(sortedData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Apply Filters
  useEffect(() => {
    let result = [...students];

    // Search filter (name, email, mobile, college)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter((student) =>
        student.name?.toLowerCase().includes(term) ||
        student.email?.toLowerCase().includes(term) ||
        student.mobile?.includes(term) ||
        student.college?.toLowerCase().includes(term) ||
        student.courseId?.name?.toLowerCase().includes(term)
      );
    }

    // Course filter
    if (selectedCourse !== "All") {
      result = result.filter((student) => student.courseId?.name === selectedCourse);
    }

    // Duration filter
    if (selectedDuration !== "All") {
      result = result.filter((student) => String(student.duration) === selectedDuration);
    }

    // Status filter
    if (selectedStatus !== "All") {
      result = result.filter((student) => student.status === selectedStatus);
    }

    setFilteredStudents(result);
  }, [searchTerm, selectedCourse, selectedDuration, selectedStatus, students]);

  // Get unique courses for dropdown
  const courses = ["All", ...new Set(students.map((s) => s.courseId?.name).filter(Boolean))];

  const handleDeleteAll = async () => {
    const confirmed = window.confirm(
      "⚠️ Are you sure?\n\nThis will permanently delete ALL students."
    );

    if (!confirmed) return;

    try {
      await deleteAllStudents();

      alert("All students deleted successfully.");

      setStudents([]);
      setFilteredStudents([]);
    } catch (error) {
      console.error(error);
      alert("Failed to delete students.");
    }
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
              Students
            </h1>
          </div>

          <div className="flex gap-3">
            <SkeuoButton
              label="+ Add Student"
              onClick={() => navigate("/create-student")}
              base={btnBase("#22543d", "#276749", "#E2E8F0")}
              hover={btnHover("#276749", "#38a169")}
              active={btnActive("#68d391", "#9ae6b4", "#22543d")}
            />

            <SkeuoButton
              label="Delete All Students"
              onClick={handleDeleteAll}
              disabled={true}
              base={btnBase("#c53030", "#e53e3e", "#fff")}
              hover={btnHover("#e53e3e", "#fc8181")}
              active={btnActive("#fc8181", "#feb2b2", "#c53030")}
            />
          </div>
        </div>

        {/* Filters Bar */}
        <div className="p-5 mb-6 flex flex-wrap gap-4 items-end relative" style={cardBase}>
          <div style={cardHighlight} />
          <div className="flex-1 min-w-[280px] relative z-10">
            <label style={labelStyle}>Search</label>
            <input
              type="text"
              placeholder="Search by name, email, mobile, college, course..."
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
            <label style={labelStyle}>Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-3"
              style={inputStyle}
            >
              <option value="All" style={{ background: "#F5DEB3" }}>All Status</option>
              <option value="active" style={{ background: "#F5DEB3" }}>Active</option>
              <option value="inactive" style={{ background: "#F5DEB3" }}>Inactive</option>
              <option value="completed" style={{ background: "#F5DEB3" }}>Completed</option>
            </select>
          </div>

          <SkeuoButton
            label="Reset Filters"
            onClick={() => {
              setSearchTerm("");
              setSelectedCourse("All");
              setSelectedDuration("All");
              setSelectedStatus("All");
            }}
            base={btnBase("#6B3410", "#8B4513", "#D2B48C")}
            hover={btnHover("#7B3F00", "#A0522D")}
            active={btnActive("#CD853F", "#DEB887", "#3E2723")}
          />
        </div>

        {/* Students Table */}
        <div className="relative overflow-hidden" style={cardBase}>
          <div style={cardHighlight} />
          <div className="overflow-x-auto relative z-10">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "2px solid #8B4513" }}>
                  <th className="p-4 text-left font-bold" style={{ color: "#6B3410", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>Name</th>
                  {/* <th className="p-4 text-left font-bold" style={{ color: "#6B3410", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>Email</th> */}
                  <th className="p-4 text-left font-bold" style={{ color: "#6B3410", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>Mobile</th>
                  {/* <th className="p-4 text-left font-bold" style={{ color: "#6B3410", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>College</th> */}
                  <th className="p-4 text-left font-bold" style={{ color: "#6B3410", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>Course</th>
                  <th
                    className="p-4 text-left font-bold"
                    style={{
                      color: "#6B3410",
                      textShadow: "0 1px 1px rgba(255,255,255,0.5)",
                    }}
                  >
                    Incentive
                  </th>
                  {/* <th className="p-4 text-left font-bold" style={{ color: "#6B3410", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>Duration</th> */}
                  <th className="p-4 text-left font-bold" style={{ color: "#6B3410", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>Status</th>
                  <th className="p-4 text-center font-bold" style={{ color: "#6B3410", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center font-bold" style={{ color: "#8B4513", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>
                      Loading students...
                    </td>
                  </tr>
                ) : filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center font-bold" style={{ color: "#8B4513", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>
                      No students found
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student: any) => (
                    <tr key={student._id} className="border-b transition-colors hover:bg-white/20" style={{ borderColor: "rgba(139,69,19,0.2)" }}>
                      <td className="p-4 font-bold" style={{ color: "#3E2723", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>{student.name}</td>
                      {/* <td className="p-4 font-bold" style={{ color: "#6B3410", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>{student.email}</td> */}
                      <td className="p-4 font-bold" style={{ color: "#6B3410", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>{student.mobile}</td>
                      {/* <td className="p-4 font-bold" style={{ color: "#6B3410", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>{student.college || "-"}</td> */}
                      <td className="p-4 font-bold" style={{ color: "#6B3410", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>{student.courseId?.name || "-"}</td>
                      {/* <td className="p-4 font-bold" style={{ color: "#6B3410", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>{student.incentiveTo || "X"}</td> */}
                      <td className="p-4">
                        {student.incentiveAmount > 0 ? (
                          <div className="flex flex-col">
                            <span className="font-semibold">
                              {student.incentiveTo || "Not Assigned"}
                            </span>

                            <span
                              className={`text-xs ${
                                student.incentivePaid
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              ₹{student.incentiveAmount} • {student.incentivePaid ? "Paid" : "Pending"}
                            </span>
                          </div>
                        ) : (
                          "-"
                        )}
                      </td>
                      {/* <td className="p-4 font-bold" style={{ color: "#6B3410", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>{student.duration ? `${student.duration} Month` : "-"}</td> */}
                      <td className="p-4">
                        <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold" style={{
                          background: student.status === "active"
                            ? "linear-gradient(145deg, #48bb78, #68d391, #48bb78)"
                            : student.status === "inactive"
                            ? "linear-gradient(145deg, #c53030, #fc8181, #c53030)"
                            : "linear-gradient(145deg, #718096, #A0AEC0, #718096)",
                          boxShadow: "inset 1px 1px 3px rgba(255,255,255,0.4), inset -1px -1px 3px rgba(0,0,0,0.2), 2px 2px 4px rgba(0,0,0,0.3)",
                          color: "#fff",
                          textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
                          border: "1px solid rgba(0,0,0,0.2)",
                        }}>
                          {student.status ? student.status.charAt(0).toUpperCase() + student.status.slice(1) : "Active"}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => navigate(`/payments/new/${student._id}`)}
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
                          <IndianRupee size={16} style={{ filter: "drop-shadow(1px 1px 1px rgba(0,0,0,0.5))" }} />
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
        className="px-5 py-2 font-bold text-sm transition-all duration-150 relative overflow-hidden"
        style={{ ...base, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1 }}
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