import { InitDom } from "extendom";
import { p, text } from "ziko"
InitDom()

let a = text(text("jj")).setAttr({id : "a-10"})
let b = p()

console.log(a.element.innerHTML)
console.log(a.element.outerHTML)

let c = document.createElement("span")
c.innerHTML = 100

console.log(c.outerHTML)