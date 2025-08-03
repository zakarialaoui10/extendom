class DOMElement {
  constructor(tag) {
    this.tag = tag;
    this.children = [];
    this.attributes = {};
    this.textContent = '';
  }
  setAttribute(name, value) {
    this.attributes[name] = value;
  }
  appendChild(child) {
    this.children.push(child);
  }
  toString() {
    const attrs = Object.entries(this.attributes)
      .map(([k, v]) => ` ${k}="${v}"`)
      .join('');
    const childrenStr = this.children.map(c =>
      typeof c === 'string' ? c : c.toString()
    ).join('');
    return `<${this.tag}${attrs}>${this.textContent}${childrenStr}</${this.tag}>`;
  }
}

export function InitDom() {
  globalThis.document = {
    createElement(tag) {
      return new DOMElement(tag);
    },
    body: new DOMElement("body"),
    createTextNode(text) {
      return text;
    },
  };
}

