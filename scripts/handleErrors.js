const showErrorMessage = (type, message = 'A problem has ocurred.') => {
  if (type === 'search') {
    inputImg.src = 'img/search.png';
    errorMessage.textContent = message;
    loader.style.display = 'none';
  }

  if (type === 'getInfo') {
    imgLoader.src = './img/close.png';
    loader.style.display = 'flex';
    textLoader.textContent = message;
  }
}

const clearErrorMessage = (type) => {
  if(type === 'search'){
    errorMessage.textContent = '';
  }
}

export {
  showErrorMessage,
  clearErrorMessage
}