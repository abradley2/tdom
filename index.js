/** @jsx smol */
const {smol, mount} = require('./src')

let uid = 0

const state = {
  newTodo: 'new todo',
  todos: [
    {id: uid, title: 'do stuff', completed: false}
  ],
  count: 0
}

function SomeComponent({text}) {
  return <div>
    <h3>{text}</h3>
  </div>
}

function app () {
  return <div>
    {/*<SomeComponent text={state.newTodo}/> */}
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
        state.newTodo = 'newtodo'
      }}
    >
        Add New Todo
    </button>
    <ul>
      {state.todos.map((todo, idx) => {
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
          {state.todos[idx].completed && <span>Completed!</span>}
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
      {state.count}
    </div>
    <div>
      {state.count % 2 === 0
        ? <span>span tag</span>
        : <h1> h1 tag</h1>
      }
    </div>
  </div>
}

document.addEventListener('DOMContentLoaded', function () {
  mount(app, document.body)
})
