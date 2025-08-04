export const QuerySelectorMethodes = {
  querySelector(selector) {
    return _querySelector__.call(this, selector, true);
  },

  querySelectorAll(selector) {
    return _querySelector__.call(this, selector, false);
  },

};
function _querySelector__(selector, single = true) {
    const results = [];

    // Id 
    if (selector.startsWith("#")) {
      const id = selector.slice(1);
      const found = this.getElementById(id);
      if (found) results.push(found);
    } 
    // Class
    else if (selector.startsWith(".")) {
      const className = selector.slice(1);
      results.push(...this.getElementsByClassName(className));
    } 
    // Tag
    else {
      results.push(...this.getElementsByTagName(selector));
    }

    return single ? results[0] || null : results;
  }
