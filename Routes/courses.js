const express = require('express')

const { getCourses, getCourse, addCourse, updateCourse, deleteCourse } = require('../Controllers/courses')

const router = express.Router({ mergeParams: true });
const { protect, authorize } = require('../middleware/auth');

router.route('/').get(getCourses).post(protect, authorize('publisher', 'admin'), addCourse)

router
    .route('/:id')
    .get(getCourse)
    .put(protect, authorize('publisher', 'admin'), updateCourse)
    .delete(protect, authorize('publisher', 'admin'), deleteCourse);




module.exports = router
