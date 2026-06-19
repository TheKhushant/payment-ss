export const getInstallmentStatus = (installment: any) => {
  if (!installment) return "upcoming";

  if (installment.status === "paid") {
    return "paid";
  }

  const dueDate = installment.dueDate ? new Date(installment.dueDate) : null;
  const now = new Date();

  if (!dueDate || Number.isNaN(dueDate.getTime())) {
    return "upcoming";
  }

  return dueDate < now ? "overdue" : "upcoming";
};

export const isPositiveInstallment = (installment: any) =>
  Number(installment?.amount || 0) > 0;
