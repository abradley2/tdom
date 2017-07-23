module.exports = function (oldVnode, newVnode, render) {
  var parent = oldVnode.dom.parentElement

  // if the tag is entirely different,
  // copy over everything fresh and re-render
  if (oldVnode.tag !== newVnode.tag) {
    if (oldVnode.root) throw new Error('Cannot change tag of root app element')

    var oldChildNode = oldVnode.dom
    var newChildNode = render(Object.assign(oldVnode, newVnode)).dom

    parent.replaceChild(oldChildeNode, newChildNode)
  }
}
