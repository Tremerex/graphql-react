import React from 'react';
import { loadableReady } from '@loadable/component'
import { hydrate } from 'react-dom';
import { ApolloProvider } from "react-apollo";
import { BrowserRouter } from 'react-router-dom';

import { client } from './components/apollo';
import { App } from './components/init';

loadableReady(() => {
  hydrate(
    <ApolloProvider client={client}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ApolloProvider>,
    document.getElementById('mainContainer')
  );
});
