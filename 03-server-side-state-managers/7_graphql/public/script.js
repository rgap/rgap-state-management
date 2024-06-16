// Function to send a GraphQL query
async function graphqlQuery(query, variables) {
  const response = await fetch("/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });
  return response.json();
}

// Function to fetch the current state from the server
async function fetchState() {
  const query = `
    query {
      cartCount
    }
  `;
  const response = await graphqlQuery(query);
  state.cartCount = response.data.cartCount;
  render();
}

// Function to update the state on the server
async function updateState(newCount) {
  const mutation = `
    mutation ($cartCount: Int!) {
      setCartCount(cartCount: $cartCount) {
        cartCount
      }
    }
  `;
  const variables = { cartCount: newCount };
  const response = await graphqlQuery(mutation, variables);
  state.cartCount = response.data.setCartCount.cartCount;
  render();
}

// Initial state
let state = {
  cartCount: 0,
};

// Function to render the state
function render() {
  document.getElementById("cart-count").innerText = state.cartCount;
}

// Event listener for the "Add to Cart" button
document.getElementById("add-to-cart").addEventListener("click", () => {
  updateState(state.cartCount + 1);
});

// Event listener for the "Remove from Cart" button
document.getElementById("remove-from-cart").addEventListener("click", () => {
  if (state.cartCount > 0) {
    updateState(state.cartCount - 1);
  }
});

// Initial fetch and render
fetchState();
