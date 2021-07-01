export default class Storage {

  async save(woeid){
    try {
      localStorage.setItem('woeid', woeid);
    } catch (error) {
      console.log(error);
    }
  }

  async read(){
    try {
      return localStorage.getItem('woeid');
    } catch (error) {
      console.log(error);
    }
  }
  
}