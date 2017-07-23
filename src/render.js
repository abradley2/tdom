var events = require('./events')

module.exports = function (onUpdate) {
  return function render (element, vnode, parentVnode) {
    var el = document.createElement(vnode.tag)

    vnode.dom = el
    vnode.parentVnode = parentVnode
    vnode.root = !!parentVnode

    for (var attr in vnode.attrs) {
      // if attribute is a handler, apply it to the node
      if (events[attr]) {
        el[events[attr]] = function () {
          vnode.attrs[attr].apply(vnode, arguments)
          onUpdate()
        }
        continue
      }

      // otherwise, just set the attribute on the node with setAttribute
      el.setAttribute(attr, vnode.attrs[attr])
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
