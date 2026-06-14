import api from "../api/api";

export const getPayments = async () => {
  const response = await api.get("/payments");
  return response.data;
};