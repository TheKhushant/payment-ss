import api from "../api/api";

export const getPayments = async () => {
  const response = await api.get("/payments");
  return response.data;
};

export const createPayment = async (paymentData: any) => {
  const response = await api.post("/payments", paymentData);
  return response.data;
};

export const getStudentPayments = async (studentId: string) => {
  const response = await api.get(
    `/payments/student/${studentId}`
  );

  return response.data;
};