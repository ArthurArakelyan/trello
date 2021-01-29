let labels = [
  {id: randomId(), value: '', color: '#61bd4f'},
  {id: randomId(), value: '', color: '#f2d600'},
  {id: randomId(), value: '', color: '#ff9f1a'},
  {id: randomId(), value: '', color: '#eb5a46'},
  {id: randomId(), value: '', color: '#c377e0'},
  {id: randomId(), value: '', color: '#0079bf'}
];

const labelColors = [
  '#61bd4f',
  '#f2d600',
  '#ff9f1a',
  '#eb5a46',
  '#c377e0',
  '#0079bf',
  '#00c2e0',
  '#51e898',
  '#ff78cb',
  '#344563',
  '#b3bac5'
];

if(!localStorage.getItem('labels')) {
  localStorage.setItem('labels', JSON.stringify(labels));
} else {
  labels = JSON.parse(localStorage.getItem('labels'));
}

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

  if(document.querySelectorAll('.modal').length > 1) {
    modal.remove();
    document.title = defaultTitle;
  }

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
  card,
  columnName,
  cardNameChange,
  cardDescriptionChange,
  cardCommentsChange,
  cardLabelsChange,
  cardActiveLabelsChange
) {
  const {value: cardName, description, comments, activeLabels, cardLabels} = card;

  const modalContent = document.querySelector('.modal__content');
  modalContent.innerHTML = `
    <span class="modal__close" data-close="true">
      <i class="fas fa-times" data-close="true"></i>
    </span>
    <div class="modal__card_infos">
      <div class="modal__card_info modal__card_info_name">
        <span class="modal__card_info_icon">
          <i class="far fa-credit-card"></i>
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

    <div class="modal__card_upgrades_menu">
      <div class="modal__card_upgrades">
        <h5 class="modal__card_upgrade_heading">добавить на карточку</h5>
        <button class="modal__card_upgrade_button">
          <i class="far fa-user"></i>
          <p>Участники</p>
        </button>
        <button class="modal__card_upgrade_button">
          <i class="fas fa-tag"></i>
          <p>Метки</p>
        </button>
        <button class="modal__card_upgrade_button">
          <i class="far fa-check-square"></i>
          <p>Чек-лист</p>
        </button>
        <button class="modal__card_upgrade_button">
          <i class="far fa-clock"></i>
          <p>Срок</p>
        </button>
        <button class="modal__card_upgrade_button">
          <i class="fas fa-paperclip"></i>
          <p>Вложение</p>
        </button>
        <button class="modal__card_upgrade_button">
          <i class="far fa-credit-card"></i>
          <p>Обложка</p>
        </button>
      </div>
    </div>
  `;

  document.title = `${cardName} на доске ${boardName} | Trello`;

  const detailsCardInfo = document.querySelector('.modal__card_info_details');
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
      if(detailsCardNameFormInput.value !== cardName) {
        cardNameChange(card, detailsCardNameFormInput.value);
      }
      detailsCardNameForm.classList.add('hide');
      detailsCardName.classList.remove('hide');
      detailsCardNameFormInput.value = '';
    }
  });

  if(activeLabels.length) {
    const detailsActiveLabels = detailsCardInfo.appendChild(document.createElement('div'));
    detailsActiveLabels.classList.add('modal__card_info_details_labels');

    const detailsActiveLabelHeading = detailsActiveLabels.appendChild(document.createElement('h6'));
    detailsActiveLabelHeading.classList.add('modal__card_info_details_labels_heading');
    detailsActiveLabelHeading.innerHTML = 'МЕТКИ';

    const deatilsActiveLabelsContainer = detailsActiveLabels.appendChild(document.createElement('div'));
    deatilsActiveLabelsContainer.classList.add('modal__card_info_details_labels_container');

    activeLabels.map(label => {
      const detailsActiveLabel = deatilsActiveLabelsContainer.appendChild(document.createElement('div'))
      detailsActiveLabel.classList.add('modal__card_info_details_labels_label');
      detailsActiveLabel.style.backgroundColor = label.color;

      if(label.value) {
        const detailsActiveLabelValue = detailsActiveLabel.appendChild(document.createElement('p'));
        detailsActiveLabelValue.classList.add('modal__card_info_details_labels_label_value');
        detailsActiveLabelValue.innerHTML = label.value;
      }
    });
  }

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
    cardDescriptionChange(card, descriptionAddTextarea.value);
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

  function createComment({value, time, fullTime, id, changed, changedTime}) {
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
  
    const commentCreationTimeSection = commentCreationInfo.appendChild(document.createElement('p'));
    commentCreationTimeSection.classList.add('modal__card_info_actions_comment_comment_creation_info_time');

    const commentCreationTime = commentCreationTimeSection.appendChild(document.createElement('span'));
    commentCreationTime.title = time;
    commentCreationTime.innerHTML = moment(fullTime).fromNow();

    if(changed) {
      const commentCreationTimeChanged = commentCreationTimeSection.appendChild(document.createElement('span'));
      commentCreationTimeChanged.innerHTML = '(изменён)';
      if(changedTime) {
        commentCreationTimeChanged.title = moment(changedTime).fromNow();
      }
    }

    const commentInfo = commentInfoSection.appendChild(document.createElement('p'));
    commentInfo.classList.add('modal__card_info_actions_comment_comment_info');
    commentInfo.innerHTML = value;

  
    const commentEditContainer = commentInfoSection.appendChild(document.createElement('div'));
    commentEditContainer.classList.add('modal__card_info_actions_comment_edit_container');
    commentEditContainer.classList.add('hide');
  
    const commentEditTextarea = commentEditContainer.appendChild(document.createElement('textarea'));
    commentEditTextarea.classList.add('modal__card_info_actions_comment_textarea');
    
    const commentEditButtons = commentEditContainer.appendChild(document.createElement('div'));
    commentEditButtons.classList.add('modal__card_info_actions_comment_buttons');
  
    const commentEditSave = commentEditButtons.appendChild(document.createElement('button'));
    commentEditSave.classList.add('modal__card_info_actions_comment_save');
    commentEditSave.classList.add('modal__card_info_actions_comment_edit_save');
    commentEditSave.innerHTML = 'Сохранить';

    const commentEditClose = commentEditButtons.appendChild(document.createElement('button'));
    commentEditClose.classList.add('modal__card_info_actions_comment_close');
    commentEditClose.innerHTML = '<i class="fas fa-times"></i>';


    const commentActions = commentInfoSection.appendChild(document.createElement('div'));
    commentActions.classList.add('modal__card_info_actions_comment_comment_actions');

    const commentEdit = commentActions.appendChild(document.createElement('button'));
    commentEdit.classList.add('modal__card_info_actions_comment_comment_actions_action');
    commentEdit.innerHTML = 'Изменить';

    const commentButtonsDivider = commentActions.appendChild(document.createElement('span'));
    commentButtonsDivider.classList.add('modal__card_info_actions_comment_comment_actions_divider');
    commentButtonsDivider.innerHTML = '-';

    const commentDelete = commentActions.appendChild(document.createElement('button'));
    commentDelete.classList.add('modal__card_info_actions_comment_comment_actions_action');
    commentDelete.innerHTML = 'Удалить';

    commentEdit.addEventListener('click', () => {
      commentEditContainer.classList.remove('hide');
      commentInfo.classList.add('hide');
      commentEditTextarea.value = value;
      commentEditTextarea.focus();
    });

    commentEditTextarea.addEventListener('input', () => {
      if(!commentEditTextarea.value.trim()) {
        commentEditSave.classList.add('disabled');
      } else {
        commentEditSave.classList.remove('disabled');
      }
    });

    commentEditSave.addEventListener('click', () => {
      if(commentEditTextarea.value.trim()) {
        commentEditContainer.classList.add('hide');
        commentInfo.classList.remove('hide');
        cardCommentsChange(
          card,
          comments.map(com => {
            if(com.id === id && com.value !== commentEditTextarea.value) {
              com.value = commentEditTextarea.value;
              com.changed = true;
              com.changedTime = moment().format();
            }

            return com;
          })
        );

        commentEditTextarea.value = '';
      }
    });

    commentEditClose.addEventListener('click', () => {
      commentEditContainer.classList.add('hide');
      commentInfo.classList.remove('hide');
      commentEditTextarea.value = '';
    });

    commentDelete.addEventListener('click', () => {
      cardCommentsChange(
        card,
        comments.filter(com => com.id !== id)
      );
    });
  }

  comments.map(comment => {
    createComment(comment);
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
      cardCommentsChange(
        card,
        [...comments, {
          id: randomId(),
          value: commentTextarea.value,
          time: moment().format('MMMM Do YYYY, h:mm a'),
          fullTime: moment().format(),
          changed: false,
          changedTime: null
        }]
      );
  
      commentContainer.classList.add('hide');
      commentSave.classList.remove('open');
      commentTextarea.value = '';
    }
  });

  // upgardes

  const upgradesSection = document.querySelector('.modal__card_upgrades_menu');
  const upgradeButtons = document.querySelectorAll('.modal__card_upgrade_button');

  upgradeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.popover').forEach(p => p.remove());
      const popoverBody = document.createElement('div');
      popoverBody.classList.add('popover__body');

      if(btn.lastElementChild.textContent === 'Метки') {
        const popoverLabelHeading = popoverBody.appendChild(document.createElement('h4'));
        popoverLabelHeading.classList.add('popover__label_heading');
        popoverLabelHeading.innerHTML = btn.lastElementChild.textContent;

        const popoverLabels = popoverBody.appendChild(document.createElement('ul'));
        popoverLabels.classList.add('popover__label_labels');

        cardLabels.map(label => {
          const popoverLabel = popoverLabels.appendChild(document.createElement('li'));
          popoverLabel.classList.add('popover__labels_label');

          const popoverLabelColor = popoverLabel.appendChild(document.createElement('div'));
          popoverLabelColor.classList.add('popover__labels_label_color');
          popoverLabelColor.style.backgroundColor = label.color;
          if(label.value) {
            const popoverLabelValue = popoverLabelColor.appendChild(document.createElement('p'));
            popoverLabelValue.classList.add('popover__labels_label_value');
            popoverLabelValue.innerHTML = label.value;
          }

          if(label.active) {
            const popoverLabelActive = popoverLabelColor.appendChild(document.createElement('span'))
            popoverLabelActive.classList.add('popover__labels_label_active');
            popoverLabelActive.innerHTML = '<i class="fas fa-check"></i>';
          }

          const popoverLabelEdit = popoverLabel.appendChild(document.createElement('span'));
          popoverLabelEdit.innerHTML = '<i class="fas fa-pencil-alt"></i>';
          popoverLabelEdit.id = label.id;

          popoverLabelColor.addEventListener('mouseenter', function() {
            this.style.boxShadow = `-8px 0 ${`${label.color}bb`}`;
          });

          popoverLabelColor.addEventListener('mouseleave', function() {
            this.style.boxShadow = '';
          });

          popoverLabelColor.addEventListener('click', () => {
            if(!label.active) {
              cardLabelsChange(
                card,
                cardLabels.map(l => {
                  if(l.id === label.id && !l.active) {
                    return {
                      ...l,
                      active: true
                    }
                  }
  
                  return l;
                })
              );
              cardActiveLabelsChange(
                card,
                [...activeLabels, {...label}]
              );
            } else {
              cardLabelsChange(
                card,
                cardLabels.map(l => {
                  if(l.id === label.id && l.active) {
                    return {
                      ...l,
                      active: false
                    }
                  }
  
                  return l;
                })
              );
              cardActiveLabelsChange(
                card,
                activeLabels.filter(l => l.id !== label.id)
              );
            }
            reRender();
          });

          popoverLabelEdit.addEventListener('click', function() {
            popoverBody.innerHTML = '';

            const edittingLabel = labels.find(l => l.id === this.id);

            const popoverEditBody = document.createElement('div');
            popoverEditBody.classList.add('popover__body');

            const popoverLabelNameEditSection = popoverEditBody.appendChild(document.createElement('div'));
            popoverLabelNameEditSection.classList.add('popover__label_editting_name_section');

            const popoverLabelNameEditHeading = popoverLabelNameEditSection.appendChild(document.createElement('h3'));
            popoverLabelNameEditHeading.classList.add('popover__label_editting_name_heading');
            popoverLabelNameEditHeading.classList.add('popover__label_editting_heading');
            popoverLabelNameEditHeading.innerHTML = 'Название';

            const popoverLabelNameEditInput = popoverLabelNameEditSection.appendChild(document.createElement('input'));
            popoverLabelNameEditInput.classList.add('popover__label_editting_name_input');
            popoverLabelNameEditInput.value = edittingLabel.value;

            const popoverLabelColorEditSection = popoverEditBody.appendChild(document.createElement('div'));
            popoverLabelColorEditSection.classList.add('popover__label_editting_color_section');

            const popoverLabelColorEditHeading = popoverLabelColorEditSection.appendChild(document.createElement('h4'));
            popoverLabelColorEditHeading.classList.add('popover__label_editting_color_heading');
            popoverLabelColorEditHeading.classList.add('popover__label_editting_heading');
            popoverLabelColorEditHeading.innerHTML = 'Цвета';

            const popoverLabelColorsEdit = popoverLabelColorEditSection.appendChild(document.createElement('div'));
            popoverLabelColorsEdit.classList.add('popover__label_editting_colors');

            labelColors.map(label => {
              const popoverLabelColorEdit = popoverLabelColorsEdit.appendChild(document.createElement('div'));
              popoverLabelColorEdit.classList.add('popover__label_editting_color');
              popoverLabelColorEdit.style.backgroundColor = label;
              popoverLabelColorEdit.dataset.active = edittingLabel.color === label ? true : false;
              popoverLabelColorEdit.dataset.color = label;

              const popoverLabelEditColorActive = document.createElement('span');
              popoverLabelEditColorActive.classList.add('popover__label_editting_color_active');
              popoverLabelEditColorActive.innerHTML = '<i class="fas fa-check"></i>';

              if(popoverLabelColorEdit.dataset.active === 'true') {
                popoverLabelColorEdit.appendChild(popoverLabelEditColorActive);
                popoverLabelColorEdit.dataset.active = true;
              }

              popoverLabelColorEdit.addEventListener('click', function() {
                edittingLabel.color = this.dataset.color;
                document.querySelectorAll('.popover__label_editting_color').forEach(color => {
                  color.dataset.active = false;
                  if(color.lastElementChild) {
                    color.lastElementChild.remove();
                  }
                });
                this.dataset.active = true;
                this.appendChild(popoverLabelEditColorActive);
              });
            });

            const popoverLabelEditButtons = popoverEditBody.appendChild(document.createElement('div'));
            popoverLabelEditButtons.classList.add('popover__label_editting_buttons');

            const popoverLabelEditSaveButton = popoverLabelEditButtons.appendChild(document.createElement('button'));
            popoverLabelEditSaveButton.classList.add('popover__label_editting_buttons_button');
            popoverLabelEditSaveButton.classList.add('popover__label_editting_buttons_save');
            popoverLabelEditSaveButton.innerHTML = 'Сохранить';

            const popoverLabelEditRemoveButton = popoverLabelEditButtons.appendChild(document.createElement('button'));
            popoverLabelEditRemoveButton.classList.add('popover__label_editting_buttons_button');
            popoverLabelEditRemoveButton.classList.add('popover__label_editting_buttons_delete');
            popoverLabelEditRemoveButton.innerHTML = 'Удалить';

            popoverLabelEditSaveButton.addEventListener('click', () => {
              edittingLabel.value = popoverLabelNameEditInput.value;

              labels = labels.map(l => l.id === this.id ? edittingLabel : l);
              localStorage.setItem('labels', JSON.stringify(labels));

              cardLabelsChange(card, cardLabels.map(l => {
                const label = labels.find(label => label.id === l.id);
                return {
                  ...l,
                  value: label.value,
                  color: label.color
                }
              }));
              cardActiveLabelsChange(card, activeLabels.map(l => {
                const label = labels.find(label => label.id === l.id);
                return {
                  ...l,
                  value: label.value,
                  color: label.color
                }
              }));
              reRender();
            });

            popoverLabelEditRemoveButton.addEventListener('click', () => {
              labels = labels.filter(l => l.id !== this.id);
              localStorage.setItem('labels', JSON.stringify(labels));

              allCardsLabelsChange(this.id);
              cardLabelsChange(card, cardLabels.filter(l => l.id !== this.id));
              cardActiveLabelsChange(card, activeLabels.filter(l => l.id !== this.id));
              reRender();
            });

            popoverReRender('Изменение метки', popoverEditBody);
          });
        });

        const popoverLabelCreate = popoverBody.appendChild(document.createElement('button'));
        popoverLabelCreate.classList.add('popover__label_create_button');
        popoverLabelCreate.innerHTML = 'Создать новую метку';
      } else {
        return;
      }

      createPopover(upgradesSection);
      popoverReRender(btn.lastElementChild.textContent, popoverBody);
    });
  });

  modalContent.addEventListener('click', (e) => {
    if(e.target !== commentContainer &&
       e.target !== commentTextarea &&
       e.target !== commentSave) {
      commentContainer.classList.add('hide');
      commentSave.classList.remove('open');
      commentTextarea.value = '';
    }

    if(e.target !== detailsCardName &&
       e.target !== detailsCardNameForm &&
       e.target !== detailsCardNameFormInput) {
      if(detailsCardNameFormInput.value.trim()) {
        if(detailsCardNameFormInput.value !== cardName) {
          cardNameChange(card, detailsCardNameFormInput.value);
        }
        detailsCardNameForm.classList.add('hide');
        detailsCardName.classList.remove('hide');
        detailsCardNameFormInput.value = '';
      }
    }

    if(e.target !== descriptionContainer &&
       e.target !== descriptionButton &&
       e.target !== descriptionAddTextarea &&
       e.target !== descriptionAddSection &&
       e.target !== descriptionAddSave &&
       e.target !== descriptionAddClose) {
      if(!description) {
        descriptionAddSection.classList.add('hide');
        descriptionButton.classList.remove('hide');
      } else {
        descriptionAddSection.classList.add('hide');
        descriptionContainer.classList.remove('hide');
      }
    }
  });
}

function cardModal({
  card,
  columnName,
  cardNameChange,
  cardDescriptionChange,
  cardCommentsChange,
  cardLabelsChange,
  cardActiveLabelsChange
}) {
  const modal = createModal();
  cardModalReRender(
    card,
    columnName,
    cardNameChange,
    cardDescriptionChange,
    cardCommentsChange,
    cardLabelsChange,
    cardActiveLabelsChange
  );
  return modal;
}
