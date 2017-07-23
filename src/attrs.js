var specials = {
  value: 'value',
  class: 'className',
  className: 'className',
  style: 'style',
  id: 'id'
}

exports.getAttr = function (el, attr) {
  if (specials[attr]) return el[specials[attr]]
  return el.getAttribute(attr)
}

exports.setAttr = function (el, attr, value) {
  if (specials[attr]) el[specials[attr]] = value
  el.setAttribute(attr, value)
}
