import { combineReducers } from "redux";
import { ADD_TO_CART, REMOVE_FROM_CART } from "./actions";

// Initial state
const initialState = {
  cartCount: 0,
};

// Cart reducer
function cartReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_TO_CART:
      return { cartCount: state.cartCount + 1 };
    case REMOVE_FROM_CART:
      return { cartCount: state.cartCount > 0 ? state.cartCount - 1 : 0 };
    default:
      return state;
  }
}

// Combine reducers
const rootReducer = combineReducers({
  cart: cartReducer,
});

export default rootReducer;
