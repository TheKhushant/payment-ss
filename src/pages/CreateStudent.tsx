import { useState } from "react";
import api from "../api/api";

export default function CreateStudent() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
  });

  const submitHandler = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      await api.post("/students", form);

      alert("Student Created");

      setForm({
        name: "",
        email: "",
        mobile: "",
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form
      onSubmit={submitHandler}
      className="bg-white p-6 rounded-xl shadow"
    >
      <h2 className="text-xl font-bold mb-4">
        Create Student
      </h2>

      <input
        className="border p-2 w-full mb-3"
        placeholder="Name"
        value={form.name}
        onChange={(e) =>
          setForm({
            ...form,
            name: e.target.value,
          })
        }
      />

      <input
        className="border p-2 w-full mb-3"
        placeholder="Email"
        value={form.email}
        onChange={(e) =>
          setForm({
            ...form,
            email: e.target.value,
          })
        }
      />

      <input
        className="border p-2 w-full mb-3"
        placeholder="Mobile"
        value={form.mobile}
        onChange={(e) =>
          setForm({
            ...form,
            mobile: e.target.value,
          })
        }
      />

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Save
      </button>
    </form>
  );
}