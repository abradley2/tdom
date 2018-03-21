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
        state.newTodo = 'stuff'
      }
    }, 'click me!'),
    t('ul', state.todos.map(function (todo, idx) {
      return t('li', {key: todo.id}, [
        t('span', {
          style: todo.completed ? 'color: blue;' : ''
        }, todo.title),
        t('input', {
          type: 'text',
          value: todo.title,
          oninput: function (e) {
            state.todos[idx].title = e.target.value
          }
        }),
        t('button', {
          onclick: function (e) {
            state.todos[idx].completed = !state.todos[idx].completed
          }
        }, 'complete'),
        t('button', {
          onclick: function (e) {
            state.todos = state.todos.filter(function (v) {
              return v.id !== todo.id
            })
          }
        }, 'delete')
      ])
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
