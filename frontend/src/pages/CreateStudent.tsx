import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCourses, createCourse } from "../services/courseService";
import { createStudent } from "../services/studentService";

interface Installment {
  id: number;
  amount: number;
  dueDate: string;
}


export default function CreateStudent() {
  const navigate = useNavigate();
  
  const [courses, setCourses] = useState<any[]>([]);
  const [employees] = useState<string[]>([
    "Sankalp Singh",
    "Tejas Khope",
    "Khushant Wankhede",
    "Yadnesh Umredkar",
    "Flansh Gajbiye",
  ]);

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
    incentiveAmount: 0,
  });

  const [installments, setInstallments] = useState<Installment[]>([]);
    useEffect(() => {
  if (!formData.finalFee) return;

  const isSpecialCourse =
    formData.course?.toLowerCase().includes("servicenow") ||
    formData.course?.toLowerCase().includes("service now") ||
    formData.course?.toLowerCase().includes("databricks");

  const gapDays = isSpecialCourse ? 42 : 30;

  const firstDueDate =
    installments[0]?.dueDate ||
    new Date().toISOString().split("T")[0];

  const firstAmount = installments[0]?.amount || 0;

  const secondDate = new Date(firstDueDate);
  secondDate.setDate(secondDate.getDate() + gapDays);

  setInstallments([
    {
      id: 1,
      amount: firstAmount,
      dueDate: firstDueDate,
    },
    {
      id: 2,
      amount: formData.finalFee - firstAmount,
      dueDate: secondDate.toISOString().split("T")[0],
    },
  ]);
}, [formData.finalFee, formData.course]);
  
  // const [newEmployee, setNewEmployee] = useState("");
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showNewEmployeeInput, setShowNewEmployeeInput] = useState(false);
  // const [customIncentiveName, setCustomIncentiveName] = useState("");

  const [newCourse, setNewCourse] = useState({
    name: "",
    fee1: 0,
    fee2: 0,
    fee3: 0,
    fee6: 0,
  });

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
    const final = Math.max(
      0,
      formData.courseFee -
        formData.discount -
        formData.incentiveAmount
    );
    setFormData(prev => ({ ...prev, finalFee: final }));
  }, [
  formData.courseFee,
  formData.discount,
  formData.incentiveAmount,
]);

  // Handle course selection
  const handleCourseChange = (courseId: string) => {
    const selectedCourse = courses.find(c => c._id === courseId);
    if (selectedCourse) {
      const pricing = selectedCourse.pricing || {};

      const autoDuration =
        Object.keys(pricing).find(
          key => Number(pricing[key]) > 0
        ) || "";

      setFormData(prev => ({
        ...prev,
        courseId,
        course: selectedCourse.name,
        duration: autoDuration,
        courseFee: pricing[autoDuration] || 0,
      }));
    } else {
      setFormData(prev => ({ ...prev, courseId: "", course: "", duration: "", courseFee: 0 }));
    }
    
  };


  const updateInstallment = (
    id: number,
    field: keyof Installment,
    value: any
  ) => {
    const updated = [...installments];

    const index = updated.findIndex(
      (i) => i.id === id
    );

    if (index === -1) return;

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    if (id === 1) {
      const firstAmount =
        field === "amount"
          ? Number(value)
          : updated[0].amount;

      updated[1].amount =
        formData.finalFee - firstAmount;

      const firstDate =
        field === "dueDate"
          ? value
          : updated[0].dueDate;

      const isSpecialCourse =
        formData.course?.toLowerCase().includes("servicenow") ||
        formData.course?.toLowerCase().includes("service now") ||
        formData.course?.toLowerCase().includes("databricks");

      const gapDays = isSpecialCourse ? 42 : 30;

      const nextDate = new Date(firstDate);
      nextDate.setDate(
        nextDate.getDate() + gapDays
      );

      updated[1].dueDate =
        nextDate.toISOString().split("T")[0];
    }

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
        courseId:
          formData.courseId.length === 24
            ? formData.courseId
            : undefined,
        durationMonths: formData.duration
        ? Number(formData.duration)
        : undefined,
        courseFee: formData.courseFee,
        discount: formData.discount,
        finalFee: formData.finalFee,
        incentiveTo: formData.incentiveTo || undefined,
        installments: installments.map(({ amount, dueDate }) => ({
          amount,
          dueDate,
          status: "upcoming",
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
                <button
                  type="button"
                  onClick={() => setShowCourseModal(true)}
                  className="mt-2 text-blue-600 text-sm"
                >
                  + Add New Course
                </button>
              </div>
           
             <div>
              <label className="block text-sm font-medium mb-2">Duration</label>
              <select
                value={formData.duration}
                onChange={(e) => {
                  const duration = e.target.value;

                  const selectedCourse = courses.find(
                    (c: any) => c._id === formData.courseId
                  );

                  let fee = formData.courseFee;

                  if (selectedCourse) {
                    fee = selectedCourse?.pricing?.[duration] || 0;
                  }

                  setFormData({
                    ...formData,
                    duration,
                    courseFee: fee,
                  });
                }}
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
              <label className="block text-sm font-medium mb-2">
                Incentive To
              </label>

              <select
                value={
                  employees.includes(formData.incentiveTo)
                    ? formData.incentiveTo
                    : "other"
                }
                onChange={(e) => {
                  if (e.target.value === "other") {
                    setShowNewEmployeeInput(true);
                    setFormData({
                      ...formData,
                      incentiveTo: "",
                    });
                  } else {
                    setShowNewEmployeeInput(false);
                    setFormData({
                      ...formData,
                      incentiveTo: e.target.value,
                    });
                  }
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500"
              >
                <option value="">Select Employee</option>

                {employees.map((emp) => (
                  <option key={emp} value={emp}>
                    {emp}
                  </option>
                ))}

                <option value="other">
                  Other (Type Name)
                </option>
              </select>

              {showNewEmployeeInput && (
                <input
                  type="text"
                  placeholder="Enter Employee Name"
                  value={formData.incentiveTo}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      incentiveTo: e.target.value,
                    })
                  }
                  className="w-full mt-3 px-4 py-3 border border-gray-300 rounded-xl"
                />
              )}

              {/* Incentive Amount */}
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">
                  Incentive Amount (₹)
                </label>

                <input
                  type="number"
                  min="0"
                  value={formData.incentiveAmount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      incentiveAmount: Number(e.target.value),
                    })
                  }
                  placeholder="Enter incentive amount"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500"
                />
              </div>
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
                      readOnly={index === 1}
                      onChange={(e) =>
                        updateInstallment(
                          inst.id,
                          "amount",
                          Number(e.target.value)
                        )
                      }
                      className={`w-full px-4 py-3 border rounded-xl ${
                        index === 1
                          ? "bg-gray-100"
                          : ""
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">Due Date</label>
                    <input
                      type="date"
                      value={inst.dueDate}
                      readOnly={index === 1}
                      onChange={(e) =>
                        updateInstallment(
                          inst.id,
                          "dueDate",
                          e.target.value
                        )
                      }
                      className={`w-full px-4 py-3 border rounded-xl ${
                        index === 1
                          ? "bg-gray-100"
                          : ""
                      }`}
                    />
                  </div>
                  
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
            {installments.length === 2 && (
              <div className="mt-4 p-3 bg-blue-50 rounded-xl text-sm">
                Gap Between Installments:
                <span className="font-semibold ml-2">
                  {formData.course?.toLowerCase().includes("service now") ||
                  formData.course?.toLowerCase().includes("databricks")
                    ? "42 Days"
                    : "30 Days"}
                </span>
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
                  <p className="text-sm text-red-600">
                    Incentive: ₹{formData.incentiveAmount}
                  </p>
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
      {showCourseModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-[500px]">
              <h2 className="text-xl font-semibold mb-4">
                Add New Course
              </h2>

              <input
                placeholder="Course Name"
                className="w-full border p-3 mb-3 rounded"
                onChange={(e) =>
                  setNewCourse({
                    ...newCourse,
                    name: e.target.value,
                  })
                }
              />

              <input
                placeholder="1 Month Fee"
                type="number"
                className="w-full border p-3 mb-3 rounded"
                onChange={(e) =>
                  setNewCourse({
                    ...newCourse,
                    fee1: Number(e.target.value),
                  })
                }
              />

              <input
                placeholder="2 Month Fee"
                type="number"
                className="w-full border p-3 mb-3 rounded"
                onChange={(e) =>
                  setNewCourse({
                    ...newCourse,
                    fee2: Number(e.target.value),
                  })
                }
              />

              <input
                placeholder="3 Month Fee"
                type="number"
                className="w-full border p-3 mb-3 rounded"
                onChange={(e) =>
                  setNewCourse({
                    ...newCourse,
                    fee3: Number(e.target.value),
                  })
                }
              />

              <input
                placeholder="6 Month Fee"
                type="number"
                className="w-full border p-3 mb-3 rounded"
                onChange={(e) =>
                  setNewCourse({
                    ...newCourse,
                    fee6: Number(e.target.value),
                  })
                }
              />

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setShowCourseModal(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>

                <button
                  onClick={async () => {
                    try {
                      const createdCourse = await createCourse({
                        name: newCourse.name,
                        pricing: {
                          "1": newCourse.fee1,
                          "2": newCourse.fee2,
                          "3": newCourse.fee3,
                          "6": newCourse.fee6,
                        },
                        durations: [1, 2, 3, 6],
                      });

                      setCourses([...courses, createdCourse]);

                      setFormData(prev => ({
                        ...prev,
                        courseId: createdCourse._id,
                        course: createdCourse.name,
                      }));

                      setShowCourseModal(false);
                    } catch (err) {
                      console.error(err);
                      alert("Failed to create course");
                    }
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}