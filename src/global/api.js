
import { ApolloClient } from 'apollo-client';
import { split } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { HttpLink } from 'apollo-link-http';

// fragment matcher for unions and interfaces in gql
import introspectionQueryResultData from './fragmentTypes.json';

let apiClient;

const defaultOptions = {
  watchQuery: {
    fetchPolicy: 'network-only',
    errorPolicy: 'ignore',
  },
  query: {
    fetchPolicy: 'network-only',
    errorPolicy: 'all',
  },
};

const initApiClient = async (getState, { API_GRAPHQL = "localhost", API_WEBSOCKET = "localhost" }) => {
  const headers = {
    'x-token': getState().auth.user && getState().auth.user.getIdToken
      ? await (getState().auth.user).getIdToken()
      : null,
  };

  const authLink = setContext(async () => {
    const { user } = getState().auth;
    const token = user && user.getIdToken ? await user.getIdToken() : null;
    return { headers: { 'x-token': token } };
  });

  try {
    const httpLink = new HttpLink({
      uri: API_GRAPHQL,
    });

    // Create a WebSocket link:
    const wsLink = new WebSocketLink({
      uri: API_WEBSOCKET, // websocket url
      options: {
        reconnect: true,
        connectionParams: { ...headers },
      },
    });

    const requestSplit = ({ query }) => {
      const { kind, operation } = getMainDefinition(query);
      return kind === 'OperationDefinition' && operation === 'subscription';
    };

    // split based on operation type
    const link = split(
      requestSplit,
      wsLink,
      authLink.concat(httpLink)
    );

    const fragmentMatcher = new IntrospectionFragmentMatcher({ introspectionQueryResultData });

    apiClient = new ApolloClient({
      link,
      cache: new InMemoryCache({ fragmentMatcher }),
      defaultOptions,
    });
  } catch (error) {
    console.error(error);
  }
};

export { initApiClient, apiClient };
