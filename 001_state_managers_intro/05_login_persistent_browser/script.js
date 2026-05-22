// Function to get the initial state from localStorage
function getInitialState() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const username = localStorage.getItem("username") || "";
  return {
    isLoggedIn,
    username,
  };
}

// Initial state
let state = getInitialState();

// Function to get the current state
function getState() {
  return state;
}

// Function to update the state and persist it in localStorage
function setState(newState) {
  state = { ...state, ...newState };
  localStorage.setItem("isLoggedIn", state.isLoggedIn);
  localStorage.setItem("username", state.username);
  render();
}

// Function to render the state
function render() {
  const { isLoggedIn, username } = state;
  const loginForm = document.getElementById("login-form");
  const userInfo = document.getElementById("user-info");
  const userNameSpan = document.getElementById("user-name");

  if (isLoggedIn) {
    loginForm.style.display = "none";
    userInfo.style.display = "block";
    userNameSpan.textContent = username;
  } else {
    loginForm.style.display = "block";
    userInfo.style.display = "none";
    userNameSpan.textContent = "";
  }
}

// Event listener for the "Login" button
document.getElementById("login-button").addEventListener("click", () => {
  const username = document.getElementById("username").value;
  if (username) {
    setState({ isLoggedIn: true, username });
  }
});

// Event listener for the "Logout" button
document.getElementById("logout-button").addEventListener("click", () => {
  setState({ isLoggedIn: false, username: "" });
});

// Initial render
render();
