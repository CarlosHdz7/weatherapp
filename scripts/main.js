'Use strict'
import './htmlElements.js';
import { debounce, throttle } from './algorithms.js';
import ApiWeather from './services/apiWeather.js';
import Storage from './handleStorage.js';

//[VARIABLES]
let apiWeather = new ApiWeather();
let storage = new Storage();
let activeResults = false;

//[FUNCTIONS]
const getCities = async (event) => {
  let city = txtSearch.value;

  if (city) {
    try {
      
      inputImg.src = 'img/timer.png';
      let response = await apiWeather.getCities(city);
      inputImg.src = 'img/search.png';

      await handleItemsFound(response);

      clearErrorMessage('search');

      if (event.keyCode === 13 && activeResults) {
        selectCity(itemsFoundContainer.firstChild.firstChild.dataset.woeid);
      }     
      
    } catch (error) {
      showErrorMessage('search','There was a problem loading the cities.')
    }

    return;
  };

  clearResults();
};

const showErrorMessage = (type, message = 'A problem has ocurred.') => {
  if (type === 'search') {
    inputImg.src = 'img/search.png';
    errorMessage.textContent = message;
    loader.style.display = 'none';
  }

  if (type === 'getInfo') {
    imgLoader.src = './img/close.png';
    loader.style.display = 'flex';
    textLoader.textContent = message;
  }
}

const clearErrorMessage = (type) => {
  if(type === 'search'){
    errorMessage.textContent = '';
  }
}

const handleItemsFound = async citiesArray => {
  while(itemsFoundContainer.firstChild) itemsFoundContainer.removeChild(itemsFoundContainer.firstChild);
  
  if (citiesArray.length) {
    for(let city of citiesArray){
      createItem(city);
    }

    activeResults = true;
    
  } else {
    createItem({
      "title":"No results found.",
      "woeid":0
    });

    activeResults = false;
  };

  itemsFoundContainer.classList.remove('d-none');
};

const createItem = city => {
  let li = document.createElement('LI');
  let span = document.createElement('SPAN');
  let text = document.createTextNode(city.title);
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

const selectCity = async woeid => {
  try {
    clearResults();
    loader.style.display = 'flex';
    let objCityInfo = await apiWeather.getInfo(woeid);
    storage.save(woeid);
    await setCityinfo(objCityInfo);
    loader.style.display = 'none';
    textLoader.textContent = 'Loading ...'
  } catch (error) {
    showErrorMessage('getInfo','A problem has ocurred when trying to fetch city info.');
  }
};

const setCityinfo = async objCityInfo => {
  lblCity.textContent = objCityInfo.title;
  lblDate.textContent = new Date(objCityInfo.time).toLocaleString('en-US');
  let firstday;
  let days = objCityInfo.consolidated_weather;
  [firstday] = days;

  lblTemp.textContent = `${ firstday.the_temp.toFixed(2) }°C`;
  lblForecast.textContent = firstday.weather_state_name;
  imgForecast.src = `https://www.metaweather.com/static/img/weather/${ firstday.weather_state_abbr }.svg`;
  lblWind.textContent = `${ firstday.wind_speed.toFixed(2) } mph`;
  lblSunrise.textContent = new Date(objCityInfo.sun_rise).toLocaleString(navigator.language, { hour: '2-digit', minute:'2-digit' });
  lblSunset.textContent = new Date(objCityInfo.sun_set).toLocaleString(navigator.language, { hour: '2-digit', minute:'2-digit' });
  lblHigh.textContent = `${ firstday.max_temp.toFixed(2) }°C`;
  lblLow.textContent = `${ firstday.min_temp.toFixed(2) }°C`;
  lblRain.textContent = `${ firstday.predictability }%`;

  while(cardsContainer.firstChild) cardsContainer.removeChild(cardsContainer.firstChild);
  setNexFiveDays(days);
};

const setNexFiveDays = days => {
  for(let i = 1; i < days.length; i++){
    createDayCard(days[i]);
  }
};

const createDayCard = day => {

  let div = document.createElement('DIV');
  let span = document.createElement('SPAN');
  let img = document.createElement('IMG');
  let span2 = document.createElement('SPAN');

  let text = document.createTextNode(new Date(day.applicable_date).toLocaleString('en-us', { weekday:'long' }));
  let text2 = document.createTextNode(`${ day.the_temp.toFixed(2) }°C`);

  span.appendChild(text);
  span.classList.add('card-item__title');
  div.classList.add('cards-container__item');
  img.setAttribute('src',`https://www.metaweather.com/static/img/weather/${ day.weather_state_abbr }.svg`);
  img.classList.add('card-img');
  span2.appendChild(text2);

  div.appendChild(span);
  div.appendChild(img);
  div.appendChild(span2);
  
  cardsContainer.appendChild(div);
};

const clearResults = () => {
  txtSearch.value = '';
  itemsFoundContainer.classList.add('d-none');
  activeResults = false;
};

const checkLocalStorage = async () => {
  let woeid = await storage.read();

  if(woeid != null){
    selectCity(woeid);
    return;
  }

  selectCity(2487956); //San francisco
};

//[EVENTS]
txtSearch.addEventListener('keyup', debounce(getCities, 300));

btnRefresh.addEventListener('click', throttle(checkLocalStorage, 1000));

//[SETTINGS]
checkLocalStorage();