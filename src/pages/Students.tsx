import { useEffect, useState } from "react";
import { getStudents } from "../services/studentService";

export default function Students() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    const data = await getStudents();
    setStudents(data);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-5">
        Students
      </h1>

      <div className="bg-white rounded-xl shadow">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Mobile</th>
            </tr>
          </thead>

          <tbody>
            {students.map((student: any) => (
              <tr
                key={student._id}
                className="border-b"
              >
                <td className="p-3">
                  {student.name}
                </td>

                <td className="p-3">
                  {student.email}
                </td>

                <td className="p-3">
                  {student.mobile}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}