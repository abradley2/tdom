function render (node, tag, attrs, children) {
  if (arguments.length === 3 && attrs.constructor === Array) return render(tag, {}, attrs)
  var childNodes = children || []
}

module.exports = render
