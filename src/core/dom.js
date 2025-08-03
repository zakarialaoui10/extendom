export class DOMElement {
  constructor(tag) {
    this.tag = tag;
    this.children = [];
    this.attributes = {};
    this.textContent = '';
  }

  get outerHTML() {
    const attrs = Object.entries(this.attributes)
      .map(([k, v]) => ` ${k}="${v}"`)
      .join('');
    const childrenStr = this.children.map(c =>
      typeof c === 'string' ? c : c.toString()
    ).join('');
    return `<${this.tag}${attrs}>${this.textContent}${childrenStr}</${this.tag}>`;
  }

  get innerHTML() {
    return this.children.map(c =>
      typeof c === 'string' ? c : c.toString()
    ).join('');
  }

  setAttribute(name, value) {
    this.attributes[name] = value;
  }

  removeAttribute(name) {
    delete this.attributes[name];
  }

  appendChild(child) {
    this.children.push(child);
  }

  removeChild(child) {
    const index = this.children.indexOf(child);
    if (index === -1) {
      throw new Error("Child not found");
    }
    this.children.splice(index, 1);
  }

  toString() {
    return this.outerHTML;
  }
}