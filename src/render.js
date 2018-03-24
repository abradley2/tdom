var events = require('./events')

module.exports = function (onUpdate) {
  return function render (element, vnode, parentVnode) {
    var el
    if (vnode.textNode) {
      el = document.createTextNode(vnode.text)
    } else {
      el = document.createElement(vnode.tag)
    }

    vnode.dom = el
    vnode.parentVnode = parentVnode
    vnode.root = !!parentVnode
    vnode.onUpdate = onUpdate

    for (var attr in vnode.attrs) {
      // if attribute is a handler, apply it to the node
      if (events[attr]) {
        var handler = vnode.attrs[attr]
        var wrappedHandler = function (e) {
          handler(e, vnode)
          vnode.onUpdate()
        }
        el[events[attr]] = wrappedHandler
        vnode.attrs[attr] = wrappedHandler
        continue
      }

      // otherwise, just set the attribute on the node with setAttribute
      el.setAttribute(attr, vnode.attrs[attr])
    }
    
    // skip over falsey
    if (vnode.children === false || vnode.children === null || typeof vnode.children === 'undefined') {
      return
    }

    // if the "children" is a string use it as innerText
    if (vnode.children.constructor === String) {
      el.innerText = vnode.children
    } else {
      // otherwise to walk down the tree and render the children with this node
      // as the parent
      for (var i = 0; i < vnode.children.length; i++) {
        render(el, vnode.children[i])
      }
    }

    // add the completed node to the parent
    if (element) {
      element.appendChild(el)
    } else {
      return el
    }
  }
}
