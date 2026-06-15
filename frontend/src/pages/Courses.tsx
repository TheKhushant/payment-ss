import { useEffect, useState } from "react";
import { getCourses, deleteCourse, createCourse, updateCourse, } from "../services/courseService";
// Import createCourse, updateCourse, deleteCourse when ready

// console.log(createCourse, " : console to remove warnig")
const DURATIONS = [1, 2, 3, 6];

export default function Courses() {
  const [courses, setCourses] = useState<any[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);

  // Form fields - fees as object
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    fees: { 1: 0, 2: 0, 3: 0, 6: 0 } as Record<number, number>,
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
    setFormData({
      name: "",
      description: "",
      fees: { 1: 0, 2: 0, 3: 0, 6: 0 },
    });
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
    setFormData(prev => ({
      ...prev,
      fees: {
        ...prev.fees,
        [duration]: Number(value) || 0
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!formData.name) {
    alert("Course name is required");
    return;
  }

  try {
    const payload = {
      name: formData.name,
      description: formData.description,
      pricing: {
        "1": formData.fees[1],
        "2": formData.fees[2],
        "3": formData.fees[3],
        "6": formData.fees[6],
      },
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
                <th className="p-4 text-left font-medium text-gray-600">1 Month</th>
                <th className="p-4 text-left font-medium text-gray-600">2 Months</th>
                <th className="p-4 text-left font-medium text-gray-600">3 Months</th>
                <th className="p-4 text-left font-medium text-gray-600">6 Months</th>
                <th className="p-4 text-left font-medium text-gray-600">Description</th>
                <th className="p-4 text-center font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-gray-500">Loading courses...</td>
                </tr>
              ) : filteredCourses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-gray-500">No courses found</td>
                </tr>
              ) : (
                filteredCourses.map((course: any) => (
                  <tr key={course._id} className="border-b hover:bg-gray-50 transition">
                    <td className="p-4 font-medium">{course.name}</td>
                    <td className="p-4 font-semibold">₹{Number(course.pricing?.["1"] || 0).toLocaleString()}</td>
                    <td className="p-4 font-semibold">₹{Number(course.pricing?.["2"] || 0).toLocaleString()}</td>
                    <td className="p-4 font-semibold">₹{Number(course.pricing?.["3"] || 0).toLocaleString()}</td>
                    <td className="p-4 font-semibold">₹{Number(course.pricing?.["6"] || 0).toLocaleString()}</td>
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
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg mx-4">
            <h2 className="text-2xl font-bold mb-6">
              {editingCourse ? "Edit Course" : "Add New Course"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-1">Course Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500"
                  placeholder="e.g. Full Stack Web Development"
                />
              </div>

              {/* Duration-wise Fees */}
              <div>
                <label className="block text-sm font-medium mb-3">Fees According to Duration</label>
                <div className="grid grid-cols-2 gap-4">
                  {DURATIONS.map((months) => (
                    <div key={months}>
                      <label className="block text-sm text-gray-600 mb-1">
                        {months} Month{months > 1 ? 's' : ''}
                      </label>
                      <input
                        type="number"
                        required
                        value={formData.fees[months]}
                        onChange={(e) => handleFeeChange(months, e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500"
                        placeholder="25000"
                      />
                    </div>
                  ))}
                </div>
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