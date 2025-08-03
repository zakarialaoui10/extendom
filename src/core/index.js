import { DOMElement } from "./dom.js"
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

export{
    DOMElement
}
