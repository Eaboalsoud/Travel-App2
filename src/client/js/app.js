
/* Global Variables */

const user = "eaboalsoud";
const geoNamesURL = "http://api.geonames.org/searchJSON?name=" + city + "&maxRows=1&username=" + user;
const webitKey = "e5b4e4c828c5457fb6bfbfc11fb569f0";
const pixaKey = "17522404-f14618c3d248a5bbc6622262e";
const res = document.getElementById("results");
const pixaURL = "https://pixabay.com/api/?key=" + pixaKey + "&q=" + city + "&image_type=photo";
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
    let startDate =document.getElementById('departing').value;
    console.log('departing:'+startDate);
    let endDate =document.getElementById('returning').value;
    console.log('returning:'+endDate);

    //------------------send the data(city+userkey) to GeoNames - and get (lat,lon,contry)---------------------------  
    getGeoData("http://api.geonames.org/searchJSON?name=" + city + "&maxRows=1&username=" + user)
    .then(function (geoResult) {
      postData('http://localhost:8084/travelApp', {
        'latitude': geoResult[0],
        'longitude': geoResult[1],
        'country': geoResult[2],
      })
     //----------------- send the data(key,lat,lon,startdate,enddate) to weatherbit-----------------
    //https://api.weatherbit.io/v2.0/history/daily?key=e5b4e4c828c5457fb6bfbfc11fb569f0&lat=40.71427&lon=-74.00597&start_date=2020-11-22&end_date=2020-11-23&
      getWebitData("http://api.weatherbit.io/v2.0/forecast/daily?key=" + webitKey + "&lat=" + geoResult[0] + "&lon=" + geoResult[1]+"&start_date="+startDate+"&end_date="+endDate)
        .then(function (webitResult) {
          postData('http://localhost:8084/travelApp', {
            'Maximum temp': webitResult[0],
            'Minimum temp': webitResult[1],
            'Description': webitResult[2],    
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
    console.log(geodata.geonames);
    const lat = geodata.geonames[0].lat;
    console.log('lat:'+lat);
    const lng = geodata.geonames[0].lng;
    console.log('lng:'+lng);
    const country = geodata.geonames[0].countryName;
    console.log('country:'+country);
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
    console.log(webitdata);
    const max = webitdata.data[0].max_temp;
    console.log('max temp:'+max);
    const min = webitdata.data[0].low_temp;
    console.log('min temp:'+min);
    const desc = webitdata.data[0].weather.description;
    console.log('description:'+desc);
    const webitResult = [max, min, desc];

    return webitResult;
  } catch (error) {
    console.log('Retrieval Error:', error);
  }
}
//get data from pixabay
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

//-------------------------------------------------------------
//UI function
const updateUI = async (webitResult) => {
  const request = await fetch('/travelApp');
 
  try {
    const webitResult=await request.jason();
    document.getElementById('max_temp').innerHTML = webitResult[0];
    document.getElementById('min_temp').innerHTML = webitResult[1];
    document.getElementById('weather').innerHTML = webitResult[2];

  } catch (error) {
    console.log("error", error);
  }
}

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