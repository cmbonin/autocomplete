/**
 * Imports the Sass file, and converts it to a css string for use in the
 * web component's template.
 */
import css from 'css-loader!sass-loader!./autocomplete.scss';
const CSS = css.toString();

import HTML from './autocomplete.html';

/**
 * @class
 * @memberof  Matrix
 * @classdesc <m-autocomplete> defines an input element that is pre-populated
 *            with fetched data, accessible from a drop down. When the user
 *            types, the drop down shows, and a value can be selected by the
 *            keyboard or mouse.
 */
class MAutocomplete extends HTMLElement {

    static get observedAttributes() {
      return ['value'];
    }

    set value(val) {
        this.setAttribute('value', val);
        if (val === '') {
            this.hideList()
        }
    }

    get value() {
      return this.getAttribute('value');
    }

    get listElement() {
        return this.shadowRoot.querySelector('.list')
    }

    get inputWrapper() {
        return this.shadowRoot.querySelector('.input-wrapper')
    }

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.people = null;
        this.filteredPeople = [];
        this.activeFocusIndex = -1;
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
        this.fetchList()
            .then(res => {
                this.people = res;
                this.initEvents();
                this.initElems();
            })
            .catch(err => console.log(err))
    }

    initElems() {
        this.hideList();
    }

    initEvents() {
        const input = this.shadowRoot.querySelector('input');
        if (!input) {
            return;
        }
        const listClick = this.listClick.bind(this);
        const focusInput = this.focusInput.bind(this);
        this.addEventListener('input', this.onInput);
        this.addEventListener('keydown', this.onKeyDown);
        input.addEventListener('focus', focusInput);
        this.listElement.addEventListener('click', listClick);
    }

    onInput() {
        const input = this.shadowRoot.querySelector('input')
        const newValue = input.value;
        this.value = newValue;
        this.activeFocusIndex = -1;
        if (newValue !== '') {
            this.displayList(this.getFilteredList(newValue));
        }
    }

    onKeyDown(e) {
        const list = this.filteredPeople;
        const maxCount = list.length - 1;
        if (e.keyCode == 40) {
            // down arrow key
            this.activeFocusIndex = (this.activeFocusIndex >= maxCount) ? 0 : this.activeFocusIndex + 1;
            this.activateListItem();
        } else if (e.keyCode == 38) {
            // up arrow key
            this.activeFocusIndex = (this.activeFocusIndex === 0) ? maxCount : this.activeFocusIndex - 1;
            this.activateListItem();
        } else if (e.keyCode == 13) {
            // enter key
            this.itemSelect(this.activeFocusIndex);
            e.preventDefault();
        }
    }

    listClick(e) {
        const val = e.target.getAttribute('data-value');
        this.setValue(val);
        e.preventDefault();
    }

    itemSelect(index){
        const item = this.listElement.childNodes[index];
        const val = (item) ?  item.getAttribute('data-value') : false;
        this.setValue(val);

    }

    setValue(val) {
        if (val) {
            const input = this.shadowRoot.querySelector('input');
            this.value = val;
            input.value = val;
            this.hideList();
            input.focus();
        }
    }

    activateListItem() {
        const options = this.listElement.childNodes;
        const listItem = this.listElement.querySelector(`div[data-index="${this.activeFocusIndex}"]`);
        options.forEach(item => {
            item.classList.remove('active')
        });
        if (listItem && listItem.classList) {
            listItem.classList.add('active');
        }
    }

    displayList(list) {
        this.filteredPeople = list;
        if (!list || !list.length || list.length <= 0) {
            this.hideList();
        } else {
            this.showList(list);
        }
    }

    hideList() {
        this.listElement.classList.remove('display');
    }

    showList(list) {
        const listElement = this.listElement;
        listElement.classList.add('display');
        listElement.innerHTML = '';
        list.map((item, index) => {
            listElement.append(this.createListItem(item, index))
        });
    }

    createListItem(item, index){
        const option = document.createElement('div');
        const name = `${item.name.first} ${item.name.last}`;
        const profileUrl = item.profile;
        const img = document.createElement('div');
        const profileImg = document.createElement('img');
        profileImg.setAttribute('src', profileUrl);
        img.append(profileImg);
        img.className = 'icon-profile';
        option.innerHTML = name;
        option.className = 'list-item';
        option.setAttribute('data-index', index);
        option.setAttribute('data-value', name);
        option.prepend(img);
        return option;
    }

    getFilteredList(newValue) {
        const people = this.people;
        return people.reduce((newList, item, index) => {
            const name = item.name;
            if((name.first + name.last).indexOf(newValue) !== -1) {
                newList.push(item)
            }
            return newList;
        },[])
    }

    focusInput(e) {
        this.inputWrapper.classList.add('focused');
    }

    blurInput(e) {
        this.inputWrapper.classList.remove('focused');
    }

    fetchList() {
        return new Promise ((resolve, reject) => {
            return fetch('http://localhost:3000/api/v1/people')
                .then(res => {
                    resolve(res.json());
                })
                .then(err => reject(err))
        })
    }

    disconnectedCallback() {
      const input = this.shadowRoot.querySelector('input');
      this.removeEventListener('input', this.onInput);
      this.removeEventListener('keydown', this.onKeyDown);
      input.removeEventListener('focus', this.focusInput);
      input.removeEventListener('blur', this.blurInput);
      this.listElement.removeEventListener('click', listClick);
    }
}

// Register the custom element for use
window.customElements.define('m-autocomplete', MAutocomplete);
