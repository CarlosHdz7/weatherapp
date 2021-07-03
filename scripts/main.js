'Use strict'
import './htmlElements.js';
import { clearSearchError, displayError } from './handleErrors.js';
import { handleLoader, containClasses } from './utilities.js';
import { debounce, throttle } from './algorithms.js';
import ApiWeather from './services/apiWeather.js';
import Storage from './handleStorage.js';

//[VARIABLES]
const apiWeather = new ApiWeather();
const storage = new Storage();
const VALIDCLASSES = ['item-inner','search-container__input','items-found','item'];
const BASEURLMETA = 'https://www.metaweather.com';
const DEFAULTWOEID = 2487956; //San Francisco

//[FUNCTIONS]
const getCities = async event => {
  const city = txtSearch.value.trim();

  if (city && city.length <= 25
    ) {
    try {
      
      inputImg.src = 'img/timer.png';
      const cities = await apiWeather.getCities(city);
      inputImg.src = 'img/search.png';

      await displayResultsList(cities);
      clearSearchError();

      if (event.keyCode === 13 && cities.length) {
        getCityInfo(cities[0].woeid); 
      }     
      
    } catch (error) {
      displayError('search', error.message);
    }

    return;
  };

  txtSearch.value = '';
  await clearItemsResultList();
  hideResultList();
};

const getCityInfo = async woeid => {
  try {
    handleLoader('set');
    clearItemsResultList();
    hideResultList();
    const objCityInfo = await apiWeather.getCityInfo(woeid);

    storage.save('woeid', woeid);
    await displayCityData(objCityInfo);

    handleLoader('remove');
  } catch (error) {
    displayError('getCityInfo',error.message);
  }
};

const displayResultsList = async citiesArray => {
  await clearItemsResultList();
  
  if (citiesArray.length) {
    for(let city of citiesArray){ createItemResult(city); };
  } else {
    createItemResult({
      'title':'No results found.',
      'woeid':0
    });
  };

  itemsFoundContainer.classList.remove('d-none');
};

const displayCityData = async objCityInfo => {
  const days = objCityInfo.consolidated_weather;
  const [firstday] = days;

  txtSearch.value = '';
  lblCity.textContent = objCityInfo.title;
  lblDate.textContent = new Date(objCityInfo.time).toLocaleString('en-US');
  lblTemp.textContent = `${ firstday.the_temp.toFixed(2) }°C`;
  lblForecast.textContent = firstday.weather_state_name;
  imgForecast.src = `${ BASEURLMETA }/static/img/weather/${ firstday.weather_state_abbr }.svg`;
  lblWind.textContent = `${ firstday.wind_speed.toFixed(2) } mph`;
  lblSunrise.textContent = new Date(objCityInfo.sun_rise).toLocaleString(navigator.language, { hour: '2-digit', minute:'2-digit' });
  lblSunset.textContent = new Date(objCityInfo.sun_set).toLocaleString(navigator.language, { hour: '2-digit', minute:'2-digit' });
  lblHigh.textContent = `${ firstday.max_temp.toFixed(2) }°C`;
  lblLow.textContent = `${ firstday.min_temp.toFixed(2) }°C`;
  lblRain.textContent = `${ firstday.predictability }%`;
  txtSearch.blur();

  while(cardsContainer.firstChild) cardsContainer.removeChild(cardsContainer.firstChild);
  await displayNextFiveDays(days);
};

const displayNextFiveDays = async days => {
  for(let i = 1; i < days.length; i++){
    createDayCard(days[i]);
  }
};

const createDayCard = day => {
  const div = document.createElement('div');
  const span = document.createElement('span');
  const img = document.createElement('img');
  const span2 = document.createElement('span');
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

const createItemResult = city => {
  const li = document.createElement('li');
  const span = document.createElement('span');
  const text = document.createTextNode(city.title);
  li.classList.add('item');
  span.classList.add('item-inner');

  if (city.woeid) {
    span.classList.add('item-inner--selectable');
    span.setAttribute('data-woeid', city.woeid);
    span.addEventListener('click', throttle(() => {
      getCityInfo(event.target.dataset.woeid);
    }, 1000));
  };

  span.appendChild(text);
  li.appendChild(span);
  itemsFoundContainer.appendChild(li);
};

const clearItemsResultList = async () => {
  while(itemsFoundContainer.firstChild) {
    itemsFoundContainer.removeChild(itemsFoundContainer.firstChild);
  }
}

const checkLastSearch = async () => {
  try {
    const WOEID = await storage.read('woeid');
  
    if(!WOEID){
      getCityInfo(DEFAULTWOEID);
      return;
    }
    
    getCityInfo(WOEID);

  } catch (error) {
    getCityInfo(DEFAULTWOEID); 
  }
};

const handleDisplayResult = event => {
  const targetClasses = Array.from(event.target.classList); 
  if (!containClasses(targetClasses, VALIDCLASSES)) { hideResultList(); };
};

const hideResultList = () => itemsFoundContainer.classList.add('d-none');

const showResultList = () => itemsFoundContainer.classList.remove('d-none');

//[EVENTS]
txtSearch.addEventListener('keyup', debounce(getCities, 500));

btnRefresh.addEventListener('click', throttle(checkLastSearch, 1000));

txtSearch.addEventListener('mouseover',showResultList);

txtSearch.addEventListener('focus',showResultList);

document.addEventListener('click', handleDisplayResult);


//[SETTINGS]
checkLastSearch();