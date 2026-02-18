# Redux Example 1

This example demonstrates a simple implementation of Redux for managing the state of a shopping cart in a React application.

## How to Run

1. Ensure you have the necessary dependencies installed. If not, run:
   ```sh
   npm install
   ```
2. Open `public/index.html` in a web browser.
3. Click the "Add to Cart" and "Remove from Cart" buttons to update the cart count.
4. The cart count will be updated and displayed in real-time using Redux.

### Explanation

- **Store**: Holds the state of the application.
- **Actions**: Describe the changes that should be made to the state.
- **Reducers**: Define how the state changes in response to actions.
- **Provider**: Makes the Redux store available to the rest of the app.
- **Connect**: Connects React components to the Redux store.
