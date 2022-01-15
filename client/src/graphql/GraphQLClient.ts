import {
  ApolloClient,
  InMemoryCache,
  from,
  split,
  HttpLink,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { getMainDefinition } from "@apollo/client/utilities";

// TODO: only do this during development
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );

  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const splitLink = split(({ query }) => {
  const definition = getMainDefinition(query);
  return (
    definition.kind === "OperationDefinition" &&
    definition.operation === "subscription"
  );
}, from([errorLink, new HttpLink({ uri: "http://localhost:8080/graphql" })]));

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

export default client;
