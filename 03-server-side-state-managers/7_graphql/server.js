const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const app = express();
const port = 9200;

// Historical Context:
// GraphQL, developed by Facebook in 2012 and released publicly in 2015, is a query language for APIs and a runtime for executing those queries by providing a complete and understandable description of the data in your API.
// GraphQL allows clients to request exactly the data they need, reducing over-fetching and under-fetching of data compared to REST APIs.

let cartCount = 0; // In-memory state storage

// GraphQL schema
const schema = buildSchema(`
  type Query {
    cartCount: Int
  }
  type Mutation {
    setCartCount(cartCount: Int): Cart
  }
  type Cart {
    cartCount: Int
  }
`);

// Root resolver
const root = {
  cartCount: () => cartCount,
  setCartCount: ({ cartCount: newCount }) => {
    cartCount = newCount;
    return { cartCount };
  },
};

app.use(express.static("public"));
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true, // Enable GraphiQL UI
  })
);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
