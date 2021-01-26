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
  comments,
  cardNameChange,
  cardDescriptionChange,
  cardCommentsAdd
) {
  const modalContent = document.querySelector('.modal__content');
  console.log();
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

      <div class="modal__card_info modal__card_info_actions">
        <div class="modal__card_info_icon_and_details">
          <span class="modal__card_info_icon">
            <i class="fas fa-align-left"></i>
          </span>
          <div class="modal__card_info_details modal__card_info_details_section">
            <p>Действия</p>
          </div>
        </div>
      </div>
    </div>

    <div class="modal__card_info_menu">

    </div>
  `;

  document.title = `${cardName} на доске ${boardName} | Trello`;

  const detailsCardSection = document.querySelector('.modal__card_info_name');
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
      cardNameChange(cardId, detailsCardNameFormInput.value, description, comments);
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
    cardDescriptionChange(cardId, cardName, descriptionAddTextarea.value, comments);
  });

  descriptionAddClose.addEventListener('click', () => {
    if(!description) {
      descriptionAddSection.classList.add('hide');
      descriptionButton.classList.remove('hide');
    } else {
      descriptionAddSection.classList.add('hide');
      descriptionContainer.classList.remove('hide');
    }
  });

  descriptionContainer.addEventListener('click', () => {
    descriptionAddSectionOpen();
  });


  const actionsSection = document.querySelector('.modal__card_info_actions');

  const commentAddSection = actionsSection.appendChild(document.createElement('div'));
  commentAddSection.classList.add('modal__card_info_actions_comment');

  const commentAddAvatarContainer = commentAddSection.appendChild(document.createElement('div'));
  commentAddAvatarContainer.classList.add('modal__card_info_actions_comment_avatar_container');

  const commentAddAvatar = commentAddAvatarContainer.appendChild(document.createElement('img'));
  commentAddAvatar.classList.add('modal__card_info_actions_comment_avatar');
  commentAddAvatar.src = 'https://trello-members.s3.amazonaws.com/60058042b46eb66edeca586b/a96d6a3db08e0252d26932585362b287/30.png';
  commentAddAvatar.alt = 'Avatar';

  const commentContainer = commentAddSection.appendChild(document.createElement('div'));
  commentContainer.classList.add('modal__card_info_actions_comment_container');
  commentContainer.classList.add('hide');

  const commentTextarea = commentContainer.appendChild(document.createElement('textarea'));
  commentTextarea.classList.add('modal__card_info_actions_comment_textarea');
  commentTextarea.placeholder = 'Напишите комментарий...';

  const commentSave = commentContainer.appendChild(document.createElement('button'));
  commentSave.classList.add('modal__card_info_actions_comment_save');
  commentSave.innerHTML = 'Сохранить';
  if(!commentTextarea.value.trim()) {
    commentSave.classList.add('disabled');
  } else {
    commentSave.classList.remove('disabled');
  }

  function createComment(value, time, fullTime) {
    const commentSection = actionsSection.appendChild(document.createElement('div'));
    commentSection.classList.add('modal__card_info_actions_comment_comment');
  
    const commentAvatarSection = commentSection.appendChild(document.createElement('div'));
    commentAvatarSection.classList.add('modal__card_info_actions_comment_comment_avatar_section');
  
    const commentAvatar = commentAvatarSection.appendChild(document.createElement('img'));
    commentAvatar.src = 'https://trello-members.s3.amazonaws.com/60058042b46eb66edeca586b/a96d6a3db08e0252d26932585362b287/30.png';
    commentAvatar.alt = 'Avatar';
  
    const commentInfoSection = commentSection.appendChild(document.createElement('div'));
    commentInfoSection.classList.add('modal__card_info_actions_comment_comment_info_section');
  
    const commentCreationInfo = commentInfoSection.appendChild(document.createElement('div'));
    commentCreationInfo.classList.add('modal__card_info_actions_comment_comment_creation_info');
  
    const commentCreationUsername = commentCreationInfo.appendChild(document.createElement('p'));
    commentCreationUsername.classList.add('modal__card_info_actions_comment_comment_creation_info_username');
    commentCreationUsername.innerHTML = 'Artur';
  
    const commentCreationTime = commentCreationInfo.appendChild(document.createElement('span'));
    commentCreationTime.classList.add('modal__card_info_actions_comment_comment_creation_info_time');
    commentCreationTime.title = time;
    commentCreationTime.innerHTML = moment(fullTime).fromNow();

    const commentInfo = commentInfoSection.appendChild(document.createElement('p'));
    commentInfo.classList.add('modal__card_info_actions_comment_comment_info');
    commentInfo.innerHTML = value;
  }

  comments.map(comment => {
    createComment(comment.value, comment.time, comment.fullTime);
  });


  commentTextarea.addEventListener('input', () => {
    if(!commentTextarea.value.trim()) {
      commentSave.classList.add('disabled');
    } else {
      commentSave.classList.remove('disabled');
    }
  });

  commentTextarea.addEventListener('click', () => {
    if(commentContainer.classList.contains('hide')) {
      commentContainer.classList.remove('hide');

      setTimeout(() => {
        commentSave.classList.add('open');
      }, 200);
    }
  });

  commentSave.addEventListener('click', () => {
    if(commentTextarea.value.trim()) {
      cardCommentsAdd(
        cardId,
        cardName,
        description,
        [...comments, {
          id: randomId(),
          value: commentTextarea.value,
          time: moment().format('MMMM Do YYYY, h:mm a'),
          fullTime: moment().format()
        }]
      );
  
      commentContainer.classList.add('hide');
      commentSave.classList.remove('open');
      commentTextarea.value = '';
    }
  });

  modalContent.addEventListener('click', (e) => {
    if(e.target !== commentContainer &&
       e.target !== commentTextarea &&
       e.target !== commentSave) {
      commentContainer.classList.add('hide');
      commentSave.classList.remove('open');
      commentTextarea.value = '';
    }
  });
}

function cardModal({
  columnName,
  cardName,
  cardId,
  description,
  comments,
  cardNameChange,
  cardDescriptionChange,
  cardCommentsAdd
}) {
  const modal = createModal();
  cardModalReRender(
    cardName,
    columnName,
    cardId,
    description,
    comments,
    cardNameChange,
    cardDescriptionChange,
    cardCommentsAdd
  );
  return modal;
}
