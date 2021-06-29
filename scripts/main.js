//DEMO
import {Search} from './search.js';

//VARIABLES
let search = new Search()

//[HTML ELEMENTS]
const txtSearch = document.getElementById('txtSearch');

//[FUNCTIONS]
const getCities = async event => {
  let city = event.target.value;
  let response = await search.getCities(city);
  console.log(response);
}

//[EVENTS]
txtSearch.addEventListener('change', getCities);