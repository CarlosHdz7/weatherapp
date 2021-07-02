export default class Storage {

  async save(key,value) {
      localStorage.setItem(key, value);
  };

  async read(key) {
    return localStorage.getItem(key);
  };

}