const express = require('express');
const router = express.Router({ mergeParams: true});
const ExpressError = require('../utilities/expressError')
const Campground = require('../models/campground');
const reviews = require('../controllers/review.js')
const catchAsync = require('../utilities/catchAsync')
const Review = require('../models/review')
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware.js')


router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));
  
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.destroy));

module.exports = router