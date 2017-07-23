const {t, mount} = require('./src')

let uid = 0

const state = {
  newTodo: 'new todo',
  todos: [
    {id: uid, title: 'do stuff', completed: false}
  ]
}

function app () {
  return t('div',
    t('input', {
      type: 'text',
      value: state.newTodo,
      oninput: function (e) {
        state.newTodo = e.target.value
      }
    }),
    t('h3', 'Some Text'),
    t('button', {
      onclick: function (e) {
        state.todos.push({id: uid += 1, title: state.newTodo, completed: false})
        state.newTodo = ''
      }
    }, 'click me!'),
    t('ul', state.todos.map(function (todo) {
      return t('li', {key: todo.id}, todo.title)
    }))
  )
}

document.addEventListener('DOMContentLoaded', function () {
  mount(app, document.body)
})
