/** @jsx t */
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
  return <div>
    <input
      type="text"
      value={state.newTodo}
      oninput={(e) => {
        state.newTodo = e.target.value
      }}
    />
    <h3>{state.newTodo}</h3>
    <button
      onclick={(e) => {
        state.todos.push({id: uid += 1, title: state.newTodo, completed: false})
        state.newTodo = ''
      }}
    >
        Add New Todo
    </button>
    <ul>
      {state.todos.map(todo => {
        return <li key={todo.id}>
          <span
            style={todo.completed ? 'color: blue;' : ''}
          >
            {todo.title}
          </span>
          <input
            type="text"
            value={todo.title}
            oninput={(e) => {
              state.todos[idx].title = e.target.value
            }}
          />
          <button
            onclick={() => {
              state.todos[idx].completed = !state.todos[idx].completed
            }}
          >
            toggle complete
          </button>
          <button
            onclick={() => {
              state.todos = state.todos.filter((v) => {
                return v.id !== todo.id
              })
            }}
          >
            delete
          </button>
        </li>
      })}
    </ul>
    <div>
      <button
        onclick={() => {
          state.count += 1
        }}
      >
        +count
      </button>
    </div>
  </div>
}

document.addEventListener('DOMContentLoaded', function () {
  mount(app, document.body)
})
