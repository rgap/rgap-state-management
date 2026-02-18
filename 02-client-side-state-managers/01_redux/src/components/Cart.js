import React from "react";
import { connect } from "react-redux";
import { addToCart, removeFromCart } from "../store/actions";

const Cart = ({ cartCount, addToCart, removeFromCart }) => (
  <div>
    <h2>Cart</h2>
    <p>Items in cart: {cartCount}</p>
    <button onClick={addToCart}>Add to Cart</button>
    <button onClick={removeFromCart}>Remove from Cart</button>
  </div>
);

const mapStateToProps = state => ({
  cartCount: state.cart.cartCount,
});

const mapDispatchToProps = {
  addToCart,
  removeFromCart,
};

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
