const {t, mount} = require('./src')

let uid = 0

const state = {
  todos: [
    {id: uid, title: 'do stuff', completed: false}
  ]
}

function app () {
  return t('div',
    t('input', {
      type: 'text',
      value: 'hi',
      oninput: function (e) {
        window.console.log(e)
      }
    }),
    t('h3', 'Some Text'),
    t('button', {
      onclick: function (e) {
        window.console.log(e)
      }
    }, 'click me!'),
    t('ul', state.todos.map(function (todo) {
      return t('li', todo.title)
    }))
  )
}

document.addEventListener('DOMContentLoaded', function () {
  mount(app, document.body)
})
