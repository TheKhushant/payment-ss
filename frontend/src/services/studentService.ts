const API_URL = "http://localhost:5000/api/students";
import axios from "axios";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};



export const createStudent = async (data: any) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to create student");
  }
  return res.json();
};

export const getStudent = async (id: string) => {
  const res = await fetch(`${API_URL}/${id}`, { headers: getAuthHeaders(), credentials: "include" });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to fetch student");
  }
  return res.json();
};



export const updateStudent = async (id: string, data: any) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    credentials: "include",
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to update student");
  }
  return res.json();
};

export const deleteStudent = async (id: string) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
    credentials: "include",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to delete student");
  }
  return res.json();
};

export const getStudentById = async (id: string) => {
  const res = await fetch(`${API_URL}/${id}`, {
    headers: getAuthHeaders(),
    credentials: "include",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to fetch student");
  }

  return res.json();
};

export const getStudents = async () => {
  const res = await fetch(API_URL, {
    headers: getAuthHeaders(),
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch students");
  }

  return res.json();
};



export const deleteAllStudents = async () => {
  const response = await axios.delete(
    "http://localhost:5000/api/students/delete-all",
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};