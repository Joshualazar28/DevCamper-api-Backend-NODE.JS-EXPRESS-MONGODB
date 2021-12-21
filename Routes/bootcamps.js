const express = require('express')

const { getBootcamp, getBootcamps, createBootcamp, updateBootcamp, deleteBootcamp, getBootcampsInRadius, bootcampPhotoUpload } = require('../Controllers/bootcamps')
const Bootcamp = require('../models/bootcamp')
const advancedResults = require('../Middleware/advancedResults')
const { protect, authorize } = require('../Middleware/auth')

// Incude other resousre routers
const coursesRouter = require('./courses')
const reviewRouter = require('./reviews');


const router = express.Router()

// Re-route into other resousre routers 

router.use('/:bootcampId/courses', coursesRouter)
router.use('/:bootcampId/reviews', reviewRouter);


router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

router.route('/')
    .get(advancedResults(Bootcamp, 'Courses'), getBootcamps)
    .post(protect, authorize('publisher', 'admin'), createBootcamp)


router.route('/:id')
    .get(getBootcamp)
    .put(protect, authorize('publisher', 'admin'), updateBootcamp)
    .delete(protect, authorize('publisher', 'admin'), deleteBootcamp)

router.route('/:id/photo').put(authorize('publisher', 'admin'), bootcampPhotoUpload)


// router.get('/', (req, res) => {

//      res.status(200).json({ sucess: true, msg: "Show all bootcamps" })
// });

// router.get('/:id', (req, res) => {

//     res.status(200).json({ sucess: true, msg: `show bootcamps ${req.params.id}` })
// });

// router.post('/', (req, res) => {

//     res.status(200).json({ sucess: true, msg: "create a new bootcamp" })
// });

// router.put('/:id', (req, res) => {

//     res.status(200).json({ sucess: true, msg: `update bootcamps ${req.params.id}` })
// });

// router.delete('/:id', (req, res) => {

//     res.status(200).json({ sucess: true, msg: `Delete bootcamps ${req.params.id}` })
// });

module.exports = router