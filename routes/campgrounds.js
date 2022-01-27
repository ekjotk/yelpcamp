const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../cloudinary/index');
const upload = multer({storage})  

const { isLoggedIn, isAuthor } = require('../middleware.js');
const Campground = require('../models/campground');
const campgrounds = require('../controllers/campground')
const ExpressError = require('../utilities/expressError')
const Review = require('../models/review')
const catchAsync = require('../utilities/catchAsync');

router.get('/new', isLoggedIn, (campgrounds.renderNewForm))
router.get('/:id/edit',isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));


router.route('/')
    .get(catchAsync(campgrounds.index))
    // .post(isLoggedIn, catchAsync(campgrounds.createCampground));
    .post(upload.array('image'), catchAsync((req,res) => {
        console.log(req.body, req.files)
        res.send('Enter!')
    }))

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.destroy))
    .put(isLoggedIn, isAuthor, catchAsync(campgrounds.updateCampground));

module.exports = router