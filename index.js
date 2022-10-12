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
  //console.log(inputCity)
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
      'X-RapidAPI-Key': 'insertYourApiHere',
      'X-RapidAPI-Host': 'forward-reverse-geocoding.p.rapidapi.com'
    }
  };
  
  await axios.request(firstRequest).then(function (response) {
      cityLatitude = response.data[0].lat;
      cityLongitude = response.data[0].lon;
      //console.log(response.data[0].lat);
      //console.log(response.data[0].lon);
    }).catch(function (error) {
  });    

  //====HOTELS====
   //use Travel Advisor api to fetch nearby hotels; reference https://rapidapi.com/apidojo/api/travel-advisor/
  const secondRequest = {
    method: 'GET',
    url: 'https://travel-advisor.p.rapidapi.com/hotels/list-by-latlng',
    params: {
      latitude: `${cityLatitude}`,
      longitude: `${cityLongitude}`,
      lang: 'en_US',
      limit: '16',
      currency: 'CAD',
      zff: 'hotel',
      offset: '30'
    },
    headers: {
      'X-RapidAPI-Key': 'insertYourApiHere',
      'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com'
    }
  };

  await axios.request(secondRequest).then(function (response) {
    
    hotels = response.data.data;
    console.log(response.data.data);
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
      'X-RapidAPI-Key': 'insertYourApiHere',
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
