'Use strict'
import { Search } from './Search.js';

//VARIABLES
let search = new Search();

//[HTML ELEMENTS]
const txtSearch = document.getElementById('txtSearch');
const btnSearch = document.getElementById('btnSearch');
const lblCity = document.getElementById('lblCity');
const lblTemperature = document.getElementById('lblTemperature');
const lblForecast = document.getElementById('lblForecast');
const imgForecast = document.getElementById('imgForecast');
const lblDate = document.getElementById('lblDate');

//[FUNCTIONS]
const getCities = async () => {
  let city = txtSearch.value;
  let response = await search.getCities(city);
  // console.log(response[0].woeid);

  let response2 = await search.getInfo(response[0].woeid);
  console.log(response2);

  lblCity.textContent = response2.title;
  lblTemperature.textContent = response2.consolidated_weather[0].the_temp;
  lblForecast.textContent = response2.consolidated_weather[0].weather_state_name;
  imgForecast.src = `https://www.metaweather.com/static/img/weather/${response2.consolidated_weather[0].weather_state_abbr}.svg`;
  lblDate.textContent = response2.time;
}

//[EVENTS]
btnSearch.addEventListener('click', getCities);