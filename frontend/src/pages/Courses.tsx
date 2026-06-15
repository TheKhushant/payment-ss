import { useEffect, useState } from "react";
import { getCourses } from "../services/courseService";
// Import other services if available: createCourse, updateCourse, deleteCourse

export default function Courses() {
  const [courses, setCourses] = useState<any[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);

  // Form fields
  const [formData, setFormData] = useState({
    name: "",
    duration: "",
    fee: "",
    description: "",
  });

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const data = await getCourses();
      setCourses(data || []);
      setFilteredCourses(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Real-time search
  useEffect(() => {
    if (!searchTerm) {
      setFilteredCourses(courses);
      return;
    }
    const term = searchTerm.toLowerCase();
    const result = courses.filter((course) =>
      course.name?.toLowerCase().includes(term) ||
      course.description?.toLowerCase().includes(term)
    );
    setFilteredCourses(result);
  }, [searchTerm, courses]);

  const openAddModal = () => {
    setEditingCourse(null);
    setFormData({ name: "", duration: "", fee: "", description: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (course: any) => {
    setEditingCourse(course);
    setFormData({
      name: course.name || "",
      duration: course.duration || "",
      fee: course.fee || "",
      description: course.description || "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCourse(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingCourse) {
        // Update course - replace with your actual service
        // await updateCourse(editingCourse._id, formData);
        alert("Course updated successfully! (API call placeholder)");
      } else {
        // Create new course - replace with your actual service
        // await createCourse(formData);
        alert("New course added successfully! (API call placeholder)");
      }
      closeModal();
      loadCourses(); // Refresh list
    } catch (err) {
      console.error(err);
      alert("Failed to save course");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this course?")) return;
    
    try {
      // await deleteCourse(id); // Replace with your actual service
      alert("Course deleted successfully! (API call placeholder)");
      loadCourses();
    } catch (err) {
      console.error(err);
      alert("Failed to delete course");
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Courses</h1>
        <button
          onClick={openAddModal}
          className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium flex items-center gap-2 transition"
        >
          + Add New Course
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-6">
        <input
          type="text"
          placeholder="Search courses by name or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Courses Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="p-4 text-left font-medium text-gray-600">Course Name</th>
                <th className="p-4 text-left font-medium text-gray-600">Duration</th>
                <th className="p-4 text-left font-medium text-gray-600">Fee</th>
                <th className="p-4 text-left font-medium text-gray-600">Description</th>
                <th className="p-4 text-center font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-gray-500">Loading courses...</td>
                </tr>
              ) : filteredCourses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-gray-500">No courses found</td>
                </tr>
              ) : (
                filteredCourses.map((course: any) => (
                  <tr key={course._id} className="border-b hover:bg-gray-50 transition">
                    <td className="p-4 font-medium">{course.name}</td>
                    <td className="p-4 text-gray-600">{course.duration} Months</td>
                    <td className="p-4 font-semibold">₹{Number(course.fee).toLocaleString()}</td>
                    <td className="p-4 text-gray-600 max-w-xs truncate">{course.description || "—"}</td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => openEditModal(course)}
                          className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(course._id)}
                          className="text-red-600 hover:text-red-700 font-medium"
                        >
                          Delete
                        </button>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md mx-4">
            <h2 className="text-2xl font-bold mb-6">
              {editingCourse ? "Edit Course" : "Add New Course"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1">Course Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500"
                  placeholder="e.g. Full Stack Web Development"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Duration (Months)</label>
                <input
                  type="number"
                  required
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500"
                  placeholder="6"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Fee (₹)</label>
                <input
                  type="number"
                  required
                  value={formData.fee}
                  onChange={(e) => setFormData({ ...formData, fee: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500"
                  placeholder="25000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500"
                  placeholder="Course description..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium"
                >
                  {editingCourse ? "Update Course" : "Create Course"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}