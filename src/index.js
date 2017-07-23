var patch = require('./patch')

module.exports = {
  t: function t (tag, attrs, children) {
    if (
      arguments.length === 2 &&
      (attrs.constructor === Array || attrs.constructor === String)
    ) {
      return t(tag, {}, attrs)
    }

    if (arguments[1] && arguments[1].$vnode) {
      var childNodes = []
      for (var i = 1; i < arguments.length; i++) {
        childNodes.push(arguments[i])
      }
      return t(tag, {}, childNodes)
    }

    return {
      $vnode: true,
      tag: tag,
      attrs: attrs || {},
      children: children || []
    }
  },

  mount: function mount (app, element) {
    var vdom = app()

    var render = require('./render')(function onUpdate () {
      var updatedVdom = app()
      patch(vdom, updatedVdom, render)
    })

    render(element, vdom)
  }
}
