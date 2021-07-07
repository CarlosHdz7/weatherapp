const displayError = (type, message = 'A problem has ocurred.') => {
  if (type === 'search') {
    inputImg.src = 'img/search.png';
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    loader.style.display = 'none';
  }

  if (type === 'getCityInfo') {
    imgLoader.src = './img/close.png';
    loader.style.display = 'flex';
    textLoader.textContent = message;
  }
}

const clearSearchError = () => {
  errorMessage.style.display = 'none';
  errorMessage.textContent = '';
}


export {
  displayError,
  clearSearchError
}