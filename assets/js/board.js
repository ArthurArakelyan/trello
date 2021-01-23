let boardName = 'test';
let subscribeType = 'free';
let boardLiked = 'false';

if(!localStorage.getItem('boardLike')) {
  localStorage.setItem('boardLike', boardLiked);
} else {
  boardLiked = localStorage.getItem('boardLike');
}

const $boardName = document.querySelector('.board__name');
const boardNameLink = document.querySelector('.board__name_link');
const boardStar = document.querySelector('.header__action_star');
const boardSubscribeType = document.querySelector('.subscribe__type');

function boardLikedChange() {
  if(boardLiked === 'true') {
    boardStar.innerHTML = '<i class="fas fa-star"></i>';
  } else if(boardLiked === 'false') {
    boardStar.innerHTML = '<i class="far fa-star"></i>';
  } else {
    boardStar.innerHTML = '<i class="far fa-star"></i>';
  }
}

function subscribeTypeChange() {
  if(subscribeType === 'free') {
    boardSubscribeType.innerHTML = 'Free';
  } else if(subscribeType === 'business') {
    boardSubscribeType.innerHTML = 'Business';
  } else {
    boardSubscribeType.innerHTML = 'Free';
  }
}

boardStar.addEventListener('click', () => {
  boardLiked = boardLiked === 'true' ? 'false' : 'true';
  localStorage.setItem('boardLike', boardLiked);
  boardLikedChange();
});

window.addEventListener('load', () => {
  $boardName.innerHTML = boardName;
  boardNameLink.innerHTML = boardName;

  subscribeTypeChange();
  boardLikedChange();
});
