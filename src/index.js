var appNode
var app

function getChildren (vnodeArgs) {
  var children = []
  for (var i = 1; i < vnodeArgs.length; i++) children.push(vnodeArgs[i])
  return children
}

module.exports = {
  t: function t (tag, attrs, children) {
    // normalize arguments
    if (arguments.length === 2 && (attrs.constructor === Array || attrs.constructor === String)) {
      return t(tag, {}, attrs)
    }
    if (arguments[1] && arguments[1].$vnode) {
      return t(tag, {}, getChildren(arguments))
    }

    // return structured vnode
    return {
      $vnode: true,
      tag: tag,
      attrs: attrs || {},
      children: children || []
    }
  },
  mount: function mount (app, element) {
    appNode = element
    app = app()

    window.console.log(app)
  }
}

