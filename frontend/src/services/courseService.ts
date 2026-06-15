const API_URL = "http://localhost:5000/api/courses";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const getCourses = async () => {
  const res = await fetch(API_URL, { headers: getAuthHeaders(), credentials: "include" });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to fetch courses");
  }
  return res.json();
};