// Initial state
let state = {
  cartCount: 0,
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
