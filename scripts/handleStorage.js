export default class Storage {

  async save(woeid){
    localStorage.setItem('woeid', woeid);
  }

  async read(){
    return localStorage.getItem('woeid');
  }
  
}