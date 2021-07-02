const handleLoader = (option) => {
  if(option === 'set'){
    loader.style.display = 'flex';
    textLoader.textContent = 'Loading ...'
  }

  if(option === 'remove'){
    loader.style.display = 'none';
  }
}

export {
  handleLoader
}