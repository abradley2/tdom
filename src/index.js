var patch = require('./patch')

function createTextNode (text) {
  return {
    $vnode: true,
    tag: null,
    textNode: true,
    text: text,
    attrs: {},
    children: []
  }
}

module.exports = {
  t: function t (tag, attrs, children) {
    var i

    // allow for 1 or 2 arguments for easy shorthands
    if (arguments.length === 1) return t(tag, {}, [])

    if (attrs.constructor === Array) return t(tag, {}, attrs)

    if (attrs.constructor === String || attrs.$vnode) {
      var childArgs = []
      for (i = 1; i < arguments.length; i++) childArgs.push(arguments[i])
      return t(tag, {}, childArgs)
    }

    if (!children) children = []

    if (children.constructor === String) children = [children]

    // automatically turn any child nodes that are strings into text nodes
    for (i = 0; i < children.length; i++) {
      if (children[i] && children[i].constructor === String) {
        children[i] = createTextNode(children[i])
      }
    }
    global.console.log({
      $vnode: true,
      tag: tag,
      attrs: attrs,
      children: children
    })
    return {
      $vnode: true,
      tag: tag,
      attrs: attrs,
      children: children
    }
  },

  mount: function mount (app, element) {
    var vdom = app()

    var render = require('./render')(function onUpdate () {
      var updatedVdom = app()
      patch(vdom, updatedVdom, render)
    })

    render(element, vdom)
    
    return function () {
      render(element, vndom)
    }
  }
}
