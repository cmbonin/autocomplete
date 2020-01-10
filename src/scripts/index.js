/**
 * Custom web component search field
 * Auto complete functionality, uses randomuser.me api
 */
import css from '!!css-loader!sass-loader!../styles/index.scss';

const CSS = css.toString();
const DATAURL = 'https://randomuser.me/api/?inc=picture,name&results=200';
const HTML = `<div class="autocomplete-wrapper">
  <div class="input-wrapper">
    <div class="search-icon"></div>
    <input type="text" placeholder="Search for a person">
    <button class="btn-dropdown"></div>
    <div class="dropdown"></div>
  </div>
</div>`;

class MAutocomplete extends HTMLElement {

  static get observedAttributes() {
    return ['value'];
  }

  set value(val) {
    this.setAttribute('value', val);
    if (val === '') {
      this.hideDropDown();
    }
  }

  get value() {
    return this.getAttribute('value');
  }

  get dropDown() {
    return this.shadowRoot.querySelector('.dropdown');
  }

  get inputWrapper() {
    return this.shadowRoot.querySelector('.input-wrapper');
  }

  constructor() {
    super();
    this.attachShadow({
      mode: 'open'
    });
    this.people = null;
    this.filteredPeople = [];
    this.activeFocusIndex = -1;
    this.dropDownOpen = false;
  }

  connectedCallback() {
    // Initialise HTML and CSS
    this.shadowRoot.innerHTML = HTML;
    const style = document.createElement('style');
    style.innerHTML = CSS;
    this.shadowRoot.prepend(style);
    this.init();
  }


  init() {
    this.fetchData()
      .then(res => {
        this.people = res.results || [];
        this.initEvents();
        this.initElems();
      })
      .catch(err => console.log(err));
  }
  

  initElems() {
    this.hideDropDown();
  }

  initEvents() {
    const input = this.shadowRoot.querySelector('input');
    const btn = this.shadowRoot.querySelector('.btn-dropdown');
    if (!input || !btn) {
      return;
    }
    const dropDownClick = this.dropDownClick.bind(this);
    const dropDown = this.dropDown.bind(this);
    this.addEventListener('input', this.onInput);
    this.addEventListener('keydown', this.onKeyDown);
    this.dropDown.addEventListener('click', dropDownClick);
    btn.addEventListener('click', dropDown);
  }

  async fetchData() {
    const response = await fetch(DATAURL);
    const json = await response.json();
    return json;
  }

  onInput() {
    const input = this.shadowRoot.querySelector('input');
    const newValue = input.value;
    this.value = newValue;
    this.activeFocusIndex = -1;
    if (newValue !== '') {
      this.displayDropDown(this.getFilteredList(newValue));
    }
  }

  onKeyDown(e) {
    const list = this.filteredPeople;
    const maxCount = list.length - 1;
    if (e.keyCode === 40) {
      // down arrow key
      this.activeFocusIndex = (this.activeFocusIndex >= maxCount) ? 0 : this.activeFocusIndex + 1;
      this.activateListItem();
    } else if (e.keyCode === 38) {
      // up arrow key
      this.activeFocusIndex = (this.activeFocusIndex === 0) ? maxCount : this.activeFocusIndex - 1;
      this.activateListItem();
    } else if (e.keyCode === 13) {
      // enter key
      this.itemSelect(this.activeFocusIndex);
      e.preventDefault();
    }
  }

  dropDownClick(e) {
    const val = e.target.getAttribute('data-value');
    this.setValue(val);
    e.preventDefault();
  }

  itemSelect(index) {
    const item = this.dropDown.childNodes[index];
    const val = (item) ? item.getAttribute('data-value') : false;
    this.setValue(val);

  }

  setValue(val) {
    if (val) {
      const input = this.shadowRoot.querySelector('input');
      this.value = val;
      input.value = val;
      this.hideDropDown();
      input.focus();
    }
  }

  activateListItem() {
    const options = this.dropDown.childNodes;
    const listItem = this.dropDown.querySelector(`div[data-index="${this.activeFocusIndex}"]`);
    options.forEach(item => {
      item.classList.remove('active');
    });
    if (listItem && listItem.classList) {
      listItem.classList.add('active');
    }
  }

  displayDropDown(list) {
    this.filteredPeople = list;
    if (!list || !list.length || list.length <= 0) {
      this.hideDropDown();
    } else {
      this.showDropDown(list);
    }
  }

  hideDropDown() {
    this.dropDown.classList.remove('display');
    this.dropDownOpen = false;
  }

  showDropDown(list) {
    const dropDown = this.dropDown;
    dropDown.classList.add('display');
    dropDown.innerHTML = '';
    list.map((item, index) => {
      dropDown.append(this.createListItem(item, index));
    });
    this.dropDownOpen = true;
  }

  createListItem(item, index) {
    const {name, picture} = item;
    const option = document.createElement('div');
    const fullName = (name) ? `${name.first} ${name.last}` : '';
    const profileThumbnail = (picture) ? picture.thumbnail : '';
    const img = document.createElement('div');
    const profileImg = document.createElement('img');
    profileImg.setAttribute('src', profileThumbnail);
    img.append(profileImg);
    img.className = 'icon-profile';
    option.innerHTML = fullName;
    option.className = 'list-item';
    option.setAttribute('data-index', index);
    option.setAttribute('data-value', fullName);
    option.prepend(img);
    return option;
  }

  getFilteredList(newValue) {
    const people = this.people;
    return people.reduce((newList, item, index) => {
      const name = item.name;
      if ((name.first + name.last).indexOf(newValue) !== -1) {
        newList.push(item);
      }
      return newList;
    }, []);
  }

  dropDown() {
    if (this.dropDownOpen) {
      this.hideDropDown();
    } else {
      this.showDropDown(this.people);
    }
  }


  disconnectedCallback() {
    const input = this.shadowRoot.querySelector('input');
    const btn = this.shadowRoot.querySelector('.btn-dropdown');
    if (!input || !btn) {
      return;
    }
    this.removeEventListener('input', this.onInput);
    this.removeEventListener('keydown', this.onKeyDown);
    this.dropDown.removeEventListener('click', dropDownClick);
    btn.addEventListener('click', dropDown);
  }
}

window.customElements.define('m-autocomplete', MAutocomplete);
