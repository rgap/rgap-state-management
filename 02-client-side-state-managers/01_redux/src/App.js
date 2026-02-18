import React from "react";
import { Provider } from "react-redux";
import Cart from "./components/Cart";
import store from "./store";

const App = () => (
  <Provider store={store}>
    <Cart />
  </Provider>
);

export default App;
