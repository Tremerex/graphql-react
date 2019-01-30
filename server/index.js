import ReactDOMServer from 'react-dom/server';
import compression from 'compression';
import favicon from 'express-favicon';
import bodyParser from 'body-parser';
import express from 'express';
import React from 'react';
import path from 'path';
import fs from 'fs';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { StaticRouter } from 'react-router-dom';
import { execute, subscribe } from 'graphql';
import { createServer } from 'http';
import { ApolloProvider } from "react-apollo";
import schema from './schema';
import { App } from '../src/components/init';
import { client } from '../src/components/apollo';
import { ChunkExtractor } from '@loadable/server'

const app = express();
const PORT = process.env.PORT || 3000;
const INDEX_FILE = path.join(__dirname, '../index.html');

app.disable('x-powered-by');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(favicon(path.join(__dirname, '../../server/assets/images/graphql.ico')));
app.use(compression());

app.use(express.static(path.join(__dirname, '../assets')));

app.use('/robots.txt', (req, res) => {
  res.header('Content-Type', 'text/plain');
  res.send('User-agent: *\nDisallow: /');
});

app.use('/graphql', graphqlExpress({
  schema
}));

app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
  subscriptionsEndpoint: `ws://localhost:${PORT}/subscriptions`,
}));

app.use('/', (req, res) => {
  const context = {};

  const app = ReactDOMServer.renderToString(
    <ApolloProvider client={client}>
      <StaticRouter location={req.url} context={context}>
        <App />
      </StaticRouter>
    </ApolloProvider>
  );

  global.window = typeof global.window === 'undefined' ? {} : global.window;

  const statsFile = path.join(__dirname, '../loadable-stats.json');
  const extractor = new ChunkExtractor({ statsFile, entrypoints: ['app'] });

  console.log('*'.repeat(80));
  console.log(extractor.getScriptTags());
  console.log('*'.repeat(80));
  console.log(extractor.getStyleTags());
  console.log('*'.repeat(80));


  fs.readFile(INDEX_FILE, 'utf8', (err, data) => {
    if (err) {
      console.error('Something went wrong:', err);
      return res.status(500).send('Oops, better luck next time!');
    }
    return res.send(
      data.replace('<div id="mainContainer"></div>', `<div id="mainContainer">${app}</div>`)
    );
  });
});

const ws = createServer(app);

ws.listen(PORT, () => {
  new SubscriptionServer({
    schema,
    execute,
    subscribe
  }, {
    server: ws,
    path: '/subscriptions',
  });
});
