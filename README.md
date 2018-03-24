# smol

An experiment in building a virtual dom library that is very smol

### Usage

Pretty similar to React but simplified lots.

__React__
```
class Counter extends React.Component {
  constructor() {
    super()
    this.state = {count: 1}
  }
  
  render() {
    return <div>
      <span>{this.state.count}</span>
      <button onClick={() => this.setState({count: this.state.count + 1})}>
        ++
      </button>
    </div>
  }
}
```

__tdom__
```
const state = {count: 1}

function counter() {
  return <div>
    <span>{state.count}</span>
    <button onclick={() => state.count++}>
      ++
    </button>
  </div>
}
```
The key difference is there's no need to call `setState` to trigger a re-render.
tdom is smart and will diff the dom anytime an event handler is called. If your
state change after an event handler is asynchronous, no problem, return a promise
from the event handler and it will delay the state change till then. Lastly, you can
always just call a manual re-render, but 99% of the time this implicit handling
of state change _just works_.