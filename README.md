# Extendom
A pluggable, minimal DOM system for server-side rendering and HTML generation 


## Philosophy
Extendom follows the **"only what you need"** approach. The core includes just the minimal set of methods (e.g., .setAttr, .append, .textContent) to create and manipulate basic DOM-like structures. Other Features are available as opt-in plugins you can import only when needed.

## Install

```bash
npm i extendom
```

## Example 

```js
import { InitDom } from "extendom";
import { text } from "ziko"
InitDom()
let a = text("Hello from server").setAttr({id : "text-1"})
console.log(a.element.outerHTML) // <span id="text-1">Hello from server</span>
```
## Features

- ✅ **Tiny Core** : Lightweight and minimal core, suitable for server environments or custom renderers.
- 🌐 **SSR-Friendly** : Built for server environments with no browser dependencies.
- 🔌 **Pluggable** : Advanced or less common features are provided as optional modules — you only import what you need.
- ⚙️ **Zero Runtime Overhead** : Ideal for static HTML generation or Node.js templating engines.
- 🌲 **Tree-shakable** : Keep your bundle size minimal; unused features are not included in the output.
- 📦 **Modular Structure** : Keep your codebase clean and maintainable by adding features only when required.

# ⭐️ Show your support
If you appreciate the project, kindly demonstrate your support by giving it a star!

# Licence
This projet is licensed under the terms of MIT License