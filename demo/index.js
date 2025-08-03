import { InitDom } from "../src/core/index.js";
import { p, text } from "ziko"
InitDom()

let a = text(text("jj")).setAttr({id : "a-10"})
let b = p()

console.log(a.element.outerHTML)