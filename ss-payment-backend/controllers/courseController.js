const Course = require('../models/Course');

exports.getCourses = async (req, res) => {
  const courses = await Course.find();
  res.json(courses);
};

exports.createCourse = async (req, res) => {
  const course = await Course.create(req.body);
  res.status(201).json(course);
};

exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    res.json(course);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.deleteCourse = async (req, res) => {
  const course = await Course.findByIdAndDelete(req.params.id);

  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

  res.json({ message: "Course deleted successfully" });
};