import {LitElement, html, css} from 'lit';
import {styleMap} from 'lit/directives/style-map.js';
import internalValMethods from 'elite-forms/src/elite-form-rules'
import debounce from 'elite-forms/src/debounce'
import context from 'elite-forms/src/context'

export class EliteInput extends LitElement {
  static get styles() {
    return css`
      :host {
          font-family: monospace;
      }
      .elite-form {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 10px;
       }
      label {
        font-size: 1.3em;
        font-weight: bold;
        letter-spacing: 0.1em;
      }
      input {
        font-family: monospace;
      }
      ul {
        list-style-type: "✕ ";
      }
  `}

  static properties = {
    eliteForm: {},
    id: {},
    class: {},
    type: {},
    label: {},
    placeholder: {},
    note: {},
    name: {},
    validationRules: {}, // this is the prop that the dev passes in
    asyncValidationRules: {},
    errors: {},
    errorBehavior: {}, 
    validationName: {},
    options: {},
    min: {},
    max: {},
    showIndex: {},
    showVal: {},
    defaultHidden: {},
    row: {},
    cols: {},
    showWordCount: {},
    optionGroup: {}
  }

  static state = {
    internalValMethods: internalValMethods, 
    debounce: debounce,
  }

  constructor() {
    super();
    this.eliteForm = true;
    this.id = '';
    this.class = '';
    this.type = 'text';
    this.label = '';
    this.placeholder = '';
    this.note = '';
    this.name = '';
    this.errors = '';
    this.styles = ''; // styles for the most outer div
    this.labelStyles = '';  
    this.inputStyles = ''; 
    this.noteStyles = ''; 
    this.errorStyles = '';
    this.showWordCountStyles = '';
    this.error = {};
    this.showIndex = false;
    this.showVal = false;
    this.defaultHidden = 'select an option';
    this.conditionalBool = true;
    this.row = '4'; // text area default row
    this.cols = '50'; // text area default columns
    this.showWordCount = true;
  }

 

  render() {
    // console.log(keys)
    const error = []
    for (let err in this.error) {
      error.push(html`<li>${this.error[err]}</li>`)
    }
    
    if (this.type === 'radio' || this.type === 'checkbox') {
      return html`
        <div class='elite-form' style=${styleMap(this.styles)}>
          <label>${this.label}</label><br>
          <div @change=${this.handleBox} id=${this.name}>
            ${this.options.map((option) => html `
              <input
                type=${this.type}
                name=${this.name}
                class=${this.name}
                value=${option.value}
              >${option.option}<br>
            `
            )}
          <ul 
            class="error" 
            style=${styleMap(this.errorStyles)}>
            ${error} 
          </ul>
          </div>
        </div>
      `;
    } 
    else if (this.type === 'select') {
      console.log(this.optionGroup)
      const optionGroups = Object.entries(this.optionGroup)
   
      // optionGroups.map((group) => {
      //   console.log('group: ', group[0])
      //   const options = Object.values(group[1])
      //   options.map((option) => {
      //     console.log('option: ', option)
      //   })
      // })
    
      return html `
        <div class='elite-form' style=${styleMap(this.styles)}>
          <label>${this.label}</label><br>
          <select id=${this.id} name=${this.name} @change=${this.handleInput}>
            ${optionGroups.map((group) => {
              console.log('group: ', group)
              const options = Object.entries(group[1])
              console.log('options: ', options)
              html `
              <div>hi</div>
              <optgroup label=${group[0]}>
              <option value='none' selected disabled hidden>${this.defaultHidden}</option>
                ${options.map((option) => {
                  console.log('option in map: ', option)
                  console.log(option[0])
                  console.log(option[1])
                  html `
                  <option value=${option[0]}>${option[1]}</option>
                  `
                })}
              </optgroup>
              `
            })}
          </select>
          <ul 
            class="error" 
            style=${styleMap(this.errorStyles)}>
            ${error} 
          </ul>
        </div>
      `
    } 
    else if (this.type === 'textarea') {
      return html `
      <div class='elite-form' style=${styleMap(this.styles)}>
        <label 
          for=${this.id}
          style=${styleMap(this.labelStyles)}>
            ${this.label && this.label}
        </label>
        <textarea
          id=${this.id}
          @input=${this.handleInput} 
          @blur=${this.handleBlur}
          placeholder=${this.placeholder}
          style=${styleMap(this.inputStyles)}
          row=${this.row}
          cols=${this.cols}></textarea>
        <div
          class="showWordCount" 
          ?hidden=${this.showWordCount === 'false'}
          style=${styleMap(this.showWordCountStyles)}>
            Current count is ${this.countWords()} words.
        </div>
        <div 
          class="note" 
          ?hidden=${!this.note} 
          style=${styleMap(this.noteStyles)}>
            ${this.note}
        </div>
        <ul 
          class="error" 
          style=${styleMap(this.errorStyles)}>
            ${error} 
        </ul>
      </div>
      `
    }
    else {
      return html`
      <div class='elite-form' style=${styleMap(this.styles)}>
        <label 
          for=${this.id}
          style=${styleMap(this.labelStyles)}>
            ${this.label && this.label}
        </label>
        <span>
          <span ?hidden=${!this.showIndex}>${this.min}</span>
          <input 
            id=${this.id} 
            type=${this.type}
            @input=${this.handleInput} 
            @blur=${this.handleBlur}
            placeholder=${this.placeholder} 
            min=${this.min}
            max=${this.max}
            style=${styleMap(this.inputStyles)}>
          <span ?hidden=${!this.showIndex}>${this.max}</span>
        </span>
        <div ?hidden=${!this.showVal}>${this.value}</div>
        <div 
          class="note" 
          ?hidden=${!this.note} 
          style=${styleMap(this.noteStyles)}>
            ${this.note}
        </div>
        <ul 
          class="error" 
          style=${styleMap(this.errorStyles)}>
            ${error} 
        </ul>
      </div>
      <div ?hidden=${this.conditionalBool}>
        <slot>
        </slot>
      </div>
    `;
    }
  }

  handleConditional() {
    if (this.value === this.conditional[0]) {
      this.conditionalBool = false
    } else {
      this.conditionalBool = true
    }
  }

  countWords() {
    if (!this.value) {
      return 0;
    }
    else {
      const regex = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g;
      const wordArr = this.value.replace(regex, '').split(' ').filter(elem => elem);
      return wordArr.length;
    }
  }

  handleBox(event) {
    const form = this.shadowRoot.querySelectorAll(`.${this.name}`)
    const response = []
    for (let input in form) {
      if (!isNaN(Number(input))) {
        const { checked, value } = form[input]
        if (checked) response.push(value)
        else {
          response.slice(response.indexOf(value),1)
        }
      }
    }
    this.value = response
    this.handleValidation()
  }

  withDebounce = debounce(() => this.handleValidation(), 500)
  
  handleBlur(event) {
    if (this.errorBehavior === 'blur') {
      const { value } = event.target;
      this.value = value
      if (this.conditional) this.handleConditional()
      this.handleValidation()
    }
  }

  handleInput(event) {
    const { value } = event.target;
    this.value = value
    // console.log(this.context)
    if (this.errorBehavior === 'debounce') {
      if (this.conditional) this.handleConditional()
      this.withDebounce()    
    } else {
      if (this.errorBehavior !== 'blur') {
        if (this.conditional) this.handleConditional()
        this.handleValidation()
      }
    }
  }

  handleValidation() {
    const error = {}
    for (let rule in this.validationRules) {
      if (rule === 'checkExisting') {
        this.handdleAsyncValidation()
      }
      const result =  internalValMethods[rule](this, this.validationRules[rule])
      if (result.error) {
        error[rule] = result.message
      }
    }
    this.error = error
    this.requestUpdate()
  }

  async handdleAsyncValidation() {
    const error = {}
    for (let rule in this.validationRules) {
      const result = await internalValMethods[rule](this, this.validationRules[rule])
      if (result.error) {
        error[rule] = result.message
      }
    }
    this.error = error
    this.requestUpdate()
  }
}

window.customElements.define('elite-input', EliteInput)