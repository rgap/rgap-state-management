// Example 1: Simple Counter

// Initial state
// THIS STATE IS STORED IN MEMORY AND IS NOT PERSISTED ANYWHERE
let state = {
  count: 0,
};

// Function to get the current state
function getState() {
  return state;
}

// Function to update the state
function setState(newState) {
  state = { ...state, ...newState };
  render();
}

// Function to render the state
function render() {
  document.getElementById("counter").innerText = state.count;
}

// Event listeners for buttons
document.getElementById("increment").addEventListener("click", () => {
  setState({ count: state.count + 1 });
});

document.getElementById("decrement").addEventListener("click", () => {
  setState({ count: state.count - 1 });
});

// Initial render
render();
