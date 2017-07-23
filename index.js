const {t, mount} = require('./src')

let uid = 0

const state = {
  newTodo: 'new todo',
  todos: [
    {id: uid, title: 'do stuff', completed: false}
  ],
  count: 0
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
    t('h3', state.newTodo),
    t('button', {
      onclick: function (e) {
        state.todos.push({id: uid += 1, title: state.newTodo, completed: false})
        state.newTodo = ''
      }
    }, 'click me!'),
    t('ul', state.todos.map(function (todo) {
      return t('li', {key: todo.id}, todo.title)
    })),
    t('div',
      t('button', {
        onclick: function () {
          state.count += 1
        }
      }, '+'),
      state.count.toString()
    )
  )
}

document.addEventListener('DOMContentLoaded', function () {
  mount(app, document.body)
})
