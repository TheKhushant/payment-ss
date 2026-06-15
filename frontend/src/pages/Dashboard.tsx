import { useEffect, useState } from "react";
import { getStudents } from "../services/studentService";
import { getPayments } from "../services/paymentService";
import { getCourses } from "../services/courseService";

export default function Dashboard() {
  const [students, setStudents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const studentData = await getStudents();
      const paymentData = await getPayments();
      const courseData = await getCourses();

      setStudents(studentData);
      setPayments(paymentData);
      setCourses(courseData);
    } catch (err) {
      console.log(err);
    }
  };

  const totalRevenue = payments.reduce(
    (sum: number, payment: any) =>
      sum + Number(payment.amount || 0),
    0
  );

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Dashboard
      </h1>

      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl shadow">
          <p>Total Students</p>
          <h2 className="text-2xl font-bold">
            {students.length}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p>Total Revenue</p>
          <h2 className="text-2xl font-bold">
            ₹{totalRevenue}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p>Payments</p>
          <h2 className="text-2xl font-bold">
            {payments.length}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p>Courses</p>
          <h2 className="text-2xl font-bold">
            {courses.length}
          </h2>
        </div>
      </div>
    </div>
  );
}