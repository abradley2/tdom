function diff(oldVnode, newVnode, operations) {
  // if the tag is changed we scrap the element
  if (oldVnode.tag !== newVnode.tag) {
    operations.push({
      op: 'REPLACE',
      tag: newVnode.tag,
      attrs: newVnode.attrs,
      children: newVnode.children,
      component: newVnode.component,
      root: newVnode.root
    })
    
    // aaaaand we're done here
    return operations
  }
  
  // text nodes are easy to diff, just compare their text
  if (oldVnode.textNode && newVnode.textNode) {
    if (oldVnode.text !== newVnode.text) {
      operations.push({
        op: 'CHANGE_TEXT',
        text: newVnode.text
      })
    }
    return
  }
  
  // lets create a cache of all the old children nodes. Will make things easier laterrr
  var cache = {}
  oldVnode.children.forEach(function (child, idx) {
    if (child && child.attrs.key) {
      // these need an index so we can tell if they moved
      child.idx = idx 
      cache[child.attrs.key] = child
    }
  })

  // now let's see if anything was re-arranged because this is the tricky stuff
  var i
  for (i = 0; i < newVnode.children.length; i ++) {
    var newVnodeChild = newVnode.children[i]
    var key = newVnodeChild.attrs.key
    var cacheHit = cache[key]
    var oldVnodeChild = cacheHit || oldVnode.children[i]

    // did we move this node around?
    if (cacheHit && i !== cacheHit.idx) {
      // first let's tell patch to move the node to it's new home
      operations.push({
        op: 'MOVE',
        from: cache[newKey].idx,
        to: i,
        subOps: diff(oldVnodeChild, newVnodeChild, [])
      })
    } else

    // if we have a key and there's nothing cached, but we're not adding, we need to insert
    if (key && !cacheHit && i < oldVnode.children.length - 1) {
      operations.push({
        op: 'INSERT',
        at: i,
        tag: newVnode.tag,
        attrs: newVnode.attrs,
        children: newVnode.children,
        component: newVnode.component,
        subOps: diff(oldVnodeChild, newVnodeChild, [])
      })
    } else  
    // if we've gone beyond the boundary and there's no cache hit
    // (if there was a cache hit we would have already dispatched the move op)
    if (!cacheHit && i > oldVnode.children.length - 1) {
      operations.push({
        op: 'APPEND',
        tag: newVnode.tag,
        attrs: newVnode.attrs,
        children: newVnode.children,
        component: newVnode.component,
        subOps: diff(oldVnodeChild, newVnodeChild, [])
      })
    } else  
    // No movement of the node, inserting, or appending, just diff da children
    operations.push({
      op: 'NOOP',
      subOps: diff(oldVnodeChild, newVnodeChild, [])
    })
  }

  // if the number of new children is less than old, we need to remove the rest
  while (i < oldVnode.children.length) {
    operations.push({
      op: 'REMOVE',
      at: i
    })
    i++
  }
  return operations
}

module.exports = diff