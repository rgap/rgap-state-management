// Initial state
let state = {
  cartCount: 0,
};

// Function to fetch the current state from the server
async function fetchState() {
  const response = await fetch("/counter");
  const data = await response.json();
  state = data;
  render();
}

// Function to update the state on the server
async function updateState(newState) {
  state = { ...state, ...newState };
  await fetch("/counter", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(state),
  });
  render();
}

// Function to get the current state
function getState() {
  return state;
}

// Function to set the current state
function setState(newState) {
  updateState(newState);
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

// Initial fetch and render
fetchState();
