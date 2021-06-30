'Use strict'
import { Search } from './Search.js';

//VARIABLES
let search = new Search();

//[HTML ELEMENTS]
const txtSearch = document.getElementById('txtSearch');
const itemsFoundContainer = document.getElementById('itemsFoundContainer');
const lblCity = document.getElementById('lblCity');
const lblDate = document.getElementById('lblDate');
const lblTemp = document.getElementById('lblTemp');
const lblForecast = document.getElementById('lblForecast');
const imgForecast = document.getElementById('imgForecast');
const lblSunrise = document.getElementById('lblSunrise');
const lblSunset = document.getElementById('lblSunset');
const lblHigh = document.getElementById('lblHigh');
const lblLow = document.getElementById('lblLow');
const lblRain = document.getElementById('lblRain');

const lblWind = document.getElementById('lblWind');
//[FUNCTIONS]
// const getCities = async () => {
//   let city = txtSearch.value;
//   let response = await search.getCities(city);
//   // console.log(response[0].woeid);

//   let response2 = await search.getInfo(response[0].woeid);
//   console.log(response2);

//   lblCity.textContent = response2.title;
//   lblTemperature.textContent = `${response2.consolidated_weather[0].the_temp.toFixed(2)} °C`;
//   lblForecast.textContent = response2.consolidated_weather[0].weather_state_name;
//   imgForecast.src = `https://www.metaweather.com/static/img/weather/png/${response2.consolidated_weather[0].weather_state_abbr}.png`;
//   lblDate.textContent = new Date(response2.time).toLocaleString('en-US');

//   let html = '';
//   for(let day of response2.consolidated_weather){
//     console.log(day);
//     html += `
//       <div class="days-section__card shadow">
//           <p>${new Date(day.applicable_date).toLocaleString('en-us', {weekday:'long'})}</p>
//           <img src="https://www.metaweather.com/static/img/weather/${day.weather_state_abbr}.svg" class="mini-img" alt="">
//           <p>${day.the_temp.toFixed(2)} °C</p>
//       </div>
//     `;
//   }

//   daysSection.innerHTML = html;
  
// }


const getCities = async () => {
  let city = txtSearch.value;
  let response = await search.getCities(city);
  console.log(response);
  handleItemsFound(response);
}

const handleItemsFound = (citiesArray) => {
  if(citiesArray.length){

    while(itemsFoundContainer.firstChild) itemsFoundContainer.removeChild(itemsFoundContainer.firstChild);

    for(let city of citiesArray){
      createItem(city);
    }
    
    itemsFoundContainer.classList.remove('d-none');
  }
}

const createItem = (city) => {
  let li = document.createElement('LI');
  let span = document.createElement('SPAN');
  let text = document.createTextNode(city.title);
  li.classList.add('item');
  span.classList.add('item-inner');
  span.addEventListener('click',selectCity);
  span.setAttribute('data-woeid',city.woeid);

  span.appendChild(text);
  li.appendChild(span);
  itemsFoundContainer.appendChild(li);
}

const selectCity = async (event) => {
  let objCityInfo = await search.getInfo(event.target.dataset.woeid);
  setCityinfo(objCityInfo);
}

const setCityinfo = (objCityInfo) => {
  console.log(objCityInfo);
  txtSearch.value = '';

  lblCity.textContent = objCityInfo.title;
  lblDate.textContent = new Date(objCityInfo.time).toLocaleString('en-US');
  let firstday;
  let days = objCityInfo.consolidated_weather;
  [firstday] = days;
  console.log(firstday);

  lblTemp.textContent = `${firstday.the_temp.toFixed(2)}°C`;
  lblForecast.textContent = firstday.weather_state_name;
  imgForecast.src = `https://www.metaweather.com/static/img/weather/${firstday.weather_state_abbr}.svg`;
  lblWind.textContent = `${firstday.wind_speed.toFixed(2)} mph`;
  lblSunrise.textContent = new Date(objCityInfo.sun_rise).toLocaleString(navigator.language, {hour: '2-digit', minute:'2-digit'});
  lblSunset.textContent = new Date(objCityInfo.sun_set).toLocaleString(navigator.language, {hour: '2-digit', minute:'2-digit'});
  lblHigh.textContent = `${firstday.max_temp.toFixed(2)}°C`;
  lblLow.textContent = `${firstday.min_temp.toFixed(2)}°C`;
  lblRain.textContent = `${firstday.predictability}%`;

  itemsFoundContainer.classList.add('d-none');
}

const debounce = (callback, interval) => {
  let debounceTimeoutId;
  return function(...args) {
    clearTimeout(debounceTimeoutId);
    debounceTimeoutId = setTimeout(() => callback.apply(this, args), interval);
  };
}

//[EVENTS]
txtSearch.addEventListener('keyup', debounce(getCities,600));