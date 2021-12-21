const path = require('path');
const ErrorResponse = require('../utils/ errorResponse')
const asyncHandler = require('../Middleware/async')
const Bootcamp = require('../models/bootcamp')
const geocoder = require('../utils/geocoder')





// asyncHandler 

// @desc    Get all bootcamps
// @Routes  Get /api/v1/bootcamps
// @acess   Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {

    res.status(200).json(res.advancedResults)

})





// @desc    Get Single bbootcamps
// @Routes  Get /api/v1/bootcamps/:id
// @acess   Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.findById(req.params.id)
    res.status(200).json({ sucess: true, data: bootcamp })

    if (!bootcamp)
    {
        next(new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 400))

    }

})



// @desc    Create new bootcamp
// @Routes  post /api/v1/bootcamps
// @acess   Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {

    // Add user to req,body
    req.body.user = req.user.id

    // check for published  bootcamp 
    const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id })

    // if the  user is not an admin , they  can only add one bootcamp
    if (publishedBootcamp && req.user.role !== 'admin')
    {
        return next(new ErrorResponse(`The  user  with  ID ${req.user.id}  has already published a bootcamp`, 400))
    }

    const bootcamp = await Bootcamp.create(req.body);

    res.status(200).json({
        success: true,
        data: bootcamp
    });

})


// @desc      Update bootcamp
// @route     PUT /api/v1/bootcamps/:id
// @access    Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
    let bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp)
    {
        return next(
            new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
        );
    }

    // Make sure user is bootcamp owner
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin')
    {
        return next(
            new ErrorResponse(
                `User ${req.user.id} is not authorized to update this bootcamp`,
                401
            )
        );
    }

    bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({ success: true, data: bootcamp });
});









// @desc    Delete bootcamp
// @Routes  Delete /api/v1/bootcamps/:id 
// @acess   Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp)
    {
        return res.status(400).json({ sucess: false })
    }

    // Make sure user is bootcamp owner
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin')
    {
        return next(
            new ErrorResponse(
                `User ${req.user.id} is not authorized to delete  this bootcamp`,
                401
            )
        );
    }
    bootcamp.remove()
    res.status(200).json({
        success: true,
        data: {}
    });


})









// @desc      Upload photo for bootcamp
// @route     PUT /api/v1/bootcamps/:id/photo
// @access    Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp)
    {
        return next(
            new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
        );
    }


    if (!req.files)
    {
        return next(new ErrorResponse(`Please upload a file`, 400));
    }

    const file = req.files.file;

    // Make sure the image is a photo
    if (!file.mimetype.startsWith('image'))
    {
        return next(new ErrorResponse(`Please upload an image file`, 400));
    }

    // Check filesize
    if (file.size > process.env.MAX_FILE_UPLOAD)
    {
        return next(
            new ErrorResponse(
                `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
                400
            )
        );
    }

    // Create custom filename
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if (err)
        {
            console.error(err);
            return next(new ErrorResponse(`Problem with file upload`, 500));
        }

        await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

        res.status(200).json({
            success: true,
            data: file.name
        });
    });
});








// @desc      Get bootcamps within a radius
// @route     GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access    Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
    const { zipcode, distance } = req.params;

    // Get lat/lng from geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    // Calc radius using radians
    // Divide dist by radius of Earth
    // Earth Radius = 3,963 mi / 6,378 km
    const radius = distance / 3963;

    const bootcamps = await Bootcamp.find({
        location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
    });

    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    });
});

// // @desc    Get all bootcamps
// // @Routes  Get /api/v1/bootcamps
// // @acess   Public
// exports.getBootcamps = async (req, res, next) => {
//     try
//     {
//         const bootcamps = await Bootcamp.find()
//         res.status(200).json({ sucess: true, data: bootcamps })

//     }
//     catch (error)
//     {
//         res.status(400).json({ sucess: false })

//     }


// }



// // @desc    Get Single bootcamps
// // @Routes  Get /api/v1/bootcamps/:id
// // @acess   Public
// exports.getBootcamp = async (req, res, next) => {
//     try
//     {
//         const bootcamp = await Bootcamp.findById(req.params.id)
//         res.status(200).json({ sucess: true, data: bootcamp })

//         if (!bootcamp)
//         {
//             next(new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 400))

//         }
//     }
//     catch (err)
//     {
//         // res.status(400).json({ sucess: false })
//         next(err)
//         // next(new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 400))
//     }
// }



// // @desc    Create new bootcamp
// // @Routes  post /api/v1/bootcamps
// // @acess   Private
// exports.createBootcamp = async (req, res, next) => {

//     try
//     {
//         const bootcamp = await Bootcamp.create(req.body);

//         res.status(200).json({
//             success: true,
//             data: bootcamp
//         });
//     }
//     catch (err)
//     {

//         // res.status(400).json({ sucess: false, error: err.message })
//         next(err)
//     }
// }





// // @desc    Update bootcamp
// // @Routes  put /api/v1/bootcamps/:id 
// // @acess   Private
// exports.updateBootcamp = async (req, res, next) => {

//     try
//     {
//         const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
//             new: true,
//             runvalidator: true
//         });
//         if (!bootcamp)
//         {
//             return res.status(400).json({ sucess: false })
//         }
//         res.status(200).json({
//             success: true,
//             data: bootcamp
//         });
//     }
//     catch (error)
//     {

//         return res.status(400).json({ sucess: false })

//     }
// }


// // @desc    Delete bootcamp
// // @Routes  Delete /api/v1/bootcamps/:id 
// // @acess   Private
// exports.deleteBootcamp = async (req, res, next) => {
//     try
//     {


//         const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
//         if (!bootcamp)
//         {
//             return res.status(400).json({ sucess: false })
//         }
//         res.status(200).json({
//             success: true,
//             data: {}
//         });

//     }
//     catch (error)
//     {

//     }


// }