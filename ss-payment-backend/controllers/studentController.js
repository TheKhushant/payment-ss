// studentController.js
const Student = require('../models/Student');
const Course = require('../models/Course');
const Payment = require('../models/Payment');
const { getInstallmentStatus, isPositiveInstallment } = require('../utils/installmentUtils');

exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find().populate('courseId', 'name duration fee');
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(student);
  } catch (err) {
    res.status(500).json({
      message: 'Server Error'
    });
  }
};

exports.getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('courseId', 'name duration fee');
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createStudent = async (req, res) => {
  try {

    const {
      firstPaymentAmount,
      paymentMethod,
      ...studentData
    } = req.body;

    const student = await Student.create(studentData);

    // First payment auto create
    if (
      firstPaymentAmount &&
      Number(firstPaymentAmount) > 0
    ) {

      await Payment.create({
        studentId: student._id,
        amount: Number(firstPaymentAmount),
        method: paymentMethod || "Cash",
        transactionId: `TXN-${Date.now()}`
      });

      // Mark installment paid
      let remaining = Number(firstPaymentAmount);

      for (let installment of student.installments) {

        if (remaining <= 0) break;

        if (!isPositiveInstallment(installment))
          continue;

        if (getInstallmentStatus(installment) === "paid")
          continue;

        if (installment.amount <= remaining) {

          installment.status = "paid";
          installment.paidDate = new Date();
          installment.whatsappSent = false;

          remaining -= installment.amount;

        } else {

          installment.amount -= remaining;
          remaining = 0;
        }
      }

      await student.save();
    }

    res.status(201).json(student);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message
    });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addNote = async (req, res) => {
  try {
    const { text } = req.body;
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    student.notes.push({ text });
    await student.save();
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteAllStudents = async (req, res) => {
  try {
    const result = await Student.deleteMany({});

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} students deleted successfully`,
    });
  } catch (error) {
    console.error("DELETE ALL ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};