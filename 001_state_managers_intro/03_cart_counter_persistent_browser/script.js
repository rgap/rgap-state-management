// Function to get the initial state from localStorage or set default state
function getInitialState() {
  const savedState = localStorage.getItem("cartState");
  return savedState ? JSON.parse(savedState) : { cartCount: 0 };
}

// Initial state
let state = getInitialState();

// Function to get the current state
function getState() {
  return state;
}

// Function to update the state and persist it to localStorage
function setState(newState) {
  state = { ...state, ...newState };
  localStorage.setItem("cartState", JSON.stringify(state));
  render();
}

// Function to render the state
function render() {
  document.getElementById("cart-count").innerText = state.cartCount;
}

// Event listener for the "Add to Cart" button
document.getElementById("add-to-cart").addEventListener("click", () => {
  setState({ cartCount: state.cartCount + 1 });
});

// Event listener for the "Remove from Cart" button
document.getElementById("remove-from-cart").addEventListener("click", () => {
  if (state.cartCount > 0) {
    setState({ cartCount: state.cartCount - 1 });
  }
});

// Initial render
render();
