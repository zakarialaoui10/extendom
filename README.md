# extendom
A pluggable, minimal DOM system for server-side rendering and HTML generation

## Example 

```js
import { InitDom } from "extendom";
import { text } from "ziko"
InitDom()
let a = text("Hello from server").setAttr({id : "text-1"})
console.log(a.element.outerHTML) // <span id="text-1">Hello from server</span>
```
## Features

Tiny 
Pluggable 
