const mongoose = require('mongoose');
const path = require('path');
const Campground = require('../models/campground')
const cities = require('./cities');
const {places, descriptors} = require('./seedhelpers')

async function connect() {
    mongoose.connect("mongodb://localhost:27017/yelp-camp").then(() => {
      console.log("Database connected!");
    });
  }
  
  connect().catch((err) => {
    console.log(err);
  });

const random = array => array[Math.floor(Math.random()* array.length)];
 
const seedDb = async () => {
    await Campground.deleteMany({});
    for(let i = 0; i < 50; i++) {
        const price = Math.floor(Math.random() * 1000);
        const randomCity = random(cities)
        const randomDescriptor = random(descriptors)
        const randomPlace = random(places) 
        const camp = new Campground({
            author: '61dd64c95576a08f67d28b17',
            location: `${randomCity.city},${randomCity.state}`,
            title: `${randomDescriptor} ${randomPlace}`,
            image: 'https://source.unsplash.com/collection/483251',
            description: 'Lorem ipsum',
            price: price
          })
        await camp.save()
    }
};

seedDb();