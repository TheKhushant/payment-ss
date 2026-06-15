// studentController.js
const Student = require('../models/Student');
const Course = require('../models/Course');

exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find().populate('courseId', 'name duration fee');
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
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
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
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