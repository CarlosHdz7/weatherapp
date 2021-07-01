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
const cardsContainer = document.getElementById('cardsContainer');
const inputImg = document.getElementById('inputImg');

//[FUNCTIONS]
const getCities = async () => {
  let city = txtSearch.value;
  
  if(city){
    inputImg.src = 'img/timer.png';
    let response = await search.getCities(city);
    console.log(response);
    inputImg.src = 'img/search.png';
    handleItemsFound(response);
    return;
  }

  clearResults();
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
  span.addEventListener('click', event => {
    selectCity(event.target.dataset.woeid);
  });
  span.setAttribute('data-woeid', city.woeid);

  span.appendChild(text);
  li.appendChild(span);
  itemsFoundContainer.appendChild(li);
}

const selectCity = async (woeid) => {
  let objCityInfo = await search.getInfo(woeid);
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
  // console.log(firstday);

  lblTemp.textContent = `${firstday.the_temp.toFixed(2)}°C`;
  lblForecast.textContent = firstday.weather_state_name;
  imgForecast.src = `https://www.metaweather.com/static/img/weather/${firstday.weather_state_abbr}.svg`;
  lblWind.textContent = `${firstday.wind_speed.toFixed(2)} mph`;
  lblSunrise.textContent = new Date(objCityInfo.sun_rise).toLocaleString(navigator.language, {hour: '2-digit', minute:'2-digit'});
  lblSunset.textContent = new Date(objCityInfo.sun_set).toLocaleString(navigator.language, {hour: '2-digit', minute:'2-digit'});
  lblHigh.textContent = `${firstday.max_temp.toFixed(2)}°C`;
  lblLow.textContent = `${firstday.min_temp.toFixed(2)}°C`;
  lblRain.textContent = `${firstday.predictability}%`;

  while(cardsContainer.firstChild) cardsContainer.removeChild(cardsContainer.firstChild);
  setNexFiveDays(days);

  clearResults();
}

const debounce = (callback, interval) => {
  let debounceTimeoutId;
  return function(...args) {
    clearTimeout(debounceTimeoutId);
    debounceTimeoutId = setTimeout(() => callback.apply(this, args), interval);
  };
}

const setNexFiveDays = (days) => {
  for(let i = 1; i < days.length; i++){
    createDayCard(days[i]);
  }
}

const createDayCard = (day) => {

  let div = document.createElement('DIV');
  let span = document.createElement('SPAN');
  let img = document.createElement('IMG');
  let span2 = document.createElement('SPAN');

  let text = document.createTextNode(new Date(day.applicable_date).toLocaleString('en-us', {weekday:'long'}));
  let text2 = document.createTextNode(`${day.the_temp.toFixed(2)}°C`);

  span.appendChild(text);
  span.classList.add('card-item__title');
  div.classList.add('cards-container__item');
  img.setAttribute('src',`https://www.metaweather.com/static/img/weather/${day.weather_state_abbr}.svg`);
  img.classList.add('card-img');
  span2.appendChild(text2);


  div.appendChild(span);
  div.appendChild(img);
  div.appendChild(span2);
  
  cardsContainer.appendChild(div);
}

const clearResults = () => {
  itemsFoundContainer.classList.add('d-none');
}

const defaultSearch = () => {
  selectCity(2487956); //San francisco
}

//[EVENTS]
txtSearch.addEventListener('keyup', debounce(getCities,600));

//[SETTINGS]
defaultSearch();