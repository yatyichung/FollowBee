//current problem: need to type in the exact same location twice before it shows result


//IMPORT MODULES
const express = require('express')
const path = require("path") 
const axios = require("axios")
const { response } = require('express')

const app = express() 
const port = process.env.PORT || 8000


//set up Pug template engine & import files from views folder
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "pug")

//set up path for custome CSS
app.use(express.static(path.join(__dirname,"public")))
app.use(express.static('images')); 

//set default input, will be replace with user's input
var inputCity = 'Toronto';
var cityLatitude = '43.651070';
var cityLongitude = '-79.347015';

var hotels;
var attractions;

//set up page routes
app.get("/", (req,res) => {
  //get input from user
  inputCity = req.query.city;
  console.log(inputCity)
  getResult(res);
})


//set up local host
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`)
})


// //=======FUNCTIONS==========
async function getResult(res)
{
  
  //====GEOCODING====
  //use Forward Reverse Geocoding api to change the input (city) into latitude and longtitude
  //reference: https://rapidapi.com/GeocodeSupport/api/forward-reverse-geocoding/
  const firstRequest = {
    method: 'GET',
    url: 'https://forward-reverse-geocoding.p.rapidapi.com/v1/forward',
    params: {city: `${inputCity}`, 'accept-language': 'en', polygon_threshold: '0.0'},
    headers: {
      'X-RapidAPI-Key': '9d5bd35d8dmsh676b10602651945p167251jsn7bbe4e7e72d5',
      'X-RapidAPI-Host': 'forward-reverse-geocoding.p.rapidapi.com'
    }
  };
  
  await axios.request(firstRequest).then(function (response) {
      cityLatitude = response.data[0].lat;
      cityLongitude = response.data[0].lon;
      console.log(response.data[0].lat);
      console.log(response.data[0].lon);
    }).catch(function (error) {
  });    

  //====HOTELS====
  //use book.com api to fetch nearby hotels; reference https://rapidapi.com/tipsters/api/booking-com/
  /* DEFAULT IS SET AS TORONTO */
  const secondRequest = {
    method: 'GET',
    url: 'https://booking-com.p.rapidapi.com/v1/hotels/search-by-coordinates',
    params: {
      order_by: 'distance',
      adults_number: '1',
      units: 'metric',
      room_number: '1',
      checkout_date: '2022-10-01',
      filter_by_currency: 'CAD',
      locale: 'en-us',
      checkin_date: '2022-09-30',
      latitude: `${cityLatitude}`,
      // latitude: '43.651070',
      longitude: `${cityLongitude}`,
      // longitude: '-79.347015',
      page_number: '1'
    },
    headers: {
      'X-RapidAPI-Key': '9d5bd35d8dmsh676b10602651945p167251jsn7bbe4e7e72d5',
      'X-RapidAPI-Host': 'booking-com.p.rapidapi.com'
    }
  };
    
  await axios.request(secondRequest).then(function (response) {
    // res.render('index', { title: "Home", hotels: response.data.result})
    // console.log(response.data.result)
    hotels = response.data.result;
  }).catch(function (error) {
      console.error(error);
  });

  //====ATTRACTIONS====
  //use Travel Advisor api to fetch nearby attractions/places; reference https://rapidapi.com/apidojo/api/travel-advisor/
  const thirdRequest = {
    method: 'GET',
    url: 'https://travel-advisor.p.rapidapi.com/attractions/list-by-latlng',
    params: {
      longitude:`${cityLongitude}`,
      latitude: `${cityLatitude}`,
      lunit: 'km',
      currency: 'CAD',
      limit: '16',
      lang: 'en_US',
      offset: '30'
    },
    headers: {
      'X-RapidAPI-Key': '9d5bd35d8dmsh676b10602651945p167251jsn7bbe4e7e72d5',
      'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com'
    }
  };
  
  await axios.request(thirdRequest).then(function (response) {
    attractions = response.data.data;
  }).catch(function (error) {
    console.error(error);
  });

  //render multiple data in the same page
  res.render('index', { title: "Home", hotels, attractions })

}





