export default class ApiWeather {
  constructor() {
    this.urlWorkAround = 'https://api.allorigins.win/get?url=';
    this.baseUrlMeta = 'https://www.metaweather.com';
  }

  async getCities(city) {
    const ERRORMESSAGE = 'An error has occurred while searching for cities.';

    const response = await fetch(
      `${this.urlWorkAround}${encodeURIComponent(`${this.baseUrlMeta}/api/location/search/?query=${city}`)}`
    );
    if (!response.ok) {
      throw new Error(ERRORMESSAGE);
    }
    const data = await response.json();

    if (data.status.http_code !== 200) {
      throw new Error(ERRORMESSAGE);
    }

    return JSON.parse(data.contents);
  }

  async getCityInfo(woeid) {
    const ERRORMESSAGE =
      'An error has occurred while trying to load the information.';

    const response = await fetch(
      `${this.urlWorkAround}${encodeURIComponent(`${this.baseUrlMeta}/api/location/${woeid}/`)}`
    );
    if (!response.ok) {
      throw new Error(ERRORMESSAGE);
    }

    const data = await response.json();

    if (data.status.http_code !== 200) {
      throw new Error(ERRORMESSAGE);
    }

    return JSON.parse(data.contents);
  }
}
