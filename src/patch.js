var events = require('./events')
var getAttr = require('./attrs').getAttr
var setAttr = require('./attrs').setAttr

module.exports = function patch (oldVnode, newVnode, render) {
  var parent = oldVnode.dom.parentElement
  var parentVnode = oldVnode.parentVnode

  // if the tag is entirely different,
  // copy over everything fresh and re-render
  if (oldVnode.tag !== newVnode.tag) {
    if (oldVnode.root) throw new Error('Cannot change tag of root app element')

    var oldChildNode = oldVnode.dom
    var newChildNode = render(null, Object.assign(oldVnode, newVnode), parentVnode).dom

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

  var i = 0
  while (i < newVnode.children.length) {
    const child = oldVnode.children[i]

    // if the oldVnodes children don't extend this far, time to append!
    if (!child) {
      window.console.log(newVnode.children[i])
      var newEl = render(null, newVnode.children[i], parentVnode)
      window.console.log(newEl)
      oldVnode.children[i] = newVnode.children[i]
      parent.appendChild(newEl)
    } else {
    // otherwise we need to figure out how to patch this
    }

    patch(oldVnode.children[i], newVnode.children[i], render)
    i = i + 1
  }
  // TODO: deal with deletion later this shit is really fucking hard
}