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

function cardModalReRender(
  cardName,
  columnName,
  cardId,
  description,
  cardNameChange,
  cardDescriptionChange
) {
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
          <i class="fas fa-align-justify"></i>
        </span>
        <div class="modal__card_info_details modal__card_info_details_description_section">
          <p>Описание</p>
        </div>
      </div>
      <div class="modal__card_info modal__card_info_description">
        <span class="modal__card_info_icon">
          <i class="fas fa-align-justify"></i>
        </span>
        <div class="modal__card_info_details modal__card_info_details_action_section">
          <p>Действия</p>
        </div>
      </div>
    </div>

    <div class="modal__card_info_menu">

    </div>
  `;

  document.title = `${cardName} на доске ${boardName} | Trello`;

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
      cardNameChange(cardId, detailsCardNameFormInput.value, description);
    }
  });


  const descriptionSection = document.querySelector('.modal__card_info_details_description_section');

  const descriptionButton = descriptionSection.appendChild(document.createElement('button'));
  descriptionButton.classList.add('modal__card_info_details_button');
  descriptionButton.innerHTML = 'Добавить более подробное описание...';


  const descriptionAddSection = descriptionSection.appendChild(document.createElement('div'));
  descriptionAddSection.classList.add('modal__card_info_details_add');
  descriptionAddSection.classList.add('hide');

  const descriptionAddTextarea = descriptionAddSection.appendChild(document.createElement('textarea'));
  descriptionAddTextarea.classList.add('modal__card_info_details_add_textarea');
  descriptionAddTextarea.placeholder = 'Добавить более подробное описание...';

  const descriptionAddButtons = descriptionAddSection.appendChild(document.createElement('div'));
  descriptionAddButtons.classList.add('modal__card_info_details_add_actions');

  const descriptionAddSave = descriptionAddButtons.appendChild(document.createElement('button'));
  descriptionAddSave.classList.add('modal__card_info_details_actions_save');
  descriptionAddSave.innerHTML = 'Сохранить';

  const descriptionAddClose = descriptionAddButtons.appendChild(document.createElement('i'));
  descriptionAddClose.classList.add('modal__card_info_details_actions_close');
  descriptionAddClose.classList.add('fas');
  descriptionAddClose.classList.add('fa-times');


  const descriptionContainer = descriptionSection.appendChild(document.createElement('p'));
  descriptionContainer.classList.add('modal__card_info_details_description');
  if(!description) {
    descriptionContainer.classList.add('hide');
  } else {
    descriptionContainer.innerHTML = description;
    descriptionButton.classList.add('hide');
  }

  function descriptionAddSectionOpen() {
    descriptionContainer.classList.add('hide');
    descriptionButton.classList.add('hide');
    descriptionAddSection.classList.remove('hide');
    descriptionAddTextarea.focus();
    descriptionAddTextarea.value = description;
  }

  descriptionButton.addEventListener('click', () => {
    descriptionAddSectionOpen();
  });

  descriptionAddSave.addEventListener('click', () => {
    descriptionAddSection.classList.add('hide');
    descriptionButton.classList.remove('hide');
    cardDescriptionChange(cardId, cardName, descriptionAddTextarea.value);
  });

  descriptionAddClose.addEventListener('click', () => {
    descriptionAddSection.classList.add('hide');
    descriptionButton.classList.remove('hide');
  });

  descriptionContainer.addEventListener('click', () => {
    descriptionAddSectionOpen();
  });
}

function cardModal({
  columnName,
  cardName,
  cardId,
  description,
  cardNameChange,
  cardDescriptionChange
}) {
  const modal = createModal();
  cardModalReRender(cardName, columnName, cardId, description, cardNameChange, cardDescriptionChange);
  return modal;
}
