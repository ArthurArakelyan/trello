const header = document.querySelector('.header');
const homeColumnsContainer = document.querySelector('.home__columns');
const homeColumns = document.querySelector('.home__columns_content');

let columns = [{value: 'asdsda', id: randomId()}, {value: 'asfasgga', id: randomId()}];

if(!localStorage.getItem('columns')) {
  localStorage.setItem('columns', JSON.stringify(columns));
} else {
  columns = JSON.parse(localStorage.getItem('columns'));
}

function randomId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

class Column {
  constructor(listName, id = randomId()) {
    this.id = id;
    this.listName = listName;

    this.column = homeColumns.appendChild(document.createElement('div'));
    this.column.classList.add('column');

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
      if(this.columnNameInput.value.trim()) {
        this.nameChange();
      }

      this.columnForm.classList.add('hide');
      this.columnName.classList.remove('hide');
    });

    // column cards

    this.cards = this.column.appendChild(document.createElement('div'));
    this.cards.classList.add('column__cards');

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

      this.cardAdd.classList.add('hide');
      this.newCardButton.classList.remove('hide');
      this.createCard(this.cardAddTextArea.value);
      this.cardAddTextArea.value = '';
    });

    // window event

    window.addEventListener('click', (e) => {
      const cards = document.querySelectorAll('.column__cards_creating');

      if(e.target === document.body ||
         e.target === homeColumnsContainer ||
         e.target === homeColumns) {
        cards.forEach(card => {
          card.lastChild.classList.add('hide');
          card.firstChild.classList.remove('hide');
        });

        this.nameChange();
  
        this.columnForm.classList.add('hide');
        this.columnName.classList.remove('hide');
      }
    });
  }

  nameChange = () => {
    columns.map(col => {
      if(col.id === this.id) {
        col.value = this.columnNameInput.value;
        localStorage.setItem('columns', JSON.stringify(columns));
      }

      return col;
    });
    
    this.listName = this.columnNameInput.value;
    this.columnName.innerHTML = this.listName;
  }

  createCard = (name) => {
    this.card = this.cards.appendChild(document.createElement('button'));
    this.card.classList.add('column__card');

    this.cardName = this.card.appendChild(document.createElement('span'));
    this.cardName.classList.add('column__card_name');
    this.cardName.innerHTML = name;
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

    this.addColumnButton.addEventListener('click', () => {
      this.addColumnButton.classList.add('hide');
      this.addColumnSection.style.display = 'block';

      setTimeout(() => {
        this.addColumnSection.classList.add('open');
        this.addColumnInput.focus();
      }, 10);
    });

    this.addColumnSection.addEventListener('submit', (e) => {
      e.preventDefault();

      if(this.addColumnInput.value.trim()) {
        columns.push({
          id: randomId(),
          value: this.addColumnInput.value
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

function reRender() {
  document.querySelectorAll('.column').forEach(c => c.remove());
  document.querySelector('.column__add').remove();
  
  columns.map(col => {
    return new Column(col.value, col.id);
  });
  new AddColumn();
}

window.addEventListener('load', reRender);
