export default class ApiWeather {

  constructor(){
    this.urlWorkAround = 'https://api.allorigins.win/get?url=';
    this.baseUrlMeta = 'https://www.metaweather.com';
  }
  
  async getCities(city) {
    const response = await fetch(`${ this.urlWorkAround }${ encodeURIComponent(`${ this.baseUrlMeta }/api/location/search/?query=${city}`) }`);
    if (!response.ok) {   
      throw new Error('An error has occurred while searching for cities.'); 
    }

    const data = await response.json();
    return JSON.parse(data.contents);
  };

  async getCityInfo(woeid) {
    const response = await fetch(`${ this.urlWorkAround }${ encodeURIComponent(`${ this.baseUrlMeta }/api/location/${woeid}/`) }`);
    if (!response.ok) {     
      throw new Error('An error has occurred while trying to load the information.'); 
    }
    
    const data = await response.json();
    return JSON.parse(data.contents);
  };

}