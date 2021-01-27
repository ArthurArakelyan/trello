function createPopover(section, heading = 'Pop-over', child) {
  const popover = section.appendChild(document.createElement('div'));
  popover.classList.add('popover');

  const popoverWrapper = popover.appendChild(document.createElement('div'));
  popoverWrapper.classList.add('popover__wrapper');
  
  const popoverContent = popoverWrapper.appendChild(document.createElement('div'));
  popoverContent.classList.add('popover__content');

  const popoverHeader = popoverContent.appendChild(document.createElement('div'));
  popoverHeader.classList.add('popover__header');
  popoverHeader.classList.add('menu__header');

  const popoverHeading = popoverHeader.appendChild(document.createElement('h3'));
  popoverHeading.classList.add('popover__header_heading');
  popoverHeading.classList.add('menu__header_heading');
  popoverHeading.innerHTML = heading;

  const popoverCloseButton = popoverHeader.appendChild(document.createElement('button'));
  popoverCloseButton.classList.add('popover__header_close');
  popoverCloseButton.classList.add('menu__header_close');
  popoverCloseButton.innerHTML = '<i class="fas fa-times"></i>';

  const popoverChild = popoverContent.appendChild(child);

  popoverCloseButton.addEventListener('click', () => {
    popoverClose();
  });

  function popoverClose() {
    popover.remove();
  }

  return {
    popover,
    popoverChild,
    popoverClose
  }
}
