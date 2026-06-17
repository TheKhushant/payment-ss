import { useEffect, useState } from "react";
import { getCourses, deleteCourse, createCourse, updateCourse } from "../services/courseService";

const DURATIONS = [1, 2, 3, 6];

export default function Courses() {
  const [courses, setCourses] = useState<any[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    fees: { 1: 0, 2: 0, 3: 0, 6: 0 } as Record<number, number>,
  });

  useEffect(() => { loadCourses(); }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const data = await getCourses();
      setCourses(data || []);
      setFilteredCourses(data || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => {
    if (!searchTerm) { setFilteredCourses(courses); return; }
    const term = searchTerm.toLowerCase();
    const result = courses.filter((course) =>
      course.name?.toLowerCase().includes(term) ||
      course.description?.toLowerCase().includes(term)
    );
    setFilteredCourses(result);
  }, [searchTerm, courses]);

  const openAddModal = () => {
    setEditingCourse(null);
    setFormData({ name: "", description: "", fees: { 1: 0, 2: 0, 3: 0, 6: 0 } });
    setIsModalOpen(true);
  };

  const openEditModal = (course: any) => {
    setEditingCourse(course);
    setFormData({
      name: course.name || "",
      description: course.description || "",
      fees: {
        1: Number(course.pricing?.["1"] || 0),
        2: Number(course.pricing?.["2"] || 0),
        3: Number(course.pricing?.["3"] || 0),
        6: Number(course.pricing?.["6"] || 0),
      },
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCourse(null);
  };

  const handleFeeChange = (duration: number, value: string) => {
    setFormData(prev => ({ ...prev, fees: { ...prev.fees, [duration]: Number(value) || 0 } }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) { alert("Course name is required"); return; }
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        pricing: { "1": formData.fees[1], "2": formData.fees[2], "3": formData.fees[3], "6": formData.fees[6] },
        durations: [1, 2, 3, 6],
      };
      if (editingCourse) {
        await updateCourse(editingCourse._id, payload);
        alert("Course updated successfully!");
      } else {
        await createCourse(payload);
        alert("New course added successfully!");
      }
      closeModal();
      await loadCourses();
    } catch (err) {
      console.error(err);
      alert("Failed to save course");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this course?")) return;
    try {
      await deleteCourse(id);
      alert("Course deleted successfully!");
      await loadCourses();
    } catch (err) {
      console.error(err);
      alert("Failed to delete course");
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
              Courses
            </h1>
          </div>
          <SkeuoButton
            label="+ Add New Course"
            onClick={openAddModal}
            base={btnBase("#22543d", "#276749", "#E2E8F0")}
            hover={btnHover("#276749", "#38a169")}
            active={btnActive("#68d391", "#9ae6b4", "#22543d")}
          />
        </div>

        {/* Search Bar */}
        <div className="p-5 mb-6 relative" style={cardBase}>
          <div style={cardHighlight} />
          <input
            type="text"
            placeholder="Search courses by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 relative z-10"
            style={inputStyle}
          />
        </div>

        {/* Courses Table */}
        <div className="relative overflow-hidden" style={cardBase}>
          <div style={cardHighlight} />
          <div className="overflow-x-auto relative z-10">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "2px solid #8B4513" }}>
                  <th className="p-4 text-left font-bold" style={{ color: "#6B3410", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>Course Name</th>
                  <th className="p-4 text-left font-bold" style={{ color: "#6B3410", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>1 Month</th>
                  <th className="p-4 text-left font-bold" style={{ color: "#6B3410", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>2 Months</th>
                  <th className="p-4 text-left font-bold" style={{ color: "#6B3410", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>3 Months</th>
                  <th className="p-4 text-left font-bold" style={{ color: "#6B3410", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>6 Months</th>
                  <th className="p-4 text-left font-bold" style={{ color: "#6B3410", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>Description</th>
                  <th className="p-4 text-center font-bold" style={{ color: "#6B3410", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="p-12 text-center font-bold" style={{ color: "#8B4513", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>
                      Loading courses...
                    </td>
                  </tr>
                ) : filteredCourses.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-12 text-center font-bold" style={{ color: "#8B4513", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>
                      No courses found
                    </td>
                  </tr>
                ) : (
                  filteredCourses.map((course: any) => (
                    <tr key={course._id} className="border-b transition-colors hover:bg-white/20" style={{ borderColor: "rgba(139,69,19,0.2)" }}>
                      <td className="p-4 font-bold" style={{ color: "#3E2723", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>{course.name}</td>
                      <td className="p-4 font-bold" style={{ color: "#2F855A", textShadow: "1px 1px 2px rgba(0,0,0,0.2), 0 1px 1px rgba(255,255,255,0.5)" }}>₹{Number(course.pricing?.["1"] || 0).toLocaleString()}</td>
                      <td className="p-4 font-bold" style={{ color: "#2F855A", textShadow: "1px 1px 2px rgba(0,0,0,0.2), 0 1px 1px rgba(255,255,255,0.5)" }}>₹{Number(course.pricing?.["2"] || 0).toLocaleString()}</td>
                      <td className="p-4 font-bold" style={{ color: "#2F855A", textShadow: "1px 1px 2px rgba(0,0,0,0.2), 0 1px 1px rgba(255,255,255,0.5)" }}>₹{Number(course.pricing?.["3"] || 0).toLocaleString()}</td>
                      <td className="p-4 font-bold" style={{ color: "#2F855A", textShadow: "1px 1px 2px rgba(0,0,0,0.2), 0 1px 1px rgba(255,255,255,0.5)" }}>₹{Number(course.pricing?.["6"] || 0).toLocaleString()}</td>
                      <td className="p-4 max-w-xs truncate font-bold" style={{ color: "#6B3410", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>{course.description || "—"}</td>
                      <td className="p-4 text-center">
                        <div className="flex justify-center gap-3">
                          <SkeuoButton
                            label="Edit"
                            onClick={() => openEditModal(course)}
                            base={btnBase("#3182ce", "#63b3ed", "#fff")}
                            hover={btnHover("#2b6cb0", "#4299e1")}
                            active={btnActive("#90cdf4", "#bee3f8", "#2b6cb0")}
                            small
                          />
                          <SkeuoButton
                            label="Delete"
                            onClick={() => handleDelete(course._id)}
                            base={btnBase("#c53030", "#e53e3e", "#fff")}
                            hover={btnHover("#e53e3e", "#fc8181")}
                            active={btnActive("#fc8181", "#feb2b2", "#c53030")}
                            small
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: "rgba(0,0,0,0.7)" }}>
            <div className="relative w-full max-w-lg max-h-[90vh] overflow-auto" style={{
              background: "linear-gradient(145deg, #F5DEB3, #DEB887, #F5DEB3)",
              boxShadow: "12px 12px 24px rgba(0,0,0,0.5), -4px -4px 12px rgba(255,255,255,0.1), inset 1px 1px 3px rgba(255,255,255,0.3)",
              border: "1px solid rgba(0,0,0,0.3)",
              borderRadius: "20px",
            }}>
              <div style={{
                position: "absolute", inset: 0, borderRadius: "20px", pointerEvents: "none",
                background: "linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.15) 100%)",
              }} />
              
              <div className="p-8 relative z-10">
                <h2 className="text-2xl font-bold mb-6" style={{ color: "#4A3728", textShadow: "1px 1px 2px rgba(255,255,255,0.5)" }}>
                  {editingCourse ? "Edit Course" : "Add New Course"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label style={labelStyle}>Course Name <span style={{ color: "#c53030" }}>*</span></label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3"
                      style={inputStyle}
                      placeholder="e.g. Full Stack Web Development"
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>Fees According to Duration</label>
                    <div className="grid grid-cols-2 gap-4">
                      {DURATIONS.map((months) => (
                        <div key={months}>
                          <label className="block text-sm font-bold mb-1" style={{ color: "#8B4513", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>
                            {months} Month{months > 1 ? 's' : ''}
                          </label>
                          <input
                            type="number"
                            required
                            value={formData.fees[months]}
                            onChange={(e) => handleFeeChange(months, e.target.value)}
                            className="w-full px-4 py-3"
                            style={inputStyle}
                            placeholder="25000"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3"
                      style={inputStyle}
                      placeholder="Course description..."
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <SkeuoButton
                      label="Cancel"
                      onClick={closeModal}
                      base={btnBase("#6B3410", "#8B4513", "#D2B48C")}
                      hover={btnHover("#7B3F00", "#A0522D")}
                      active={btnActive("#CD853F", "#DEB887", "#3E2723")}
                      fullWidth
                    />
                    <SkeuoButton
                      label={editingCourse ? "Update Course" : "Create Course"}
                      onClick={handleSubmit}
                      base={btnBase("#22543d", "#276749", "#E2E8F0")}
                      hover={btnHover("#276749", "#38a169")}
                      active={btnActive("#68d391", "#9ae6b4", "#22543d")}
                      fullWidth
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  function SkeuoButton({ label, onClick, base, hover, active, disabled, small, fullWidth }: any) {
    const [isPressed, setIsPressed] = useState(false);
    const sizeClasses = small ? "px-3 py-1.5 text-xs" : fullWidth ? "flex-1 py-3" : "px-5 py-2.5";

    return (
      <button
        onClick={onClick}
        disabled={disabled}
        onMouseEnter={(e) => { if (!disabled && !isPressed) Object.assign(e.currentTarget.style, hover); }}
        onMouseLeave={(e) => { setIsPressed(false); Object.assign(e.currentTarget.style, base); }}
        onMouseDown={(e) => { if (!disabled) { setIsPressed(true); Object.assign(e.currentTarget.style, active); } }}
        onMouseUp={(e) => { if (!disabled) { setIsPressed(false); Object.assign(e.currentTarget.style, hover); } }}
        className={`font-bold text-sm transition-all duration-150 relative overflow-hidden ${sizeClasses}`}
        style={{ ...base, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.6 : 1 }}
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