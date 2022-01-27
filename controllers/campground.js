const Campground = require('../models/campground');

module.exports.index = async (req,res) => {
    const campgrounds =  await Campground.find({})
    res.render('campgrounds/index', {campgrounds})
}

module.exports.renderNewForm = (req,res) => {
    res.render('campgrounds/new')
};

module.exports.createCampground = async (req,res) => {
    // server side schema validation with JOI 
    const campground = new Campground(req.body.campground)
    campground.author = req.user._id
    await campground.save() 
    req.flash('success', "Successfully made a new campground");
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.showCampground = async (req,res) => {
    const {id} = req.params;
    const campground =  await Campground.findById(id).populate({
      path: 'reviews',
      populate: { 
        path: 'author'
      }
    }).populate('author');
    if(!campground){
      req.flash('error', 'Cannot find campground')
      return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show.ejs',{ campground })
};

module.exports.renderEditForm = async (req,res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id) 
    res.render('campgrounds/edit', {campground})
};

module.exports.updateCampground = async (req,res) => {
    const {id} = req.params;
    const {title, location} = req.body.campground; 
    const campground  = await Campground.findByIdAndUpdate(id, {title: title, location: location});
    req.flash('success', "Successfully update campground")
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.destroy = async (req,res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
}