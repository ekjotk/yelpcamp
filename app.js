if(process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const session = require('express-session');
const ExpressError = require('./utilities/expressError')
const engine = require('ejs-mate')
const {campgroundSchema, reviewSchema} = require('./schemas')
const catchAsync = require('./utilities/catchAsync')
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const flash = require('connect-flash')
const path = require('path')
const passport = require('passport');
const LocalStratergy = require('passport-local')
const User = require('./models/user.js')
const userRoutes = require('./routes/users')

async function connect() {
  mongoose.connect("mongodb://localhost:27017/yelp-camp",
  ).then(() => {
    console.log("Database connected!");
  });
}

connect().catch((err) => {
  console.log(err);
});

const app = express();
app.engine('ejs', engine);
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, "views"))
app.use(methodOverride('_method'))
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, 'public')))
app.use(flash())
const sessionConfig = {
  secret: 'thisshouldbeabettersecret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpsOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}
app.use(session(sessionConfig))

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate()));

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
      const msg = error.details.map(el => el.message).join(',')
      throw new ExpressError(msg, 400)
  } else {
      next();
  }
}

app.use((req,res, next) => {
  res.locals.currentUser = req.user
  res.locals.success = req.flash('success')
  res.locals.error = req.flash('error')
  next()
})

app.get('/fakeUser',async function(req,res) {
  const user = new User({email: 'colttt@gmail.com', username: 'ekjotisamazingggl'});
  const newUser = await User.register(user, 'ekjotdabest');
  res.send(newUser);
})

const campgrounds = require('./routes/campgrounds')
const reviews = require('./routes/reviews')
app.use('/', userRoutes)
app.use('/campgrounds', campgrounds)
app.use('/campgrounds/:id/reviews', reviews)

app.get('/', (req,res) => {
    res.render('home.ejs')
})



app.all('*', (req,res,next) => {
  next(new ExpressError('Page not found!!', 404))
})

app.use((err,req,res,next) => {
  const {statusCode = 500} = err;
  if(!err.message) err.message = "oh no!, something went wrong"
  res.status(statusCode).render("error", { err })
  return res.send("ERROROROROROROR")
})

app.listen(3000, (req,res) => {
    console.log('Server started on port 3000')
})

