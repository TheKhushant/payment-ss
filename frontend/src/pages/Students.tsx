import { getStudents } from "../services/studentService";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Students</h1>
        <button
          onClick={() => navigate("/students/new")}
          className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium flex items-center gap-2 transition"
        >
          + Create New Student
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-wrap gap-4 items-end">
        {/* Search */}
        <div className="flex-1 min-w-[280px]">
          <label className="block text-sm font-medium text-gray-600 mb-1">Search</label>
          <input
            type="text"
            placeholder="Search by name, email, mobile, college, course..."
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

        {/* Status Filter */}
        <div className="min-w-[160px]">
          <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <button
          onClick={() => {
            setSearchTerm("");
            setSelectedCourse("All");
            setSelectedDuration("All");
            setSelectedStatus("All");
          }}
          className="px-5 py-3 text-gray-600 hover:bg-gray-100 rounded-xl border border-gray-300 transition"
        >
          Reset Filters
        </button>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="p-4 text-left font-medium text-gray-600">Name</th>
                <th className="p-4 text-left font-medium text-gray-600">Email</th>
                <th className="p-4 text-left font-medium text-gray-600">Mobile</th>
                <th className="p-4 text-left font-medium text-gray-600">College</th>
                <th className="p-4 text-left font-medium text-gray-600">Course</th>
                <th className="p-4 text-left font-medium text-gray-600">Duration</th>
                <th className="p-4 text-left font-medium text-gray-600">Status</th>
                <th className="p-4 text-center font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-500">
                    Loading students...
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-500">
                    No students found
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student: any) => (
                  <tr key={student._id} className="border-b hover:bg-gray-50 transition">
                    <td className="p-4 font-medium">{student.name}</td>
                    <td className="p-4 text-gray-600">{student.email}</td>
                    <td className="p-4 text-gray-600">{student.mobile}</td>
                    <td className="p-4 text-gray-600">{student.college || "-"}</td>
                    <td className="p-4 text-gray-600">{student.courseId?.name || "-"}</td>
                    <td className="p-4 text-gray-600">{student.duration ? `${student.duration} Month` : "-"}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          student.status === "active"
                            ? "bg-green-100 text-green-700"
                            : student.status === "inactive"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {student.status ? student.status.charAt(0).toUpperCase() + student.status.slice(1) : "Active"}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => navigate(`/students/${student._id}`)}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        View
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
  );
}