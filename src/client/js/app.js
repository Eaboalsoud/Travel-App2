
/* Global Variables */
let d = new Date();
let newDate = d.getMonth()+'.'+ d.getDate()+'.'+ d.getFullYear();
const user = "eaboalsoud";
const webitKey = "e5b4e4c828c5457fb6bfbfc11fb569f0";
const pixaKey = "17522404-f14618c3d248a5bbc6622262e";

// Event listener to add function to existing HTML DOM element
document.getElementById('generate').addEventListener('click', performAction);
//--------- Function called by event listener performAction -------------
function performAction(event){
  event.preventDefault()
    let today = new Date().getTime();
    //------------------get data from user---------------------------- 
    console.log('today is:'+today);
    let city=  document.getElementById('city').value;
    console.log('city:'+city);
    Client.checkCity(city)
    let startDate =document.getElementById('departing').value;
    console.log('departing:'+startDate);
    let endDate =document.getElementById('returning').value;
    console.log('returning:'+endDate);

     daysLeft(startDate,endDate);
    //------------------send the data(city+userkey) to GeoNames - and get (lat,lon,contry)---------------------------  
    getGeoData("http://api.geonames.org/searchJSON?name=" + city + "&maxRows=1&username=" + user)
    .then(function (geoResult) {
      postData('http://localhost:8084/travelApp', {
        'latitude': geoResult[0],
        'longitude': geoResult[1],
        'country': geoResult[2],
      })
      updategeo(geoResult);
     //----------------- send the data(key,lat,lon,startdate,enddate) to weatherbit-----------------
      getWebitData("http://api.weatherbit.io/v2.0/forecast/daily?key=" + webitKey + "&lat=" + geoResult[0] + "&lon=" + geoResult[1]+"&start_date="+startDate+"&end_date="+endDate)
        .then(function (webitResult) {
          postData('http://localhost:8084/travelApp', {
            'Maximum temp': webitResult[0],
            'Minimum temp': webitResult[1],
            'Description': webitResult[2],
            'country'    :webitResult[3]
          })
          updateUI(webitResult);
        })
    });
    getPixaData("https://pixabay.com/api/?key=" + pixaKey + "&q=" + city + "&image_type=photo")
    .then(function (imageurl) {
      postData('http://localhost:8084/travelApp', {
        'Image': imageurl
      })
      updatePixa(imageurl);
    }).catch((err) => {
      console.log("error ", err)
    })
}

//------------------function to get data from geonames URL------------------------------------------

const getGeoData = async (geoNamesURL) => {
  const response = await fetch(geoNamesURL);
  try {
    let geodata = await response.json();
    const lat = geodata.geonames[0].lat;
    const lng = geodata.geonames[0].lng;
    const country = geodata.geonames[0].countryName; 
    const geoResult = [lat, lng, country];
    console.log('geoResult:'+geoResult)
    return geoResult;
  } catch (error) {
    console.log(' Error:', error);
  }
}
//--------------get data from Weatherbit-----------------------------------


const getWebitData = async (webitURL) => {
  const response = await fetch(webitURL);
  try {
    let webitdata = await response.json();
    const max = webitdata.data[0].max_temp;
    console.log('max temp:'+max);
    const min = webitdata.data[0].low_temp;
    console.log('min temp:'+min);
    const desc = webitdata.data[0].weather.description;
    console.log('desc:'+desc);
    const country = webitdata.data[0].timezone;
    console.log('timezone:'+country);
    const webitResult = [max, min, desc,country];
    return webitResult;
  } catch (error) {
    console.log('Retrieval Error:', error);
  }
}
//--------------get data from pixabay-----------------------------------

const getPixaData = async (pixaURL) => {
  const response = await fetch(pixaURL);
  try {
    let pixaPic = await response.json();
    const imageurl = pixaPic.hits[0].webformatURL;
    return imageurl;
  } catch (error) {
    console.log('Retrieval Error:', error);
  }
}

//--------------updateUI----for the webitResult--------------------------------

const updateUI = async (webitResult) => { 
  const request = await fetch('/travelApp');
  try {
    document.getElementById('max_temp').innerHTML = "The Max Temp: "+webitResult[0]+' °C';
    document.getElementById('min_temp').innerHTML = "The Min Temp: "+webitResult[1]+ ' °C';
    document.getElementById('weather').innerHTML = " Typical weather for then is: "+webitResult[2];  
  } catch (error) {
    console.log("error", error);
  }
}
//---------------------------------------------------------------------
const updategeo = async (geoResult) => {
  const request = await fetch('/travelApp'); 
  try {  
    document.getElementById('country').innerHTML = " you are going to visit : "+geoResult[2];
  } catch (error) {
    console.log("error", error);
  }
}
//-------------------------------------------------------------
const daysLeft = async (startDate,endDate) => {
  const request = await fetch('/travelApp'); 
    const sday=startDate;
    const eday=endDate;
    const today = (Date.now()) / 1000;
    const time1 = (new Date(sday).getTime()) / 1000;
    const time2 = (new Date(eday).getTime()) / 1000;
    const daysLeft = Math.round((time1 - today) / 86400);
    const duration = Math.round((time2 - time1) / 86400);
    try {
    document.getElementById('departure').innerHTML = " Your trip info:" ;  
    document.getElementById('today').innerHTML = " Today is  : " +d;  
    document.getElementById('daysLeft').innerHTML = " Your trip will be after : " +daysLeft+" days.";
    document.getElementById('duration').innerHTML = " Your trip duration will be for  : " + duration+" days.";
  
  } catch (error) {
    console.log("error", error);
  }
}

//-------------updatePixa--------------------------------------
const updatePixa = async (imageurl) => {
  const request = await fetch('/travelApp');
  try {
    document.getElementById('pixa').setAttribute('src', imageurl);
    
  } catch (error) {
    console.log("error", error);
  }
}
//--------------postData--------------------------------------
const postData = async (url = '', data = {}) => {
  console.log(data);
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}
//---------------------------------------------------
export {performAction}