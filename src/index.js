var patch = require('./patch')

function createTextNode (text) {
  return {
    $vnode: true,
    tag: 'text',
    textNode: true,
    text: text,
    attrs: {},
    children: []
  }
}

module.exports = {
  smol: function smol (tag, _attrs, ...children) {
    var i
    var attrs = _attrs || {}

    // allow for 1 or 2 arguments for easy shorthands
    if (arguments.length === 1) return t(tag, {}, [])

    if (attrs.constructor === Array) return t(tag, {}, attrs)

    if (attrs.constructor === String || attrs.$vnode) {
      var childArgs = []
      for (i = 1; i < arguments.length; i++) childArgs.push(arguments[i])
      return t(tag, {}, childArgs)
    }

    if (!children) children = []

    if (Array.isArray(children[0])) children = children[0]

    // automatically turn any child nodes that are strings into text nodes
    for (i = 0; i < children.length; i++) {
      if (typeof children[i] !== 'undefined' &&
        (
          children[i].constructor === String ||
          children[i].constructor === Number
        )
      ) {
        children[i] = createTextNode(children[i].toString())
      }
    }
    
    var isComponent = tag && tag.constructor === Function

    return {
      $vnode: true,
      component: isComponent,
      tag: tag,
      attrs: attrs,
      children: isComponent 
        ? tag(Object.assign({}, {children: children}, attrs))
        : children
    }
  },

  mount: function mount (app, element) {
    var initialRender = true
    var oldVdom = {
      root: true,
      component: false,
      tag: null,
      attrs: {},
      children: []
    }

    function render(initialCheck) {
      var newVdom = app()
      // get the diff from the old
      var diff = require('./diff')(oldVdom, newVdom, [])
      require('./patch')(diff, element, render, initialRender)
      // set the oldVdom as the newVdom so it will be diffed against next
      oldVdom = newVdom
    }
    
    render()
    initialRender = false

    return render
  }
}
