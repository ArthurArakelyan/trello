const defaultColor = 'rgb(0, 121, 191)';
let color = defaultColor;

if(!localStorage.getItem('color')) {
  localStorage.setItem('color', color);
  document.body.style.backgroundColor = color;
} else {
  color = localStorage.getItem('color');
  document.body.style.backgroundColor = color;
}

const home = document.querySelector('.home__content');
const menuButton = document.querySelector('.header__menu_menu');

const colors = [
  'rgb(0, 121, 191)',
  'rgb(210, 144, 52)',
  'rgb(255, 69, 0)',
  'rgb(176, 70, 50)',
  'rgb(137, 96, 158)',
  'rgb(205, 90, 145)',
  'rgb(75, 191, 107)',
  'rgb(0, 174, 204)',
  'rgb(131, 140, 145)'
];

const menu = home.appendChild(document.createElement('div'));
menu.classList.add('menu');
menu.style.display = 'none';

menu.innerHTML = `
  <div class="menu__wrapper">
    <div class="menu__content">
      <div class="menu__header">
        <h2 class="menu__header_heading"2>Цвета</h2>
        <button class="menu__header_close">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div class="menu__body"></div>
    </div>
  </div>
`;

const menuBody = document.querySelector('.menu__body');
const menuClose = document.querySelector('.menu__header_close');

colors.map(color => {
  const menuColor = menuBody.appendChild(document.createElement('div'));
  menuColor.style.backgroundColor = color;
  menuColor.setAttribute('data-color', color);
  menuColor.classList.add('menu__color');

  menuColor.addEventListener('click', (e) => {
    color = e.target.dataset.color;
    localStorage.setItem('color', color);
    document.body.style.backgroundColor = color;
  });
});

menuButton.addEventListener('click', () => {
  if(!menu.classList.contains('hide')) {
    menu.style.display = 'block';

    setTimeout(() => {
      menu.classList.add('open');
    }, 20);
  }
});

function menuHide() {
  if(!menu.classList.contains('hide')) {
    menu.classList.remove('open');
    menu.classList.add('hide');
  
    setTimeout(() => {
      menu.style.display = 'none';
      menu.classList.remove('hide');
    }, 300);
  }
}

menuClose.addEventListener('click', menuHide);

window.addEventListener('click', (e) => {
  if(e.target === homeColumnsContainer ||
     e.target === homeColumns) {
    menuHide();
  }
});
