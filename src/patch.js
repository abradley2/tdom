var events = require('./events')
var getAttr = require('./attrs').getAttr
var setAttr = require('./attrs').setAttr

module.exports = function patch (oldVnode, newVnode, render) {
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

  // text nodes are easy to diff, just compare their text
  if (oldVnode.textNode && oldVnode.dom.textContent !== newVnode.text) {
    oldVnode.text = newVnode.text
    oldVnode.dom.textContent = newVnode.text
    return
  }

  // check if any attribtues have changed
  for (var attr in newVnode.attrs) {
    // TODO: figure out how to handle this
    if (events[attr] && oldVnode.attrs[attr] !== newVnode.attrs[attr]) {
      var handler = newVnode.attrs[attr]
      var wrappedHandler = function () {
        handler.apply(oldVnode, arguments)
        oldVnode.onUpdate()
      }
      oldVnode.attrs[attr] = wrappedHandler
      oldVnode.dom[attr] = wrappedHandler
      continue
    }

    if (newVnode.attrs[attr] !== getAttr(oldVnode.dom, attr)) {
      var value = newVnode.attrs[attr]

      oldVnode.attrs[attr] = value
      setAttr(oldVnode.dom, attr, value)
    }
  }

  window.console.log('old = ', oldVnode.children.length, ' new = ', newVnode.children.length)
  // TODO: not a good way to do this
  var i = 0
  while (i < newVnode.children.length) {
    const child = oldVnode.children[i]
    if (child && child.attrs) {
      window.console.log(child.attrs)
    }
    patch(oldVnode.children[i], newVnode.children[i], render)
    i = i + 1
  }
  // TODO: deal with deletion later this shit is really fucking hard
}
