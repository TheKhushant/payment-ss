import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  createPayment,
  getStudentPayments,
} from "../services/paymentService";
import { getStudent } from "../services/studentService";
import { getInstallmentStatus, isPositiveInstallment } from "../utils/installmentUtils";

export default function AddPayment() {
  const { studentId } = useParams();

  const [student, setStudent] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("Cash");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);

      const studentData = await getStudent(studentId!);
      const paymentData = await getStudentPayments(studentId!);

      setStudent(studentData);
      setPayments(paymentData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setIsLoading(false); // ✅ Add this
    }
  };

  const handleSubmit = async () => {
    if (!amount || Number(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    try {
      await createPayment({
        studentId,
        amount: Number(amount),
        method,
        transactionId: `TXN-${Date.now()}`,
      });

      alert("Payment Added Successfully");
      await loadData();
      setAmount("");
    } catch (err) {
      console.error(err);
      alert("Failed to add payment");
    }
  };

  const lastPayment = payments.length > 0 ? payments[0] : null;

  const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const totalFee = student?.courseFee || student?.courseId?.fee || 0;
  const pendingAmount = totalFee - totalPaid;

  const upcomingInstallment = student?.installments?.find(
    (i: any) => isPositiveInstallment(i) && getInstallmentStatus(i) !== "paid"
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg font-medium text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 relative overflow-hidden" style={{
      background: "linear-gradient(135deg, #8B4513 0%, #A0522D 25%, #8B4513 50%, #6B3410 75%, #8B4513 100%)",
      boxShadow: "inset 0 0 60px rgba(0,0,0,0.5)",
    }}>
      {/* Leather texture overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='4' height='4' viewBox='0 0 4 4' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1h2v2H1z' fill='%23000' fill-opacity='0.3'/%3E%3C/svg%3E")`,
        backgroundSize: "3px 3px",
      }} />
      
      {/* Stitching border */}
      <div className="absolute inset-3 border-2 border-dashed border-yellow-700/40 rounded-xl pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="p-4 rounded-lg" style={{
            background: "linear-gradient(145deg, #B8860B, #DAA520, #B8860B)",
            boxShadow: "inset 2px 2px 5px rgba(255,255,255,0.4), inset -2px -2px 5px rgba(0,0,0,0.3), 3px 3px 8px rgba(0,0,0,0.4)",
            border: "1px solid #8B6914",
          }}>
            <h1 className="text-2xl font-bold" style={{
              color: "#4A3728",
              textShadow: "1px 1px 2px rgba(255,255,255,0.6), -1px -1px 1px rgba(0,0,0,0.3)",
            }}>
              Add Payment
            </h1>
            <p className="text-sm font-semibold mt-1" style={{
              color: "#5C4033",
              textShadow: "0 1px 1px rgba(255,255,255,0.4)",
            }}>
              Student Fee Management
            </p>
          </div>
          
          <div className="text-right p-3 rounded-lg" style={{
            background: "linear-gradient(145deg, #CD853F, #DEB887, #CD853F)",
            boxShadow: "inset 2px 2px 5px rgba(0,0,0,0.3), inset -2px -2px 5px rgba(255,255,255,0.2), 3px 3px 8px rgba(0,0,0,0.3)",
            border: "1px solid #8B4513",
          }}>
            <div className="text-xs font-bold uppercase" style={{ color: "#5C4033", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>Student ID</div>
            <div className="font-mono text-sm font-bold mt-1" style={{ color: "#3E2723", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>{studentId}</div>
          </div>
        </div>

        {student && (
          <div className="p-6 mb-6 relative" style={{
            background: "linear-gradient(145deg, #F5DEB3, #DEB887, #F5DEB3)",
            boxShadow: "8px 8px 16px rgba(0,0,0,0.4), -3px -3px 8px rgba(255,255,255,0.1), inset 1px 1px 3px rgba(255,255,255,0.3)",
            border: "1px solid rgba(0,0,0,0.2)",
            borderRadius: "16px",
          }}>
            <div style={{
              position: "absolute", inset: 0, borderRadius: "16px", pointerEvents: "none",
              background: "linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.15) 100%)",
            }} />
            
            <h2 className="text-xl font-bold mb-5 relative z-10" style={{
              color: "#4A3728",
              textShadow: "1px 1px 2px rgba(255,255,255,0.5)",
            }}>
              Student Details
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-4 text-sm relative z-10">
              <div><span className="font-bold" style={{ color: "#8B4513", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>Name:</span> <span className="font-bold" style={{ color: "#3E2723", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>{student.name}</span></div>
              <div><span className="font-bold" style={{ color: "#8B4513", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>Mobile:</span> <span className="font-bold" style={{ color: "#3E2723", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>{student.mobile}</span></div>
              <div><span className="font-bold" style={{ color: "#8B4513", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>Email:</span> <span className="font-bold" style={{ color: "#3E2723", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>{student.email}</span></div>
              <div><span className="font-bold" style={{ color: "#8B4513", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>College:</span> <span className="font-bold" style={{ color: "#3E2723", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>{student.college}</span></div>
              <div><span className="font-bold" style={{ color: "#8B4513", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>Course:</span> <span className="font-bold" style={{ color: "#3E2723", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>{student.courseId?.name}</span></div>
              <div>
                <span className="font-bold" style={{ color: "#8B4513", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>Status:</span>{" "}
                <span className="inline-flex px-3 py-0.5 rounded-full text-xs font-bold" style={{
                  background: student.status === "active" ? "linear-gradient(145deg, #48bb78, #68d391, #48bb78)" : "linear-gradient(145deg, #d69e2e, #ecc94b, #d69e2e)",
                  boxShadow: "inset 1px 1px 3px rgba(255,255,255,0.4), inset -1px -1px 3px rgba(0,0,0,0.2), 2px 2px 4px rgba(0,0,0,0.3)",
                  color: "#3E2723",
                  textShadow: "0 1px 1px rgba(255,255,255,0.5)",
                  border: "1px solid rgba(0,0,0,0.2)",
                }}>
                  {student.status}
                </span>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="mt-8 grid grid-cols-3 gap-4 relative z-10">
              <SummaryCard label="TOTAL FEE" value={`₹${totalFee.toLocaleString()}`} gradient={["#3182ce", "#63b3ed", "#3182ce"]} />
              <SummaryCard label="TOTAL PAID" value={`₹${totalPaid.toLocaleString()}`} gradient={["#38a169", "#68d391", "#38a169"]} />
              <SummaryCard label="PENDING" value={`₹${pendingAmount.toLocaleString()}`} gradient={["#c53030", "#fc8181", "#c53030"]} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6 text-sm relative z-10">
              {lastPayment && (
                <InfoCard title="Last Payment" data={[
                  { label: "Amount", value: `₹${lastPayment.amount}` },
                  { label: "Method", value: lastPayment.method },
                  { label: "Date", value: new Date(lastPayment.date).toLocaleDateString('en-IN') },
                ]} />
              )}

              {upcomingInstallment && (
                <InfoCard title="Upcoming Installment" data={[
                  { label: "Amount", value: `₹${upcomingInstallment.amount}` },
                  { label: "Status", value: getInstallmentStatus(upcomingInstallment), highlight: true },
                ]} />
              )}
            </div>
          </div>
        )}

        {/* Payment History */}
        {payments.length > 0 && (
          <div className="p-6 mb-6 relative" style={{
            background: "linear-gradient(145deg, #F5DEB3, #DEB887, #F5DEB3)",
            boxShadow: "8px 8px 16px rgba(0,0,0,0.4), -3px -3px 8px rgba(255,255,255,0.1), inset 1px 1px 3px rgba(255,255,255,0.3)",
            border: "1px solid rgba(0,0,0,0.2)",
            borderRadius: "16px",
          }}>
            <div style={{
              position: "absolute", inset: 0, borderRadius: "16px", pointerEvents: "none",
              background: "linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.15) 100%)",
            }} />
            
            <h3 className="text-xl font-bold mb-4 relative z-10" style={{
              color: "#4A3728",
              textShadow: "1px 1px 2px rgba(255,255,255,0.5)",
            }}>
              Payment History
            </h3>
            
            <div className="overflow-x-auto relative z-10">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: "2px solid #8B4513" }}>
                    <th className="py-3 text-left font-bold" style={{ color: "#6B3410", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>Date</th>
                    <th className="py-3 text-left font-bold" style={{ color: "#6B3410", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>Amount</th>
                    <th className="py-3 text-left font-bold" style={{ color: "#6B3410", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>Method</th>
                    <th className="py-3 text-left font-bold" style={{ color: "#6B3410", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>Transaction ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: "rgba(139,69,19,0.2)" }}>
                  {payments.map((payment: any) => (
                    <tr key={payment._id} className="hover:bg-white/30 transition-colors">
                      <td className="py-3 font-bold" style={{ color: "#3E2723", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>
                        {new Date(payment.date).toLocaleDateString('en-IN')}
                      </td>
                      <td className="py-3 font-bold" style={{ color: "#2F855A", textShadow: "1px 1px 2px rgba(0,0,0,0.2), 0 1px 1px rgba(255,255,255,0.5)" }}>
                        ₹{Number(payment.amount).toLocaleString()}
                      </td>
                      <td className="py-3 font-bold" style={{ color: "#3E2723", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>{payment.method}</td>
                      <td className="py-3 font-mono text-xs font-bold" style={{ color: "#8B4513", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>{payment.transactionId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add Payment Form */}
        <div className="p-6 relative" style={{
          background: "linear-gradient(145deg, #F5DEB3, #DEB887, #F5DEB3)",
          boxShadow: "8px 8px 16px rgba(0,0,0,0.4), -3px -3px 8px rgba(255,255,255,0.1), inset 1px 1px 3px rgba(255,255,255,0.3)",
          border: "1px solid rgba(0,0,0,0.2)",
          borderRadius: "16px",
        }}>
          <div style={{
            position: "absolute", inset: 0, borderRadius: "16px", pointerEvents: "none",
            background: "linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.15) 100%)",
          }} />
          
          <h3 className="text-xl font-bold mb-6 relative z-10" style={{
            color: "#4A3728",
            textShadow: "1px 1px 2px rgba(255,255,255,0.5)",
          }}>
            Record New Payment
          </h3>

          <div className="max-w-md space-y-5 relative z-10">
            <div>
              <label className="block text-xs font-bold uppercase mb-1.5" style={{
                color: "#6B3410",
                textShadow: "0 1px 1px rgba(255,255,255,0.5)",
                letterSpacing: "0.1em",
              }}>
                PAYMENT AMOUNT (₹)
              </label>
              <input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-xl px-4 py-3 text-lg font-bold"
                style={{
                  background: "linear-gradient(145deg, #DEB887, #F5DEB3, #DEB887)",
                  boxShadow: "inset 3px 3px 6px rgba(0,0,0,0.3), inset -1px -1px 3px rgba(255,255,255,0.5), 2px 2px 5px rgba(0,0,0,0.2)",
                  border: "1px solid rgba(0,0,0,0.2)",
                  color: "#3E2723",
                  textShadow: "0 1px 1px rgba(255,255,255,0.5)",
                }}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-1.5" style={{
                color: "#6B3410",
                textShadow: "0 1px 1px rgba(255,255,255,0.5)",
                letterSpacing: "0.1em",
              }}>
                PAYMENT METHOD
              </label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full rounded-xl px-4 py-3 text-base font-bold"
                style={{
                  background: "linear-gradient(145deg, #DEB887, #F5DEB3, #DEB887)",
                  boxShadow: "inset 3px 3px 6px rgba(0,0,0,0.3), inset -1px -1px 3px rgba(255,255,255,0.5), 2px 2px 5px rgba(0,0,0,0.2)",
                  border: "1px solid rgba(0,0,0,0.2)",
                  color: "#3E2723",
                  textShadow: "0 1px 1px rgba(255,255,255,0.5)",
                }}
              >
                <option value="Cash" style={{ background: "#F5DEB3" }}>Cash</option>
                <option value="UPI" style={{ background: "#F5DEB3" }}>UPI</option>
                <option value="Bank Transfer" style={{ background: "#F5DEB3" }}>Bank Transfer</option>
              </select>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-base transition-all duration-150 relative overflow-hidden"
              style={{
                background: isLoading
                  ? "linear-gradient(145deg, #718096, #A0AEC0, #718096)"
                  : "linear-gradient(145deg, #22543d, #276749, #22543d)",
                boxShadow: isLoading
                  ? "inset 2px 2px 5px rgba(0,0,0,0.3), inset -1px -1px 3px rgba(255,255,255,0.2)"
                  : "5px 5px 10px rgba(0,0,0,0.4), -2px -2px 5px rgba(255,255,255,0.1), inset 1px 1px 2px rgba(255,255,255,0.2)",
                border: "1px solid rgba(0,0,0,0.3)",
                color: isLoading ? "#4A5568" : "#E2E8F0",
                textShadow: isLoading ? "none" : "1px 1px 2px rgba(0,0,0,0.8)",
                transform: isLoading ? "translateY(1px)" : "translateY(0)",
                cursor: isLoading ? "not-allowed" : "pointer",
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.background = "linear-gradient(145deg, #276749, #38a169, #276749)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "6px 6px 12px rgba(0,0,0,0.5), -2px -2px 5px rgba(255,255,255,0.15), inset 1px 1px 2px rgba(255,255,255,0.3)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.background = "linear-gradient(145deg, #22543d, #276749, #22543d)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "5px 5px 10px rgba(0,0,0,0.4), -2px -2px 5px rgba(255,255,255,0.1), inset 1px 1px 2px rgba(255,255,255,0.2)";
                }
              }}
              onMouseDown={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = "translateY(2px)";
                  e.currentTarget.style.boxShadow = "inset 3px 3px 6px rgba(0,0,0,0.4), inset -1px -1px 3px rgba(255,255,255,0.2)";
                }
              }}
              onMouseUp={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "6px 6px 12px rgba(0,0,0,0.5), -2px -2px 5px rgba(255,255,255,0.15), inset 1px 1px 2px rgba(255,255,255,0.3)";
                }
              }}
            >
              <span style={{
                position: "absolute", inset: 0, borderRadius: "12px", pointerEvents: "none",
                background: "linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.2) 100%)",
              }} />
              <span className="relative z-10 flex items-center gap-2">
                {isLoading && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" style={{ filter: "drop-shadow(1px 1px 1px rgba(0,0,0,0.5))" }} />
                )}
                {isLoading ? "Saving..." : "Save Payment"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  function SummaryCard({ label, value, gradient }: { label: string; value: string; gradient: string[] }) {
    return (
      <div className="p-4 rounded-xl relative overflow-hidden" style={{
        background: `linear-gradient(145deg, ${gradient[0]}, ${gradient[1]}, ${gradient[0]})`,
        boxShadow: "inset 2px 2px 5px rgba(255,255,255,0.4), inset -2px -2px 5px rgba(0,0,0,0.3), 4px 4px 8px rgba(0,0,0,0.3)",
        border: "1px solid rgba(0,0,0,0.2)",
      }}>
        <div style={{
          position: "absolute", inset: 0, borderRadius: "12px", pointerEvents: "none",
          background: "linear-gradient(180deg, rgba(255,255,255,0.25) 0%, transparent 50%, rgba(0,0,0,0.2) 100%)",
        }} />
        <div className="text-xs font-bold uppercase relative z-10" style={{
          color: "rgba(255,255,255,0.9)",
          textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
          letterSpacing: "0.1em",
        }}>
          {label}
        </div>
        <div className="text-2xl font-bold mt-1 relative z-10" style={{
          color: "#fff",
          textShadow: "2px 2px 4px rgba(0,0,0,0.5), 0 1px 1px rgba(255,255,255,0.3)",
        }}>
          {value}
        </div>
      </div>
    );
  }

  function InfoCard({ title, data }: { title: string; data: { label: string; value: string; highlight?: boolean }[] }) {
    return (
      <div className="p-4 rounded-xl relative overflow-hidden" style={{
        background: "linear-gradient(145deg, #DEB887, #F5DEB3, #DEB887)",
        boxShadow: "3px 3px 6px rgba(0,0,0,0.3), -1px -1px 3px rgba(255,255,255,0.2), inset 1px 1px 2px rgba(255,255,255,0.3)",
        border: "1px solid rgba(0,0,0,0.15)",
      }}>
        <div style={{
          position: "absolute", inset: 0, borderRadius: "12px", pointerEvents: "none",
          background: "linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)",
        }} />
        <h3 className="font-bold mb-3 relative z-10" style={{
          color: "#4A3728",
          textShadow: "1px 1px 2px rgba(255,255,255,0.5)",
        }}>
          {title}
        </h3>
        <div className="space-y-2 relative z-10">
          {data.map((item, idx) => (
            <div key={idx} className="flex justify-between">
              <span className="font-bold" style={{ color: "#8B4513", textShadow: "0 1px 1px rgba(255,255,255,0.5)" }}>{item.label}</span>
              <span className="font-bold" style={{
                color: item.highlight ? "#C05621" : "#3E2723",
                textShadow: item.highlight ? "1px 1px 2px rgba(0,0,0,0.2)" : "0 1px 1px rgba(255,255,255,0.5)",
              }}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
}