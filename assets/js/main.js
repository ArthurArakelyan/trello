const header = document.querySelector('.header');
const homeColumnsContainer = document.querySelector('.home__columns');
const homeColumns = document.querySelector('.home__columns_content');
const defaultTitle = 'Trello';

let columns = [
  { value: 'To do',  id: randomId(), cardsArray: [] },
  { value: 'Doing', id: randomId(), cardsArray: [] },
  { value: 'Done', id: randomId(), cardsArray: [] }
];

if (!localStorage.getItem('columns')) {
  localStorage.setItem('columns', JSON.stringify(columns));
} else {
  columns = JSON.parse(localStorage.getItem('columns'));
}

function randomId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

function move(array, oldIndex, newIndex) {
  if (newIndex >= array.length) {
    newIndex = array.length - 1;
  }
  array.splice(newIndex, 0, array.splice(oldIndex, 1)[0]);
  return array;
}

function allCardsLabelsChange(id) {
  const newColumns = columns.map(columns => {
    columns.cardsArray.map(card => {
      card.activeLabels = card.activeLabels.filter(l => l.id !== id);
      card.cardLabels = card.cardLabels.filter(l => l.id !== id);
    });
  });
  localStorage.setItem('columns', JSON.stringify(newColumns));
}

class Column {
  constructor(listName, id = randomId(), cardsArray = []) {
    this.id = id;
    this.listName = listName;
    this.cardsArray = cardsArray;

    this.column = homeColumns.appendChild(document.createElement('div'));
    this.column.classList.add('column');
    this.column.id = this.id;
    this.column.draggable = true;

    this.columnHeader = this.column.appendChild(document.createElement('div'));
    this.columnHeader.classList.add('column__header');

    // column header

    this.columnName = this.columnHeader.appendChild(document.createElement('h2'));
    this.columnName.classList.add('column__header_name');
    this.columnName.innerHTML = this.listName;

    this.columnForm = this.columnHeader.appendChild(document.createElement('form'));
    this.columnForm.classList.add('column__header_form');
    this.columnForm.classList.add('hide');

    this.columnNameInput = this.columnForm.appendChild(document.createElement('input'));
    this.columnNameInput.classList.add('column__header_form_input');
    this.columnNameInput.value = this.listName;

    this.columnExtras = this.columnHeader.appendChild(document.createElement('button'));
    this.columnExtras.classList.add('column__header_extras');
    this.columnExtras.innerHTML = '<i class="fas fa-ellipsis-h"></i>';

    this.columnName.addEventListener('click', () => {
      document.querySelectorAll('.column__header_form').forEach(form => form.classList.add('hide'));
      document.querySelectorAll('.column__header_name').forEach(name => name.classList.remove('hide'));

      this.columnNameInput.value = this.listName;
      this.columnForm.classList.remove('hide');
      this.columnName.classList.add('hide');
      this.columnNameInput.focus();
    });

    this.columnForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (this.columnNameInput.value.trim() && this.columnNameInput.value.trim() !== this.listName) {
        this.nameChange();
      }

      this.columnForm.classList.add('hide');
      this.columnName.classList.remove('hide');
      this.columnNameInput.value = '';
    });

    // column cards

    this.cards = this.column.appendChild(document.createElement('div'));
    this.cards.classList.add('column__cards');
    if(!this.cardsArray.length) {
      this.cards.style.display = 'none';
    }

    this.cardsCreating = this.column.appendChild(document.createElement('div'));
    this.cardsCreating.classList.add('column__cards_creating');

    this.newCardButton = this.cardsCreating.appendChild(document.createElement('button'));
    this.newCardButton.classList.add('column__cards_new_card');
    this.newCardButton.innerHTML = `
      <i class="fas fa-plus"></i>

      <span>Добавить карточку</span>
    `;

    this.cardAdd = this.cardsCreating.appendChild(document.createElement('form'));
    this.cardAdd.classList.add('column__cards_add');
    this.cardAdd.classList.add('hide');

    this.cardAddTextArea = this.cardAdd.appendChild(document.createElement('textarea'));
    this.cardAddTextArea.classList.add('column__cards_add_textarea');
    this.cardAddTextArea.placeholder = 'Ввести заголовок для этой карточки';

    this.cardAddButtons = this.cardAdd.appendChild(document.createElement('div'));
    this.cardAddButtons.classList.add('column__cards_buttons');

    this.cardAddButton = this.cardAddButtons.appendChild(document.createElement('button'));
    this.cardAddButton.classList.add('column__cards_add_button');
    this.cardAddButton.innerHTML = 'Добавить карточку';

    this.cardAddClose = this.cardAddButtons.appendChild(document.createElement('button'));
    this.cardAddClose.classList.add('column__cards_add_close');
    this.cardAddClose.innerHTML = '<i class="fas fa-times"></i>';

    this.newCardButton.addEventListener('click', () => {
      const cards = document.querySelectorAll('.column__cards_creating');
      cards.forEach(card => {
        card.lastChild.classList.add('hide');
        card.firstChild.classList.remove('hide');
      });

      this.cardAdd.classList.remove('hide');
      this.newCardButton.classList.add('hide');
      this.cardAddTextArea.focus();
    });

    this.cardAddClose.addEventListener('click', () => {
      this.cardAdd.classList.add('hide');
      this.newCardButton.classList.remove('hide');
      this.cardAddTextArea.value = '';
    });

    this.cardAdd.addEventListener('submit', (e) => {
      e.preventDefault();

      if(this.cardAddTextArea.value.trim()) {
        this.cardAdd.classList.add('hide');
        this.newCardButton.classList.remove('hide');
        this.createCardObject(this.cardAddTextArea.value);
        this.cardsReRender();
        this.cardAddTextArea.value = '';
      }
    });

    // window event

    window.addEventListener('click', (e) => {
      if(e.target !== this.columnName &&
         e.target !== this.columnNameInput) {
        if (this.columnNameInput.value.trim() && this.columnNameInput.value.trim() !== this.listName) {
          this.nameChange();
        }
    
        this.columnForm.classList.add('hide');
        this.columnName.classList.remove('hide');
        this.columnNameInput.value = '';
      }

      if(e.target !== this.cardAdd &&
         e.target !== this.cardAddButton &&
         e.target !== this.cardAddButtons &&
         e.target !== this.cardAddClose &&
         e.target !== this.cardAddTextArea &&
         e.target !== this.newCardButton &&
         e.target !== this.cardsCreating &&
         e.target !== this.newCardButton.firstElementChild &&
         e.target !== this.newCardButton.lastElementChild) {
        this.cardAdd.classList.add('hide');
        this.newCardButton.classList.remove('hide');
        this.cardAddTextArea.value = '';
      }
    });
  }

  nameChange = () => {
    columns.map(col => {
      if (col.id === this.id) {
        col.value = this.columnNameInput.value;
        localStorage.setItem('columns', JSON.stringify(columns));
      }

      return col;
    });

    this.listName = this.columnNameInput.value;
    this.columnName.innerHTML = this.listName;
  }

  cardsReRender = () => {
    this.removeAllCards();
    columns.filter(col => col.id === this.id ? this.cardsArray = col.cardsArray : this.cardsArray);
    if(this.cardsArray.length) {
      this.cards.style.display = 'flex';
    }
    this.cardsArray.map(card => {
      console.log(card);
      return this.createCard(card);
    });
    localStorage.setItem('columns', JSON.stringify(columns));
    this.cardsDragAndDrop();
  }

  removeAllCards = () => {
    document.querySelectorAll(`.${this.id}__column_card`).forEach(card => {
      card.remove();
    });
  }

  createCardObject = (name) => {
    columns.map(col => {
      if(col.id === this.id) {
        col.cardsArray.push({
          id: randomId(),
          value: name,
          description: '',
          comments: [],
          cardLabels: labels,
          activeLabels: []
        });
        this.cardsArray = col.cardsArray;
        localStorage.setItem('columns', JSON.stringify(columns));
      }

      return col;
    });
  }

  cardsDragAndDrop = () => {
    const cards = document.querySelectorAll(`.${this.id}__column_card`);

    let draggedCard = null;
    cards.forEach(card => {
      card.addEventListener('dragstart', (e) => {
        const cardArray = columns.find(col => col.id === this.id).cardsArray;
        draggedCard = cardArray.findIndex(card => card.id === e.target.id);
      });
  
      card.addEventListener('dragover', function(e) {
        e.preventDefault();
      });
  
      card.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
  
        const cardArray = columns.find(col => col.id === this.id).cardsArray;
        const droppedCard = cardArray.findIndex(card => card.id === e.target.id);
        move(cardArray, draggedCard, droppedCard);
        this.cardsReRender();
      });
    });
  }

  cardPropertyChange = (cardId, property, newProperty) => {
    columns.map(col => {
      if(col.id === this.id) {
        col.cardsArray.map(c => {
          if(c.id === cardId) {
            c[property] = newProperty;
            this.cardsArray = col.cardsArray;
            localStorage.setItem('columns', JSON.stringify(columns));
          }

          return c;
        });
      }

      return col;
    });
  }

  createCard = (card) => {
    console.log('createCard', card);
    const {value: name, id, description, comments, activeLabels, cardLabels} = card;
    this.cardPropertyChange(id, 'cardLabels', cardLabels.map(l => {
      const label = labels.find(label => label.id === l.id);
      return {
        ...l,
        value: label.value,
        color: label.color
      }
    }));
    this.cardPropertyChange(id, 'activeLabels', activeLabels.map(l => {
      const label = labels.find(label => label.id === l.id);
      return {
        ...l,
        value: label.value,
        color: label.color
      }
    }));

    this.card = this.cards.appendChild(document.createElement('button'));
    this.card.classList.add('column__card');
    this.card.classList.add(`${this.id}__column_card`);
    this.card.draggable = true;
    this.card.id = id;

    if(activeLabels.length) {
      this.cardLabels = this.card.appendChild(document.createElement('div'));
      this.cardLabels.classList.add('column__card_labels');

      activeLabels.map(label => {
        this.cardLabel = this.cardLabels.appendChild(document.createElement('div'));
        this.cardLabel.classList.add('column__card_label');
        this.cardLabel.classList.add(`${id}_column__card_label`);
        this.cardLabel.style.backgroundColor = label.color;

        if(label.value) {
          this.cardLabel.title = label.value;
        }

        this.cardLabel.addEventListener('click', function(e) {
          e.stopPropagation();
          this.parentElement.classList.toggle('active');
        });
      });
    }

    this.cardName = this.card.appendChild(document.createElement('span'));
    this.cardName.classList.add('column__card_name');
    this.cardName.innerHTML = name;

    if(description || comments.length) {
      this.cardBadges = this.card.appendChild(document.createElement('div'));
      this.cardBadges.classList.add('column__card_badges');
  
      if(description) {
        this.cardDescriptionIconDescription = this.cardBadges.appendChild(document.createElement('span'));
        this.cardDescriptionIconDescription.classList.add('column__card_badge');
        this.cardDescriptionIconDescription.title = 'Эта карточка с описанием.';
        this.cardDescriptionIconDescription.innerHTML = '<i class="fas fa-align-left"></i>';
      }
      if(comments.length) {
        this.cardDescriptionIconComments = this.cardBadges.appendChild(document.createElement('span'));
        this.cardDescriptionIconComments.classList.add('column__card_badge');
        this.cardDescriptionIconComments.title = 'Комментарии';
        this.cardDescriptionIconComments.innerHTML = `
          <i class="far fa-comment"></i>
          <span>${comments.length}</span>
        `;
      }
    }

    this.cardPropChange = (card, prop, newProp) => {
      this.cardPropertyChange(card.id, prop, newProp);
      cardModalReRender(
        card,
        this.listName,
        this.cardNameChange,
        this.cardDescriptionChange,
        this.cardCommentsChange,
        this.cardLabelsChange,
        this.cardActiveLabelsChange
      );
      this.cardsReRender();
    }

    this.cardCommentsChange = (card, newComments) => this.cardPropChange(card, 'comments', newComments);
    this.cardDescriptionChange = (card, newDescription) => this.cardPropChange(card, 'description', newDescription);
    this.cardNameChange = (card, newName) => this.cardPropChange(card, 'value', newName);
    this.cardLabelsChange = (card, newCardLabels) => this.cardPropChange(card, 'cardLabels', newCardLabels);
    this.cardActiveLabelsChange = (card, newActiveLabels) => this.cardPropChange(card, 'activeLabels', newActiveLabels);

    this.card.addEventListener('click', () => {
      if (this.columnNameInput.value.trim()) {
        this.nameChange();
      }
      this.columnForm.classList.add('hide');
      this.columnName.classList.remove('hide');

      this.cardAdd.classList.add('hide');
      this.newCardButton.classList.remove('hide');
      this.cardAddTextArea.value = '';

      cardModal({
        card,
        columnName: this.listName,
        cardNameChange: (card, newName) => this.cardNameChange(card, newName),
        cardDescriptionChange: (card, newDescription) => this.cardDescriptionChange(card, newDescription),
        cardCommentsChange: (card, newComments) => this.cardCommentsChange(card, newComments),
        cardLabelsChange: (card, newCardLabels) => this.cardLabelsChange(card, newCardLabels),
        cardActiveLabelsChange: (card, newActiveLabels) => this.cardActiveLabelsChange(card, newActiveLabels)
      }).modalOpen();
    });
  }
}

class AddColumn {
  constructor() {
    this.addColumn = homeColumns.appendChild(document.createElement('div'));
    this.addColumn.classList.add('column__add');

    this.addColumnButton = this.addColumn.appendChild(document.createElement('button'));
    this.addColumnButton.classList.add('column__add_button');
    this.addColumnButton.innerHTML = `
      <i class="fas fa-plus"></i>
      <span>Добавьте ещё одну колонку</span>
    `;

    this.addColumnSection = this.addColumn.appendChild(document.createElement('form'));
    this.addColumnSection.classList.add('column__add_section');
    this.addColumnSection.style.display = 'none';

    this.addColumnInput = this.addColumnSection.appendChild(document.createElement('input'));
    this.addColumnInput.classList.add('column__add_input');
    this.addColumnInput.placeholder = 'Ввести загаловок списка';

    this.addColumnButtons = this.addColumnSection.appendChild(document.createElement('div'));
    this.addColumnButtons.classList.add('column__add_buttons');

    this.addColumnButtonConfirm = this.addColumnButtons.appendChild(document.createElement('button'));
    this.addColumnButtonConfirm.classList.add('column__cards_add_button');
    this.addColumnButtonConfirm.innerHTML = 'Добавить список';

    this.addColumnClose = this.addColumnButtons.appendChild(document.createElement('button'));
    this.addColumnClose.classList.add('column__add_close');
    this.addColumnClose.innerHTML = '<i class="fas fa-times"></i>';
    this.addColumnClose.type = 'button';

    this.addColumnButton.addEventListener('click', () => {
      this.addColumnButton.classList.add('hide');
      this.addColumnSection.style.display = 'block';

      setTimeout(() => {
        this.addColumnSection.classList.add('open');
        this.addColumnInput.focus();
      }, 10);
    });

    this.addColumnSection.addEventListener('submit', () => {
      if (this.addColumnInput.value.trim()) {
        columns.push({
          value: this.addColumnInput.value,
          id: randomId(),
          cardsArray: []
        });
        reRender();
        localStorage.setItem('columns', JSON.stringify(columns));

        this.addColumnHide();
      }
    });

    this.addColumnClose.addEventListener('click', () => {
      this.addColumnHide();
    });
  }

  addColumnHide = () => {
    this.addColumnSection.classList.remove('open');
    this.addColumnSection.classList.add('hide');

    setTimeout(() => {
      this.addColumnButton.classList.remove('hide');
      this.addColumnSection.style.display = 'none';
      this.addColumnSection.classList.remove('hide');
      this.addColumnInput.value = '';
    }, 200);
  }
}

new AddColumn();

function dragAndDrop() {
  const columnElems = document.querySelectorAll('.column');

  let draggedColumn = null;
  columnElems.forEach(column => {
    column.addEventListener('dragstart', function() {
      draggedColumn = columns.findIndex(col => col.id === this.id);
    });

    column.addEventListener('dragover', function(e) {
      e.preventDefault();
    });

    column.addEventListener('drop', function(e) {
      e.preventDefault();
      e.stopPropagation();

      const droppedColumn = columns.findIndex(col => col.id === this.id);
      move(columns, draggedColumn, droppedColumn);
      reRender(columns);
    });
  });
}

function reRender(arr = columns) {
  document.querySelectorAll('.column').forEach(c => c.remove());
  document.querySelector('.column__add').remove();

  arr.map(col => {
    const column = new Column(col.value, col.id, col.cardsArray);
    column.cardsReRender();
    return column;
  });
  localStorage.setItem('columns', JSON.stringify(columns));
  dragAndDrop();
  new AddColumn();
}

window.addEventListener('load', () => {
  reRender();
});
