var getAttr = require('./attrs').getAttr
var setAttr = require('./attrs').setAttr
var events = require('./events')

// convenience function for when we render an entirely new tree since it's just
// so much easier
function renderNewTree(params, parent, render) {
  // first we create the node
  var el = params.textNode
    ? document.createTextNode(params.text)
    : document.createElement(params.tag)
  
  // then go through the attributes and set them all
  Object.keys(params.attrs).forEach(function (attrName) {
    var attr = params.attrs[attrName]
    
    // we need to treat event handlers special
    if (events[attrName]) {
      attr = (function (handler) {
        var wrapped = function (e) {
          var result = params.attrs[attrName](e, render) // pass render as a callback for non-promise async
          if (result && result.then) { // respect and wait for handlers that call async
            return result.then(render).catch(render)
          }
          return render()
        }
        wrapped.wrapped = true // so we don't double wrap later
        return wrapped
      })(attr)
      
      el[attrName] = attr
    } else {
      // other attributes we can just use our simple convenience function
      setAttr(el, attrName, params.attrs[attrName])
    }
  })
  
  // call it for all the children as well
  params.children.forEach(function (childVnode) {
    if (!childVnode) return
    renderNewTree(childVnode, el, render)
  })
  
  // add it to parent``
  if (parent) parent.appendChild(el)
  
  // return fo' dat convenience
  return el
}

function patch(operations, element, render, initialRender) {
  for (var i = 0; i < operations.length; i++) {
    var params = operations[i]
    var op = params.op
    
    // for the initial render the replace is actually adding a root element
    if (op === 'REPLACE') {
      renderNewTree(params, element, render)
      continue
    }
  }
  return {}
}

module.exports = patch