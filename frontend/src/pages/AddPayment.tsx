import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  createPayment,
  getStudentPayments,
} from "../services/paymentService";

import {
  getStudent,
} from "../services/studentService";

export default function AddPayment() {
  const { studentId } = useParams();

  const [student, setStudent] = useState<any>(null);
    const [payments, setPayments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("Cash");

  useEffect(() => {
    loadData();
    }, []);

    const loadData = async () => {
    try {
        const studentData = await getStudent(studentId!);

        const paymentData =
        await getStudentPayments(studentId!);

        setStudent(studentData);
        setPayments(paymentData);
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
    };

  const handleSubmit = async () => {
    try {
      await createPayment({
        studentId,
        amount: Number(amount),
        method,
        transactionId: `TXN-${Date.now()}`
      });

      alert("Payment Added Successfully");
        await loadData();
        setAmount("");
    } catch (err) {
      console.error(err);
      alert("Failed to add payment");
    }
  };
  const lastPayment =
  payments.length > 0 ? payments[0] : null;

    const totalPaid = payments.reduce(
    (sum, p) => sum + Number(p.amount || 0),
    0
    );

    const totalFee =
    student?.courseFee ||
    student?.courseId?.fee ||
    0;

    const pendingAmount =
    totalFee - totalPaid;

    const upcomingInstallment =
    student?.installments?.find(
        (i: any) => i.status !== "paid"
    );
    if (loading) {
    return (
        <div className="p-6">
        Loading...
        </div>
    );
    }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-5">
        Add Payment
        </h1>

        {student && (
        <div className="bg-white shadow rounded-xl p-5 mb-6">

            <h2 className="text-xl font-bold mb-4">
            Student Details
            </h2>

            <div className="grid grid-cols-2 gap-3">

            <p><strong>Name:</strong> {student.name}</p>

            <p><strong>Mobile:</strong> {student.mobile}</p>

            <p><strong>Email:</strong> {student.email}</p>

            <p><strong>College:</strong> {student.college}</p>

            <p>
                <strong>Course:</strong>
                {" "}
                {student.courseId?.name}
            </p>

            <p>
                <strong>Status:</strong>
                {" "}
                {student.status}
            </p>

            <p>
                <strong>Total Fee:</strong>
                ₹{totalFee}
            </p>

            <p>
                <strong>Total Paid:</strong>
                ₹{totalPaid}
            </p>

            <p className="text-red-600">
                <strong>Pending:</strong>
                ₹{pendingAmount}
            </p>

            </div>

            {lastPayment && (
            <div className="mt-5 border-t pt-4">

                <h3 className="font-semibold mb-2">
                Last Payment
                </h3>

                <p>
                Amount:
                ₹{lastPayment.amount}
                </p>

                <p>
                Method:
                {lastPayment.method}
                </p>

                <p>
                Date:
                {new Date(
                    lastPayment.date
                ).toLocaleDateString()}
                </p>

            </div>
            )}

            {upcomingInstallment && (
            <div className="mt-5 border-t pt-4">

                <h3 className="font-semibold mb-2">
                Upcoming Payment
                </h3>

                <p>
                Amount:
                ₹{upcomingInstallment.amount}
                </p>

                <p>
                Status:
                {upcomingInstallment.status}
                </p>

            </div>
            )}

        </div>
        )}

        {payments.length > 0 && (
            <div className="bg-white rounded-xl shadow p-5 mb-6">

                <h3 className="font-bold mb-3">
                Payment History
                </h3>

                <table className="w-full">

                <thead>
                    <tr>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Method</th>
                    </tr>
                </thead>

                <tbody>

                    {payments.map((payment: any) => (
                    <tr key={payment._id}>

                        <td>
                        {new Date(
                            payment.date
                        ).toLocaleDateString()}
                        </td>

                        <td>
                        ₹{payment.amount}
                        </td>

                        <td>
                        {payment.method}
                        </td>

                    </tr>
                    ))}

                </tbody>

                </table>

            </div>
            )}

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="border p-3 rounded w-full mb-4"
      />

      <select
        value={method}
        onChange={(e) => setMethod(e.target.value)}
        className="border p-3 rounded w-full mb-4"
      >
        <option>Cash</option>
        <option>UPI</option>
        <option>Bank Transfer</option>
      </select>

      <button
        onClick={handleSubmit}
        className="bg-green-600 text-white px-5 py-3 rounded"
      >
        Save Payment
      </button>
    </div>
  );
}