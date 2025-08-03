import { InitDom } from "../src/core/index.js";
import { p, text } from "ziko"
InitDom()

let a = text("kkd")
let b = p()

console.log(a.element.outerHTML)