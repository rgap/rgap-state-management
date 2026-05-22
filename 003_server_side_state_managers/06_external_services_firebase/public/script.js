// Import Firebase configuration
import { firebaseConfig } from "./firebase-config.js";

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Initial state
let state = {
  cartCount: 0,
};

// Function to fetch the current state from Firebase
async function fetchState() {
  const doc = await db.collection("cart").doc("counter").get();
  if (doc.exists) {
    state = doc.data();
    render();
  }
}

// Function to update the state in Firebase
async function updateState(newState) {
  state = { ...state, ...newState };
  await db.collection("cart").doc("counter").set(state);
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
