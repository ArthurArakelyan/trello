function createModal(children = '') {
  const modal = document.body.appendChild(document.createElement('div'));
  modal.classList.add('modal');

  modal.addEventListener('click', (e) => {
    if(e.target.dataset.close) {
      modalClose();
    }
  });

  modal.innerHTML = `
    <div class="modal__overlay" data-close="true">
      <div class="modal__content" style="width: 750px">
        ${children}
      </div>
    </div>
  `;

  function modalOpen() {
    setTimeout(() => {
      modal.classList.add('open');
    }, 300);
  }

  function modalClose() {
    document.title = defaultTitle;
    modal.classList.remove('open');
    modal.classList.add('hide');

    setTimeout(() => {
      modal.classList.remove('hide');
      modal.remove();
    }, 200);
  }

  return {
    modal,
    modalOpen
  };
}

function cardModalReRender(cardName, columnName, cardId, cardNameChange) {
  const modalContent = document.querySelector('.modal__content');
  modalContent.innerHTML = `
    <div class="modal__card_infos">
      <div class="modal__card_info modal__card_info_name">
        <span class="modal__card_info_icon">

        </span>
        <div class="modal__card_info_details">
          <p class="modal__card_info_details_card_name">${cardName}</p>
          <form class="modal__card_info_deatils_card_name_form column__header_form hide">
            <input class="modal__card_info_details_card_name_form_input column__header_form_input">
          </form>

          <span>в колонке ${columnName}</span>
        </div>
      </div>
      <div class="modal__card_info modal__card_info_description">
        <span class="modal__card_info_icon">

        </span>
        <div class="modal__card_info_details">
          <p>Описание</p>
          <button class="modal__card_info_details_button">
            Добавить более подробное описание...          
          </button>

          <form class="modal__card_info_details_add hide">
            <textarea class="modal__card_info_details_add_textarea" placeholder="Добавить более подробное описание..."></textarea>
            <div class="modal__card_info_details_add_actions">
              <button class="modal__card_info_details_actions_save">
                Сохранить
              </button>
              <i class="modal__card_info_details_actions_close fas fa-times"></i>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div class="modal__card_info_menu">

    </div>
  `;

  document.title = `${cardName} на доске test | Trello`;

  const detailsCardName = document.querySelector('.modal__card_info_details_card_name');
  const detailsCardNameForm = document.querySelector('.modal__card_info_deatils_card_name_form');
  const detailsCardNameFormInput = detailsCardNameForm.firstElementChild;

  detailsCardName.addEventListener('click', () => {
    detailsCardName.classList.add('hide');
    detailsCardNameFormInput.value = cardName;
    detailsCardNameForm.classList.remove('hide');
    detailsCardNameFormInput.focus();
  });

  detailsCardNameForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if(detailsCardNameFormInput.value.trim()) {
      detailsCardNameForm.classList.add('hide');
      detailsCardName.classList.remove('hide');
      cardNameChange(cardId, detailsCardNameFormInput.value);
    }
  });


  const descriptionButton = document.querySelector('.modal__card_info_details_button');
  const descriptionForm = document.querySelector('.modal__card_info_details_add');
  const descriptionTextarea = document.querySelector('.modal__card_info_details_add_textarea');
  const descriptionClose = document.querySelector('.modal__card_info_details_actions_close');

  descriptionButton.addEventListener('click', () => {
    descriptionButton.classList.add('hide');
    descriptionForm.classList.remove('hide');
    descriptionTextarea.focus();
  });

  descriptionForm.addEventListener('submit', (e) => {
    e.preventDefault();

    descriptionButton.classList.remove('hide');
    descriptionForm.classList.add('hide');
  });
}

function cardModal({
  columnName,
  cardName,
  cardId,
  cardNameChange
}) {
  const modal = createModal();
  cardModalReRender(cardName, columnName, cardId, cardNameChange);
  return modal;
}
