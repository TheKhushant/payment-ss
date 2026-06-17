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

      const firstAmount = installments[0]?.amount || 0;

      const firstDueDate = formData.admissionDate;

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
    }, [
      formData.finalFee,
      formData.course,
      formData.admissionDate,
    ]);
  
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

  const [paymentMethod, setPaymentMethod] = useState("Cash");
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
        firstPaymentAmount: installments[0]?.amount || 0, paymentMethod,
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

   // Skeuomorphic styles
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
    marginBottom: "0.5rem",
    display: "block",
  };

  return (
    <div className="min-h-screen p-6 relative overflow-hidden" style={{ background: leatherBg, boxShadow: leatherShadow }}>
      {/* Leather texture overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: noisePattern, backgroundSize: "3px 3px" }} />
      <div className="absolute inset-3 border-2 border-dashed border-yellow-700/40 rounded-xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="p-4 rounded-lg" style={{
            background: "linear-gradient(145deg, #B8860B, #DAA520, #B8860B)",
            boxShadow: "inset 2px 2px 5px rgba(255,255,255,0.4), inset -2px -2px 5px rgba(0,0,0,0.3), 3px 3px 8px rgba(0,0,0,0.4)",
            border: "1px solid #8B6914",
          }}>
            <h1 className="text-3xl font-bold" style={{ color: "#4A3728", textShadow: "1px 1px 2px rgba(255,255,255,0.6), -1px -1px 1px rgba(0,0,0,0.3)" }}>
              Create New Student
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {error && (
              <span className="px-4 py-2 rounded-lg font-bold text-sm" style={{
                background: "linear-gradient(145deg, #c53030, #fc8181, #c53030)",
                boxShadow: "inset 2px 2px 5px rgba(0,0,0,0.3), 3px 3px 8px rgba(0,0,0,0.3)",
                color: "#fff",
                textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
              }}>
                {error}
              </span>
            )}
            <SkeuoButton
              label={loading ? "Saving..." : "Save Student"}
              onClick={handleSubmit}
              disabled={loading}
              base={btnBase("#22543d", "#276749", "#E2E8F0")}
              hover={btnHover("#276749", "#38a169")}
              active={btnActive("#68d391", "#9ae6b4", "#22543d")}
              size="lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Form - 2 Columns */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Information */}
            <div className="p-8 relative" style={cardBase}>
              <div style={cardHighlight} />
              <h2 className="text-xl font-bold mb-6 relative z-10" style={{ color: "#4A3728", textShadow: "1px 1px 2px rgba(255,255,255,0.5)", borderBottom: "2px solid #8B4513", paddingBottom: "12px" }}>
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                <div>
                  <label style={labelStyle}>Student Name <span style={{ color: "#c53030" }}>*</span></label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3"
                    style={inputStyle}
                    placeholder="Full Name"
                    required
                  />
                </div>
                <div>
                  <label style={labelStyle}>Mobile Number <span style={{ color: "#c53030" }}>*</span></label>
                  <input
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    className="w-full px-4 py-3"
                    style={inputStyle}
                    placeholder="98765 43210"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3"
                    style={inputStyle}
                    placeholder="student@example.com"
                  />
                </div>
                <div>
                  <label style={labelStyle}>College Name</label>
                  <input
                    type="text"
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    className="w-full px-4 py-3"
                    style={inputStyle}
                    placeholder="College / University"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Admission Date</label>
                  <input
                    type="date"
                    value={formData.admissionDate}
                    onChange={(e) => setFormData({ ...formData, admissionDate: e.target.value })}
                    className="w-full px-4 py-3"
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>

            {/* Course & Fee */}
            <div className="p-8 relative" style={cardBase}>
              <div style={cardHighlight} />
              <h2 className="text-xl font-bold mb-6 relative z-10" style={{ color: "#4A3728", textShadow: "1px 1px 2px rgba(255,255,255,0.5)", borderBottom: "2px solid #8B4513", paddingBottom: "12px" }}>
                Course & Fee Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                <div>
                  <label style={labelStyle}>Course <span style={{ color: "#c53030" }}>*</span></label>
                  <select
                    value={formData.courseId}
                    onChange={(e) => handleCourseChange(e.target.value)}
                    className="w-full px-4 py-3"
                    style={inputStyle}
                  >
                    <option value="">Select Course</option>
                    {courses.map((c: any) => (
                      <option key={c._id} value={c._id} style={{ background: "#F5DEB3" }}>{c.name}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowCourseModal(true)}
                    className="mt-2 text-sm font-bold"
                    style={{ color: "#B8860B", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}
                  >
                    + Add New Course
                  </button>
                </div>

                <div>
                  <label style={labelStyle}>Duration</label>
                  <select
                    value={formData.duration}
                    onChange={(e) => {
                      const duration = e.target.value;
                      const selectedCourse = courses.find((c: any) => c._id === formData.courseId);
                      let fee = formData.courseFee;
                      if (selectedCourse) fee = selectedCourse?.pricing?.[duration] || 0;
                      setFormData({ ...formData, duration, courseFee: fee });
                    }}
                    className="w-full px-4 py-3"
                    style={inputStyle}
                  >
                    <option value="">Select Duration</option>
                    <option value="1">1 Month</option>
                    <option value="2">2 Months</option>
                    <option value="3">3 Months</option>
                    <option value="6">6 Months</option>
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Course Fee (₹)</label>
                  <input
                    type="number"
                    value={formData.courseFee}
                    onChange={(e) => setFormData({ ...formData, courseFee: Number(e.target.value) })}
                    className="w-full px-4 py-3"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Discount (₹)</label>
                  <input
                    type="number"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })}
                    className="w-full px-4 py-3"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Incentive To</label>
                  <select
                    value={employees.includes(formData.incentiveTo) ? formData.incentiveTo : "other"}
                    onChange={(e) => {
                      if (e.target.value === "other") {
                        setShowNewEmployeeInput(true);
                        setFormData({ ...formData, incentiveTo: "" });
                      } else {
                        setShowNewEmployeeInput(false);
                        setFormData({ ...formData, incentiveTo: e.target.value });
                      }
                    }}
                    className="w-full px-4 py-3"
                    style={inputStyle}
                  >
                    <option value="">Select Employee</option>
                    {employees.map((emp) => (
                      <option key={emp} value={emp} style={{ background: "#F5DEB3" }}>{emp}</option>
                    ))}
                    <option value="other" style={{ background: "#F5DEB3" }}>Other (Type Name)</option>
                  </select>

                  {showNewEmployeeInput && (
                    <input
                      type="text"
                      placeholder="Enter Employee Name"
                      value={formData.incentiveTo}
                      onChange={(e) => setFormData({ ...formData, incentiveTo: e.target.value })}
                      className="w-full mt-3 px-4 py-3"
                      style={inputStyle}
                    />
                  )}

                  <div className="mt-4">
                    <label style={labelStyle}>Incentive Amount (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.incentiveAmount}
                      onChange={(e) => setFormData({ ...formData, incentiveAmount: Number(e.target.value) })}
                      placeholder="Enter incentive amount"
                      className="w-full px-4 py-3"
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Final Fees (₹)</label>
                  <input
                    type="text"
                    value={formData.finalFee.toLocaleString()}
                    readOnly
                    className="w-full px-4 py-3 font-bold text-lg"
                    style={{
                      ...inputStyle,
                      background: "linear-gradient(145deg, #48bb78, #68d391, #48bb78)",
                      color: "#fff",
                      textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Installment Plan */}
            <div className="p-8 relative" style={cardBase}>
              <div style={cardHighlight} />
              <div className="flex justify-between items-center mb-6 relative z-10">
                <h2 className="text-xl font-bold" style={{ color: "#4A3728", textShadow: "1px 1px 2px rgba(255,255,255,0.5)" }}>
                  Installment Plan
                </h2>
                <div>
                  <label style={labelStyle}>First Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-4 py-3"
                    style={inputStyle}
                  >
                    <option value="Cash" style={{ background: "#F5DEB3" }}>Cash</option>
                    <option value="UPI" style={{ background: "#F5DEB3" }}>UPI</option>
                    <option value="Bank Transfer" style={{ background: "#F5DEB3" }}>Bank Transfer</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4 relative z-10">
                {installments.map((inst, index) => (
                  <div key={inst.id} className="flex gap-4 items-end p-5 rounded-xl relative overflow-hidden" style={{
                    background: "linear-gradient(145deg, #DEB887, #F5DEB3, #DEB887)",
                    boxShadow: "3px 3px 6px rgba(0,0,0,0.3), -1px -1px 3px rgba(255,255,255,0.2), inset 1px 1px 2px rgba(255,255,255,0.3)",
                    border: "1px solid rgba(0,0,0,0.15)",
                  }}>
                    <div style={{
                      position: "absolute", inset: 0, borderRadius: "12px", pointerEvents: "none",
                      background: "linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)",
                    }} />
                    <div className="w-12 font-bold relative z-10" style={{ color: "#8B4513", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>#{index + 1}</div>
                    <div className="flex-1 relative z-10">
                      <label className="block text-xs font-bold mb-1" style={{ color: "#6B3410", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>Amount (₹)</label>
                      <input
                        type="number"
                        value={inst.amount}
                        readOnly={false}
                        onChange={(e) => updateInstallment(inst.id, "amount", Number(e.target.value))}
                        className="w-full px-4 py-3"
                        style={inputStyle}
                      />
                    </div>
                    <div className="flex-1 relative z-10">
                      <label className="block text-xs font-bold mb-1" style={{ color: "#6B3410", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>Due Date</label>
                      <input
                        type="date"
                        value={inst.dueDate}
                        readOnly={false}
                        onChange={(e) => updateInstallment(inst.id, "dueDate", e.target.value)}
                        className="w-full px-4 py-3"
                        style={inputStyle}
                      />
                    </div>
                  </div>
                ))}
                {installments.length === 0 && (
                  <p className="text-center py-8 font-bold" style={{ color: "#8B4513", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>
                    No installments added yet. Click "Add Installment"
                  </p>
                )}
              </div>

              {installments.length > 0 && (
                <div className="mt-6 p-4 rounded-xl text-center relative z-10" style={{
                  background: "linear-gradient(145deg, #48bb78, #68d391, #48bb78)",
                  boxShadow: "inset 2px 2px 5px rgba(0,0,0,0.3), inset -1px -1px 3px rgba(255,255,255,0.3), 3px 3px 8px rgba(0,0,0,0.3)",
                  border: "1px solid rgba(0,0,0,0.2)",
                }}>
                  <div style={{
                    position: "absolute", inset: 0, borderRadius: "12px", pointerEvents: "none",
                    background: "linear-gradient(180deg, rgba(255,255,255,0.25) 0%, transparent 50%, rgba(0,0,0,0.2) 100%)",
                  }} />
                  <span className="relative z-10 font-bold" style={{ color: "#fff", textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}>
                    Total Installment Amount: <span className="font-bold text-xl">₹{totalInstallment.toLocaleString()}</span>
                  </span>
                  {totalInstallment !== formData.finalFee && (
                    <p className="text-sm mt-1 relative z-10 font-bold" style={{ color: "#fff", textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}>
                      Note: Does not match Final Fee
                    </p>
                  )}
                </div>
              )}
              {installments.length === 2 && (
                <div className="mt-4 p-3 rounded-xl text-sm relative z-10" style={{
                  background: "linear-gradient(145deg, #3182ce, #63b3ed, #3182ce)",
                  boxShadow: "inset 2px 2px 5px rgba(0,0,0,0.3), inset -1px -1px 3px rgba(255,255,255,0.3), 3px 3px 8px rgba(0,0,0,0.3)",
                  border: "1px solid rgba(0,0,0,0.2)",
                }}>
                  <span className="font-bold" style={{ color: "#fff", textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}>
                    Gap Between Installments: <span className="font-bold ml-2">
                      {formData.course?.toLowerCase().includes("service now") || formData.course?.toLowerCase().includes("databricks") ? "42 Days" : "30 Days"}
                    </span>
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar - Summary */}
          <div className="lg:col-span-1">
            <div className="p-8 sticky top-6 relative" style={cardBase}>
              <div style={cardHighlight} />
              <h3 className="font-bold text-lg mb-6 relative z-10" style={{ color: "#4A3728", textShadow: "1px 1px 2px rgba(255,255,255,0.5)", borderBottom: "2px solid #8B4513", paddingBottom: "12px" }}>
                Summary
              </h3>

              <div className="space-y-6 relative z-10">
                <div>
                  <p className="text-sm font-bold" style={{ color: "#8B4513", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>Student</p>
                  <p className="font-bold text-lg" style={{ color: "#3E2723", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>{formData.name || "—"}</p>
                </div>

                <div>
                  <p className="text-sm font-bold" style={{ color: "#8B4513", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>Course</p>
                  <p className="font-bold" style={{ color: "#3E2723", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>{formData.course || "—"}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-bold" style={{ color: "#8B4513", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>Duration</p>
                    <p className="font-bold" style={{ color: "#3E2723", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>{formData.duration ? `${formData.duration} Months` : "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: "#8B4513", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>Final Fee</p>
                    <p className="font-bold text-xl" style={{ color: "#2F855A", textShadow: "1px 1px 2px rgba(0,0,0,0.2), 0 1px 1px rgba(255,255,255,0.5)" }}>₹{formData.finalFee.toLocaleString()}</p>
                  </div>
                </div>

                {formData.incentiveTo && (
                  <div>
                    <p className="text-sm font-bold" style={{ color: "#8B4513", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>Incentive To</p>
                    <p className="font-bold" style={{ color: "#3E2723", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>{formData.incentiveTo}</p>
                    <p className="text-sm font-bold" style={{ color: "#C05621", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>
                      Incentive: ₹{formData.incentiveAmount}
                    </p>
                  </div>
                )}

                <div className="pt-6" style={{ borderTop: "2px solid #8B4513" }}>
                  <p className="text-sm font-bold mb-3" style={{ color: "#8B4513", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>Installments ({installments.length})</p>
                  {installments.length > 0 ? (
                    <div className="max-h-80 overflow-auto space-y-3 text-sm">
                      {installments.map((inst, i) => (
                        <div key={i} className="flex justify-between p-2 rounded-lg" style={{
                          background: "linear-gradient(145deg, #DEB887, #F5DEB3, #DEB887)",
                          boxShadow: "2px 2px 4px rgba(0,0,0,0.2), inset 1px 1px 2px rgba(255,255,255,0.3)",
                        }}>
                          <span className="font-bold" style={{ color: "#6B3410", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>#{i + 1} - {inst.dueDate}</span>
                          <span className="font-bold" style={{ color: "#3E2723", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>₹{inst.amount}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="font-bold" style={{ color: "#8B4513", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>No installments</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Course Modal */}
        {showCourseModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: "rgba(0,0,0,0.7)" }}>
            <div className="p-6 w-[500px] relative" style={{
              background: "linear-gradient(145deg, #F5DEB3, #DEB887, #F5DEB3)",
              boxShadow: "12px 12px 24px rgba(0,0,0,0.5), -4px -4px 12px rgba(255,255,255,0.1), inset 1px 1px 3px rgba(255,255,255,0.3)",
              border: "1px solid rgba(0,0,0,0.3)",
              borderRadius: "20px",
            }}>
              <div style={{
                position: "absolute", inset: 0, borderRadius: "20px", pointerEvents: "none",
                background: "linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.15) 100%)",
              }} />
              <h2 className="text-xl font-bold mb-4 relative z-10" style={{ color: "#4A3728", textShadow: "1px 1px 2px rgba(255,255,255,0.5)" }}>
                Add New Course
              </h2>

              <input
                placeholder="Course Name"
                className="w-full px-4 py-3 mb-3 relative z-10"
                style={inputStyle}
                onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
              />
              <input
                placeholder="1 Month Fee"
                type="number"
                className="w-full px-4 py-3 mb-3 relative z-10"
                style={inputStyle}
                onChange={(e) => setNewCourse({ ...newCourse, fee1: Number(e.target.value) })}
              />
              <input
                placeholder="2 Month Fee"
                type="number"
                className="w-full px-4 py-3 mb-3 relative z-10"
                style={inputStyle}
                onChange={(e) => setNewCourse({ ...newCourse, fee2: Number(e.target.value) })}
              />
              <input
                placeholder="3 Month Fee"
                type="number"
                className="w-full px-4 py-3 mb-3 relative z-10"
                style={inputStyle}
                onChange={(e) => setNewCourse({ ...newCourse, fee3: Number(e.target.value) })}
              />
              <input
                placeholder="6 Month Fee"
                type="number"
                className="w-full px-4 py-3 mb-3 relative z-10"
                style={inputStyle}
                onChange={(e) => setNewCourse({ ...newCourse, fee6: Number(e.target.value) })}
              />

              <div className="flex justify-end gap-2 mt-4 relative z-10">
                <SkeuoButton
                  label="Cancel"
                  onClick={() => setShowCourseModal(false)}
                  base={btnBase("#6B3410", "#8B4513", "#D2B48C")}
                  hover={btnHover("#7B3F00", "#A0522D")}
                  active={btnActive("#CD853F", "#DEB887", "#3E2723")}
                />
                <SkeuoButton
                  label="Save"
                  onClick={async () => {
                    try {
                      const createdCourse = await createCourse({
                        name: newCourse.name,
                        pricing: { "1": newCourse.fee1, "2": newCourse.fee2, "3": newCourse.fee3, "6": newCourse.fee6 },
                        durations: [1, 2, 3, 6],
                      });
                      setCourses([...courses, createdCourse]);
                      setFormData(prev => ({ ...prev, courseId: createdCourse._id, course: createdCourse.name }));
                      setShowCourseModal(false);
                    } catch (err) {
                      console.error(err);
                      alert("Failed to create course");
                    }
                  }}
                  base={btnBase("#22543d", "#276749", "#E2E8F0")}
                  hover={btnHover("#276749", "#38a169")}
                  active={btnActive("#68d391", "#9ae6b4", "#22543d")}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  function SkeuoButton({ label, onClick, base, hover, active, disabled, size = "md" }: any) {
    const [isPressed, setIsPressed] = useState(false);
    const sizeClasses = size === "lg" ? "px-8 py-3 text-lg" : "px-4 py-2 text-sm";

    return (
      <button
        onClick={onClick}
        disabled={disabled}
        onMouseEnter={(e) => { if (!disabled && !isPressed) Object.assign(e.currentTarget.style, hover); }}
        onMouseLeave={(e) => { setIsPressed(false); Object.assign(e.currentTarget.style, base); }}
        onMouseDown={(e) => { if (!disabled) { setIsPressed(true); Object.assign(e.currentTarget.style, active); } }}
        onMouseUp={(e) => { if (!disabled) { setIsPressed(false); Object.assign(e.currentTarget.style, hover); } }}
        className={`font-bold transition-all duration-150 relative overflow-hidden ${sizeClasses}`}
        style={{ ...base, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.6 : 1 }}
      >
        <span style={{
          position: "absolute", inset: 0, borderRadius: "12px", pointerEvents: "none",
          background: "linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.2) 100%)",
        }} />
        <span className="relative z-10 flex items-center justify-center gap-2">
          {label}
        </span>
      </button>
    );
  }
}