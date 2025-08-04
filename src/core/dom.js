export class DOMElement {
  constructor(tag) {
    this.tag = tag.toLowerCase();
    this.children = [];
    this.attributes = {};
    this.textContent = '';
    this.parentNode = null;
    this.classList = new ClassList(this);
    this.style = new CSSStyleDeclaration(this);
    this._eventListeners = {};
  }

  get outerHTML() {
    const attrs = Object.entries(this.attributes)
      .map(([k, v]) => ` ${k}="${this._escapeAttribute(v)}"`)
      .join('');
    
    // Self-closing tags
    if (['img', 'br', 'hr', 'input', 'meta', 'link'].includes(this.tag)) {
      return `<${this.tag}${attrs} />`;
    }
    
    const content = this.textContent + this.innerHTML;
    return `<${this.tag}${attrs}>${content}</${this.tag}>`;
  }

  get innerHTML() {
    return this.children.map(c =>
      typeof c === 'string' ? this._escapeHtml(c) : c.outerHTML
    ).join('');
  }
  
  set innerHTML(html) {
    this.children = [];
    this.textContent = '';
    if (html) {
      // Simple HTML parsing (basic implementation)
      const parsed = this._parseHTML(html.toString());
      this.children = parsed;
    }
  }

  get innerText() {
    let text = this.textContent;
    for (const child of this.children) {
      if (typeof child === 'string') {
        text += child;
      } else {
        text += child.innerText;
      }
    }
    return text;
  }

  set innerText(text) {
    this.children = [];
    this.textContent = String(text);
  }

  get id() {
    return this.attributes.id || '';
  }

  set id(value) {
    this.setAttribute('id', value);
  }

  get className() {
    return this.attributes.class || '';
  }

  set className(value) {
    this.setAttribute('class', value);
    this.classList._update();
  }

  setAttribute(name, value) {
    this.attributes[name.toLowerCase()] = String(value);
    if (name.toLowerCase() === 'class') {
      this.classList._update();
    }
  }

  getAttribute(name) {
    return this.attributes[name.toLowerCase()] || null;
  }

  hasAttribute(name) {
    return name.toLowerCase() in this.attributes;
  }

  removeAttribute(name) {
    delete this.attributes[name.toLowerCase()];
    if (name.toLowerCase() === 'class') {
      this.classList._update();
    }
  }

  appendChild(child) {
    if (typeof child === 'string') {
      this.children.push(child);
    } else {
      if (child.parentNode) {
        child.parentNode.removeChild(child);
      }
      child.parentNode = this;
      this.children.push(child);
    }
    return child;
  }

  removeChild(child) {
    const index = this.children.indexOf(child);
    if (index === -1) {
      throw new Error("Child not found");
    }
    if (typeof child !== 'string') {
      child.parentNode = null;
    }
    this.children.splice(index, 1);
    return child;
  }

  insertBefore(newChild, referenceChild) {
    const index = this.children.indexOf(referenceChild);
    if (index === -1) {
      throw new Error("Reference child not found");
    }
    
    if (newChild.parentNode) {
      newChild.parentNode.removeChild(newChild);
    }
    
    if (typeof newChild !== 'string') {
      newChild.parentNode = this;
    }
    
    this.children.splice(index, 0, newChild);
    return newChild;
  }

  

  getElementById(id) {
    if (this.id === id) return this;
    
    for (const child of this.children) {
      if (typeof child !== 'string') {
        const found = child.getElementById(id);
        if (found) return found;
      }
    }
    return null;
  }

  getElementsByTagName(tagName) {
    const results = [];
    tagName = tagName.toLowerCase();
    
    if (this.tag === tagName || tagName === '*') {
      results.push(this);
    }
    
    for (const child of this.children) {
      if (typeof child !== 'string') {
        results.push(...child.getElementsByTagName(tagName));
      }
    }
    
    return results;
  }

  getElementsByClassName(className) {
    const results = [];
    
    if (this.classList.contains(className)) {
      results.push(this);
    }
    
    for (const child of this.children) {
      if (typeof child !== 'string') {
        results.push(...child.getElementsByClassName(className));
      }
    }
    
    return results;
  }

  addEventListener(type, listener, options = false) {
    if (!this._eventListeners[type]) {
      this._eventListeners[type] = [];
    }
    this._eventListeners[type].push({ listener, options });
  }

  removeEventListener(type, listener) {
    if (!this._eventListeners[type]) return;
    this._eventListeners[type] = this._eventListeners[type].filter(
      item => item.listener !== listener
    );
  }

  dispatchEvent(event) {
    const listeners = this._eventListeners[event.type] || [];
    for (const { listener } of listeners) {
      listener.call(this, event);
    }
    return true;
  }

  cloneNode(deep = false) {
    const clone = new DOMElement(this.tag);
    clone.attributes = { ...this.attributes };
    clone.textContent = this.textContent;
    
    if (deep) {
      for (const child of this.children) {
        if (typeof child === 'string') {
          clone.children.push(child);
        } else {
          clone.appendChild(child.cloneNode(true));
        }
      }
    }
    
    return clone;
  }

  toString() {
    return this.outerHTML;
  }

  // Helper methods
  _escapeHtml(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  _escapeAttribute(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  _parseHTML(html) {
    // Very basic HTML parsing - in a real implementation you'd want a proper parser
    const children = [];
    const textNodes = html.split(/<[^>]+>/);
    const tags = html.match(/<[^>]+>/g) || [];
    
    for (let i = 0; i < Math.max(textNodes.length, tags.length); i++) {
      if (textNodes[i]) {
        children.push(textNodes[i]);
      }
      if (tags[i]) {
        // This is a very simplified tag parsing
        const tagMatch = tags[i].match(/<(\w+)([^>]*)>/);
        if (tagMatch) {
          const element = new DOMElement(tagMatch[1]);
          children.push(element);
        }
      }
    }
    
    return children;
  }


}

class ClassList {
  constructor(element) {
    this.element = element;
    this._classes = [];
    this._update();
  }

  _update() {
    const className = this.element.getAttribute('class') || '';
    this._classes = className.split(/\s+/).filter(c => c.length > 0);
  }

  _save() {
    this.element.setAttribute('class', this._classes.join(' '));
  }

  add(...tokens) {
    for (const token of tokens) {
      if (!this._classes.includes(token)) {
        this._classes.push(token);
      }
    }
    this._save();
  }

  remove(...tokens) {
    for (const token of tokens) {
      const index = this._classes.indexOf(token);
      if (index > -1) {
        this._classes.splice(index, 1);
      }
    }
    this._save();
  }

  toggle(token, force) {
    if (force === true) {
      this.add(token);
      return true;
    } else if (force === false) {
      this.remove(token);
      return false;
    } else {
      if (this.contains(token)) {
        this.remove(token);
        return false;
      } else {
        this.add(token);
        return true;
      }
    }
  }

  contains(token) {
    return this._classes.includes(token);
  }

  replace(oldToken, newToken) {
    const index = this._classes.indexOf(oldToken);
    if (index > -1) {
      this._classes[index] = newToken;
      this._save();
      return true;
    }
    return false;
  }

  get length() {
    return this._classes.length;
  }

  item(index) {
    return this._classes[index] || null;
  }

  toString() {
    return this._classes.join(' ');
  }
}

class CSSStyleDeclaration {
  constructor(element) {
    this.element = element;
    this._styles = {};
  }

  setProperty(property, value, priority = '') {
    this._styles[property] = { value, priority };
    this._updateStyleAttribute();
  }

  getPropertyValue(property) {
    return this._styles[property]?.value || '';
  }

  removeProperty(property) {
    delete this._styles[property];
    this._updateStyleAttribute();
    return property;
  }

  _updateStyleAttribute() {
    const styleStr = Object.entries(this._styles)
      .map(([prop, { value, priority }]) => 
        `${prop}: ${value}${priority ? ' !' + priority : ''}`)
      .join('; ');
    
    if (styleStr) {
      this.element.setAttribute('style', styleStr);
    } else {
      this.element.removeAttribute('style');
    }
  }
}

export class Document {
  constructor() {
    this.documentElement = new DOMElement('html');
    this.head = new DOMElement('head');
    this.body = new DOMElement('body');
    
    this.documentElement.appendChild(this.head);
    this.documentElement.appendChild(this.body);
  }

  createElement(tagName) {
    return new DOMElement(tagName);
  }

  createTextNode(data) {
    return String(data);
  }

  getElementById(id) {
    return this.documentElement.getElementById(id);
  }

  getElementsByTagName(tagName) {
    return this.documentElement.getElementsByTagName(tagName);
  }

  getElementsByClassName(className) {
    return this.documentElement.getElementsByClassName(className);
  }

  querySelector(selector) {
    return this.documentElement.querySelector(selector);
  }

  querySelectorAll(selector) {
    return this.documentElement.querySelectorAll(selector);
  }
}

// Usage example:
// const doc = new Document();
// const div = doc.createElement('div');
// div.id = 'myDiv';
// div.className = 'container active';
// div.textContent = 'Hello World';
// doc.body.appendChild(div);