'Use strict'
import './htmlElements.js';
import { clearErrorMessage, showErrorMessage } from './handleErrors.js';
import { handleLoader } from './utilities.js';
import { debounce, throttle } from './algorithms.js';
import ApiWeather from './services/apiWeather.js';
import Storage from './handleStorage.js';

//[VARIABLES]
const apiWeather = new ApiWeather();
const storage = new Storage();
const BASEURLMETA = 'https://www.metaweather.com';
const DEFAULTWOEID = 2487956; //San Francisco

//[FUNCTIONS]
const getCities = async event => {
  const city = txtSearch.value.trim();

  if (city) {
    try {
      
      inputImg.src = 'img/timer.png';
      const cities = await apiWeather.getCities(city);
      inputImg.src = 'img/search.png';
      await handleItemsFound(cities);

      clearErrorMessage('search');

      if (event.keyCode === 13 && cities.length) {
        selectCity(cities[0].woeid); 
      }     
      
    } catch (error) {
      showErrorMessage('search','There was a problem loading the cities.')
    }

    return;
  };

  clearResults();
};

const handleItemsFound = async citiesArray => {
  while(itemsFoundContainer.firstChild) {
    itemsFoundContainer.removeChild(itemsFoundContainer.firstChild);
  }
  
  if (citiesArray.length) {
    for(let city of citiesArray){ createItem(city); };
  } else {
    createItem({
      "title":"No results found.",
      "woeid":0
    });
  };

  itemsFoundContainer.classList.remove('d-none');
};

const selectCity = async woeid => {
  try {
    handleLoader('set');

    clearResults();
    const objCityInfo = await apiWeather.getInfo(woeid);
    storage.save('woeid', woeid);
    await setCityinfo(objCityInfo);

    handleLoader('remove');
  } catch (error) {
    showErrorMessage('getInfo','A problem has ocurred when trying to fetch city info.');
  }
};

const setCityinfo = async objCityInfo => {
  lblCity.textContent = objCityInfo.title;
  lblDate.textContent = new Date(objCityInfo.time).toLocaleString('en-US');
  const days = objCityInfo.consolidated_weather;
  const [firstday] = days;

  lblTemp.textContent = `${ firstday.the_temp.toFixed(2) }°C`;
  lblForecast.textContent = firstday.weather_state_name;
  imgForecast.src = `${ BASEURLMETA }/static/img/weather/${ firstday.weather_state_abbr }.svg`;
  lblWind.textContent = `${ firstday.wind_speed.toFixed(2) } mph`;
  lblSunrise.textContent = new Date(objCityInfo.sun_rise).toLocaleString(navigator.language, { hour: '2-digit', minute:'2-digit' });
  lblSunset.textContent = new Date(objCityInfo.sun_set).toLocaleString(navigator.language, { hour: '2-digit', minute:'2-digit' });
  lblHigh.textContent = `${ firstday.max_temp.toFixed(2) }°C`;
  lblLow.textContent = `${ firstday.min_temp.toFixed(2) }°C`;
  lblRain.textContent = `${ firstday.predictability }%`;

  while(cardsContainer.firstChild) cardsContainer.removeChild(cardsContainer.firstChild);
  await setNexFiveDays(days);
};

const setNexFiveDays = async days => {
  for(let i = 1; i < days.length; i++){
    createDayCard(days[i]);
  }
};

const createDayCard = day => {
  const div = document.createElement('DIV');
  const span = document.createElement('SPAN');
  const img = document.createElement('IMG');
  const span2 = document.createElement('SPAN');
  const text = document.createTextNode(new Date(day.applicable_date).toLocaleString('en-us', { weekday:'long' }));
  const text2 = document.createTextNode(`${ day.the_temp.toFixed(2) }°C`);

  span.appendChild(text);
  span.classList.add('card-item__title');
  div.classList.add('cards-container__item');
  img.setAttribute('src',`${ BASEURLMETA }/static/img/weather/${ day.weather_state_abbr }.svg`);
  img.classList.add('card-img');
  span2.appendChild(text2);

  div.appendChild(span);
  div.appendChild(img);
  div.appendChild(span2);
  
  cardsContainer.appendChild(div);
};

const createItem = city => {
  const li = document.createElement('LI');
  const span = document.createElement('SPAN');
  const text = document.createTextNode(city.title);
  li.classList.add('item');
  span.classList.add('item-inner');

  if (city.woeid) {
    span.setAttribute('data-woeid', city.woeid);
    span.addEventListener('click', throttle(() => {
      selectCity(event.target.dataset.woeid);
    }, 1000));
  };

  span.appendChild(text);
  li.appendChild(span);
  itemsFoundContainer.appendChild(li);
};

const clearResults = () => {
  txtSearch.value = '';
  itemsFoundContainer.classList.add('d-none');
};

const checkLocalStorage = async () => {
  try {
    const WOEID = await storage.read('woeid');
  
    if(!WOEID){
      selectCity(DEFAULTWOEID);
      return;
    }
    
    selectCity(WOEID);

  } catch (error) {
    selectCity(DEFAULTWOEID); 
  }
};

//[EVENTS]
txtSearch.addEventListener('keyup', debounce(getCities, 300));

btnRefresh.addEventListener('click', throttle(checkLocalStorage, 1000));

//[SETTINGS]
checkLocalStorage();