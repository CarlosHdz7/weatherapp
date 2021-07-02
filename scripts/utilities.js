const handleLoader = (option) => {
  if(option === 'set'){
    loader.style.display = 'flex';
    textLoader.textContent = 'Loading ...'
    imgLoader.src = './img/timer.png';
  }

  if(option === 'remove'){
    loader.style.display = 'none';
  }
}

export {
  handleLoader
}