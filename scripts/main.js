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
const daysSection = document.getElementById('daysSection');

//[FUNCTIONS]
const getCities = async () => {
  let city = txtSearch.value;
  let response = await search.getCities(city);
  // console.log(response[0].woeid);

  let response2 = await search.getInfo(response[0].woeid);
  console.log(response2);

  lblCity.textContent = response2.title;
  lblTemperature.textContent = `${response2.consolidated_weather[0].the_temp.toFixed(2)} °C`;
  lblForecast.textContent = response2.consolidated_weather[0].weather_state_name;
  imgForecast.src = `https://www.metaweather.com/static/img/weather/png/${response2.consolidated_weather[0].weather_state_abbr}.png`;
  lblDate.textContent = new Date(response2.time).toLocaleString('en-US');

  let html = '';
  for(let day of response2.consolidated_weather){
    console.log(day);
    html += `
      <div class="days-section__card shadow">
          <p>${new Date(day.applicable_date).toLocaleString('en-us', {weekday:'long'})}</p>
          <img src="https://www.metaweather.com/static/img/weather/${day.weather_state_abbr}.svg" class="mini-img" alt="">
          <p>${day.the_temp.toFixed(2)} °C</p>
      </div>
    `;
  }

  daysSection.innerHTML = html;
  
}

//[EVENTS]
// btnSearch.addEventListener('click', getCities);