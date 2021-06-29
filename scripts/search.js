class Search {
  
  async getCities(city){
    const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(`https://www.metaweather.com/api/location/search/?query=${city}`)}`);
    if (!response.ok) {   
      const message = `An error has occured: ${response.status}`;    
      throw new Error(message); 
    }

    const data = await response.json();
    return JSON.parse(data.contents);
  }

  async getInfo(woeid){
    const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(`https://www.metaweather.com/api/location/${woeid}/`)}`);
    if (!response.ok) {   
      const message = `An error has occured: ${response.status}`;    
      throw new Error(message); 
    }
    
    const data = await response.json();
    return JSON.parse(data.contents);
  }
  
}

export { Search };