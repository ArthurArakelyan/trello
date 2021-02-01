function createPopover(section) {
  const popover = section.appendChild(document.createElement('div'));
  popover.classList.add('popover');

  const popoverWrapper = popover.appendChild(document.createElement('div'));
  popoverWrapper.classList.add('popover__wrapper');
  
  const popoverContent = popoverWrapper.appendChild(document.createElement('div'));
  popoverContent.classList.add('popover__content');

  function popoverClose() {
    popover.remove();
  }

  if(document.querySelectorAll('.popover').length > 1) {
    popover.remove();
  }

  return {
    popover,
    popoverClose
  }
}

function popoverReRender(heading, child, back = false, backFunction = () => {}) {
  const popoverContent = document.querySelector('.popover__content');
  popoverContent.innerHTML = `
    <div class="popoved__header menu__header">
      <button class="popover__header_back ${back ? 'back' : ''}">
        <i class="fas fa-angle-left"></i>
      </button>

      <h3 class="popover__header_heading menu__header_heading">${heading}</h3>

      <button class="popover__header_close menu__header_close">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `;

  popoverContent.appendChild(child);

  const popoverCloseButton = document.querySelector('.popover__header_close');
  popoverCloseButton.addEventListener('click', () => {
    document.querySelector('.popover').remove();
  });

  const popoverBack = document.querySelector('.popover__header_back');
  popoverBack.addEventListener('click', () => {
    backFunction();
  });
}
