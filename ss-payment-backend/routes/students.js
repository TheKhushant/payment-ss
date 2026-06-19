const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');

const {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  deleteAllStudents,
  addNote
} = require('../controllers/studentController');

// All routes are protected (require login)
router.get('/', protect, getStudents);
router.get('/:id', protect, getStudent);
router.post('/', protect, createStudent);
router.put('/:id', protect, updateStudent);
router.post('/:id/notes', protect, addNote);
router.delete("/delete-all", deleteAllStudents);
router.put('/:id', updateStudent);
// Then this
router.delete("/:id", deleteStudent);

module.exports = router;