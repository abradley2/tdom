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
    // for event handlers we need to re-wrap them as we copy them over
    if (events[attr] && oldVnode.attrs[attr] !== newVnode.attrs[attr]) {
      var handler = newVnode.attrs[attr]
      var wrappedHandler = function (e) {
        handler(e, oldVnode)
        oldVnode.onUpdate()
      }
      oldVnode.attrs[attr] = wrappedHandler
      oldVnode.dom[attr] = wrappedHandler
      continue
    }

    // anything else we can just set normally
    if (newVnode.attrs[attr] !== getAttr(oldVnode.dom, attr)) {
      var value = newVnode.attrs[attr]

      oldVnode.attrs[attr] = value
      setAttr(oldVnode.dom, attr, value)
    }
  }

  var i = 0
  var children = newVnode.children.map(function (child, idx) {
    return Object.assign({
      key: child.attrs.key || idx
    }, child)
  })

  while (i < children.length) {
    var child = oldVnode.children[i]

    // if the oldVnodes children don't extend this far, time to append!
    if (!child) {
      var newEl = render(null, newVnode.children[i], oldVnode.dom)
      oldVnode.children[i] = newVnode.children[i]
      oldVnode.dom.appendChild(newEl)
    }

    patch(oldVnode.children[i], newVnode.children[i], render)
    i = i + 1
  }

  // if the index still isn't as large as the oldVnode then this means
  // we need to delete stuff
  while (i < oldVnode.children.length) {
    oldVnode.children[i].dom.remove()
    oldVnode.children.splice(i, 1)
    i = i + 1
  }
}
