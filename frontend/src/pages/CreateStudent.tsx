import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCourses } from "../services/courseService";
import { createStudent } from "../services/studentService";

interface Installment {
  id: number;
  amount: number;
  dueDate: string;
}

export default function CreateStudent() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState<any[]>([]);
  const [employees, setEmployees] = useState<string[]>(["Rahul Sharma", "Priya Singh", "Amit Kumar"]);

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    college: "",
    admissionDate: new Date().toISOString().split("T")[0],
    courseId: "",
    course: "",
    duration: "",
    courseFee: 0,
    discount: 0,
    incentiveTo: "",
    finalFee: 0,
  });

  const [installments, setInstallments] = useState<Installment[]>([]);
  const [nextInstallmentId, setNextInstallmentId] = useState(1);
  const [newEmployee, setNewEmployee] = useState("");
  const [showNewEmployeeInput, setShowNewEmployeeInput] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const data = await getCourses();
      setCourses(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  // Auto-calculate final fee
  useEffect(() => {
    const final = Math.max(0, formData.courseFee - formData.discount);
    setFormData(prev => ({ ...prev, finalFee: final }));
  }, [formData.courseFee, formData.discount]);

  // Handle course selection
  const handleCourseChange = (courseId: string) => {
    const selectedCourse = courses.find(c => c._id === courseId);
    if (selectedCourse) {
      setFormData(prev => ({
        ...prev,
        courseId,
        course: selectedCourse.name,
        duration: selectedCourse.duration || "",
        courseFee: Number(selectedCourse.fee) || 0,
      }));
    } else {
      setFormData(prev => ({ ...prev, courseId: "", course: "", duration: "", courseFee: 0 }));
    }
    setInstallments([]);
  };

  const addInstallment = () => {
    const newInst: Installment = { id: nextInstallmentId, amount: 0, dueDate: "" };
    setInstallments([...installments, newInst]);
    setNextInstallmentId(prev => prev + 1);
  };

  const removeInstallment = (id: number) => {
    setInstallments(installments.filter(i => i.id !== id));
  };

  const updateInstallment = (id: number, field: keyof Installment, value: any) => {
    setInstallments(installments.map(inst =>
      inst.id === id ? { ...inst, [field]: value } : inst
    ));
  };

  const splitEvenly = () => {
    if (formData.finalFee <= 0 || installments.length === 0) {
      alert("Please add at least one installment and set final fee");
      return;
    }
    const evenAmount = Math.floor(formData.finalFee / installments.length);
    const updated = installments.map((inst, index) => ({
      ...inst,
      amount: index === installments.length - 1
        ? formData.finalFee - evenAmount * (installments.length - 1)
        : evenAmount,
      dueDate: inst.dueDate || new Date(Date.now() + index * 30 * 86400000).toISOString().split("T")[0]
    }));
    setInstallments(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.mobile || !formData.courseId) {
      setError("Name, mobile, and course are required.");
      return;
    }

    try {
      setLoading(true);

      const payload: any = {
        name: formData.name,
        mobile: formData.mobile,
        email: formData.email || undefined,
        college: formData.college || undefined,
        admissionDate: formData.admissionDate,
        courseId: formData.courseId,
        duration: formData.duration ? Number(formData.duration) : undefined,
        courseFee: formData.courseFee,
        discount: formData.discount,
        finalFee: formData.finalFee,
        incentiveTo: formData.incentiveTo || undefined,
        installments: installments.map(({ amount, dueDate }) => ({
          amount,
          dueDate,
          status: "pending",
        })),
        status: "active",
      };

      await createStudent(payload);
      navigate("/students");
    } catch (err: any) {
      setError(err.message || "Failed to create student");
    } finally {
      setLoading(false);
    }
  };

  const totalInstallment = installments.reduce((sum, i) => sum + Number(i.amount || 0), 0);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Create New Student</h1>
        <div className="flex items-center gap-3">
          {error && <span className="text-red-600 text-sm">{error}</span>}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold text-lg disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Student"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Form - 2 Columns */}
        <div className="lg:col-span-2 space-y-8">
          {/* Personal Information */}
          <div className="bg-white rounded-2xl shadow-sm border p-8">
            <h2 className="text-xl font-semibold mb-6 border-b pb-3">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Student Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500"
                  placeholder="Full Name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Mobile Number <span className="text-red-500">*</span></label>
                <input
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500"
                  placeholder="98765 43210"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500"
                  placeholder="student@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">College Name</label>
                <input
                  type="text"
                  value={formData.college}
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500"
                  placeholder="College / University"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Admission Date</label>
                <input
                  type="date"
                  value={formData.admissionDate}
                  onChange={(e) => setFormData({ ...formData, admissionDate: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Course & Fee */}
          <div className="bg-white rounded-2xl shadow-sm border p-8">
            <h2 className="text-xl font-semibold mb-6 border-b pb-3">Course & Fee Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Course <span className="text-red-500">*</span></label>
                <select
                  value={formData.courseId}
                  onChange={(e) => handleCourseChange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select Course</option>
                  {courses.map((c: any) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>
           
             <div>
  <label className="block text-sm font-medium mb-2">Duration</label>
  <select
    value={formData.duration}
    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500"
  >
    <option value="">Select Duration</option>
    <option value="1">1 Month</option>
    <option value="2">2 Months</option>
    <option value="3">3 Months</option>
    <option value="6">6 Months</option>
  </select>
</div>
<div>
  <label className="block text-sm font-medium mb-2">Course Fee (₹)</label>
  <input
    type="number"
    value={formData.courseFee}
    onChange={(e) => setFormData({ ...formData, courseFee: Number(e.target.value) })}
    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500"
  />
</div>
              <div>
                <label className="block text-sm font-medium mb-2">Discount (₹)</label>
                <input
                  type="number"
                  value={formData.discount}
                  onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Incentive To</label>
                <div className="flex gap-2">
                  <select
                    value={formData.incentiveTo}
                    onChange={(e) => setFormData({ ...formData, incentiveTo: e.target.value })}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Select Employee</option>
                    {employees.map(emp => (
                      <option key={emp} value={emp}>{emp}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowNewEmployeeInput(true)}
                    className="px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50"
                  >
                    + Add
                  </button>
                </div>
                {showNewEmployeeInput && (
                  <div className="mt-2 flex gap-2">
                    <input
                      type="text"
                      value={newEmployee}
                      onChange={(e) => setNewEmployee(e.target.value)}
                      placeholder="Employee name"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newEmployee.trim()) {
                          setEmployees([...employees, newEmployee.trim()]);
                          setFormData({ ...formData, incentiveTo: newEmployee.trim() });
                          setNewEmployee("");
                          setShowNewEmployeeInput(false);
                        }
                      }}
                      className="px-6 bg-green-600 text-white rounded-xl"
                    >
                      Add
                    </button>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Final Fees (₹)</label>
                <input
                  type="text"
                  value={formData.finalFee.toLocaleString()}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-emerald-50 font-semibold text-lg"
                />
              </div>
            </div>
          </div>

          {/* Installment Plan */}
          <div className="bg-white rounded-2xl shadow-sm border p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Installment Plan</h2>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={splitEvenly}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm"
                >
                  Split Evenly
                </button>
                <button
                  type="button"
                  onClick={addInstallment}
                  className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm"
                >
                  + Add Installment
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {installments.map((inst, index) => (
                <div key={inst.id} className="flex gap-4 items-end bg-gray-50 p-5 rounded-xl">
                  <div className="w-12 font-semibold text-gray-500">#{index + 1}</div>
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">Amount (₹)</label>
                    <input
                      type="number"
                      value={inst.amount}
                      onChange={(e) => updateInstallment(inst.id, "amount", Number(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">Due Date</label>
                    <input
                      type="date"
                      value={inst.dueDate}
                      onChange={(e) => updateInstallment(inst.id, "dueDate", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeInstallment(inst.id)}
                    className="px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl"
                  >
                    Clear
                  </button>
                </div>
              ))}
              {installments.length === 0 && (
                <p className="text-gray-500 text-center py-8">No installments added yet. Click "Add Installment"</p>
              )}
            </div>

            {installments.length > 0 && (
              <div className="mt-6 p-4 bg-emerald-50 rounded-xl text-center">
                Total Installment Amount: <span className="font-bold">₹{totalInstallment.toLocaleString()}</span>
                {totalInstallment !== formData.finalFee && (
                  <p className="text-red-600 text-sm mt-1">Note: Does not match Final Fee</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border p-8 sticky top-6">
            <h3 className="font-semibold text-lg mb-6">Summary</h3>

            <div className="space-y-6">
              <div>
                <p className="text-gray-500 text-sm">Student</p>
                <p className="font-medium text-lg">{formData.name || "—"}</p>
              </div>

              <div>
                <p className="text-gray-500 text-sm">Course</p>
                <p className="font-medium">{formData.course || "—"}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500 text-sm">Duration</p>
                  <p className="font-medium">{formData.duration ? `${formData.duration} Months` : "—"}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Final Fee</p>
                  <p className="font-semibold text-xl text-emerald-600">₹{formData.finalFee.toLocaleString()}</p>
                </div>
              </div>

              {formData.incentiveTo && (
                <div>
                  <p className="text-gray-500 text-sm">Incentive To</p>
                  <p className="font-medium">{formData.incentiveTo}</p>
                </div>
              )}

              <div className="pt-6 border-t">
                <p className="text-gray-500 text-sm mb-3">Installments ({installments.length})</p>
                {installments.length > 0 ? (
                  <div className="max-h-80 overflow-auto space-y-3 text-sm">
                    {installments.map((inst, i) => (
                      <div key={i} className="flex justify-between">
                        <span>#{i+1} - {inst.dueDate}</span>
                        <span className="font-medium">₹{inst.amount}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">No installments</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}