import { ApolloClient, InMemoryCache, from, split } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";
import { createUploadLink } from "apollo-upload-client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { getLocalStorageKey } from "../utils/api_client";

// TODO: fix this to not be hardcoded to localhost
const uploadLink = createUploadLink({
  uri: `${process.env.REACT_APP_SERV_PROTOCOL}${process.env.REACT_APP_SERV_HOSTNAME}/graphql`,
});

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

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  // TODO: update this to proper auth
  const token = localStorage.getItem(getLocalStorageKey());
  // return the headers to the context so terminating link can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const wsLink = new WebSocketLink({
  uri: `${process.env.REACT_APP_WS_PROTOCOL}${process.env.REACT_APP_SERV_HOSTNAME}/graphql`,
  options: {
    reconnect: true,
    connectionParams: {
      Authorization: localStorage.getItem(getLocalStorageKey()),
    },
  },
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  from([errorLink, authLink, uploadLink])
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

export default client;
