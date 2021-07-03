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

const containClasses = (elementClasses, validClasses) => {
  for(let eClass of elementClasses){
    if(validClasses.includes(eClass)) return true;
  }
  return false;
}

export {
  handleLoader,
  containClasses
}