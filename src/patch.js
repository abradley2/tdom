var events = require('./events')
var getAttr = require('./attrs').getAttr
var setAttr = require('./attrs').setAttr

module.exports = function patch (oldVnode, newVnode, render) {
  if (!oldVnode.dom) window.console.log('no dom! ', oldVnode)
  var parent = oldVnode.dom.parentElement

  // if the tag is entirely different,
  // copy over everything fresh and re-render
  if (oldVnode.tag !== newVnode.tag) {
    if (oldVnode.root) throw new Error('Cannot change tag of root app element')

    var oldChildNode = oldVnode.dom
    var newChildNode = render(Object.assign(oldVnode, newVnode)).dom

    parent.replaceChild(oldChildNode, newChildNode)

    // we're done here
    return
  }

  // text nodes are easy to diff, just commpare their text
  if (oldVnode.textNode) {
    return
  }

  // check if any attribtues have changed
  for (var attr in newVnode.attrs) {
    // TODO: figure out how to handle this
    if (events[attr]) {
      continue
    }

    if (newVnode.attrs[attr] !== getAttr(oldVnode.dom, attr)) {
      var value = newVnode.attrs[attr]

      oldVnode.attrs[attr] = value
      setAttr(oldVnode.dom, attr, value)
    }
  }

  // TODO: not a good way to do this
  for (var i = 0; i < oldVnode.children.length; i++) {
    patch(oldVnode.children[i], newVnode.children[i], render)
  }
}
