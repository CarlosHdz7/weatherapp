const displayError = (type, message = 'A problem has ocurred.') => {
  if (type === 'search') {
    inputImg.src = 'img/search.png';
    errorMessage.textContent = message;
    loader.style.display = 'none';
  }

  if (type === 'getCityInfo') {
    imgLoader.src = './img/close.png';
    loader.style.display = 'flex';
    textLoader.textContent = message;
  }
}

const clearSearchError = () => errorMessage.textContent = '';


export {
  displayError,
  clearSearchError
}