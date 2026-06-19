const getInstallmentStatus = (installment) => {
  if (!installment) return "upcoming";

  if (installment.status === "paid") {
    return "paid";
  }

  return new Date(installment.dueDate) < new Date()
    ? "overdue"
    : "upcoming";
};

const isPositiveInstallment = (installment) =>
  Number(installment?.amount || 0) > 0;

module.exports = {
  getInstallmentStatus,
  isPositiveInstallment,
};
