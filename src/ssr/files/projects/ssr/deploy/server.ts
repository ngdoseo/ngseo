// These are important and needed before anything else
import 'zone.js/dist/zone-node';
import 'reflect-metadata';

import { enableProdMode } from '@angular/core';

import * as express from 'express';
import { join } from 'path';

// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

// Express server
const app = express();

const PORT = process.env.PORT || 4000;
let ssrConfig: SSRCliOptions = {
  cliOptions: {
    command:""
  },
  appOptions:{},
  configOptions:readConfig(),
};

const {
  AppServerModuleNgFactory,
  LAZY_MODULE_MAP
} = require("../../../" + ssrConfig.configOptions.paths.DIST_FOLDER_SERVER +"/main");


const SSR_FOLDER = join(process.cwd(), ssrConfig.configOptions.paths.SSR_FOLDER);
const DIST_FOLDER = join(process.cwd(), ssrConfig.configOptions.paths.DIST_FOLDER);
const DIST_FOLDER_SERVER = join(process.cwd(),ssrConfig.configOptions.paths.DIST_FOLDER_SERVER);
// Express Engine
import { ngExpressEngine } from '@nguniversal/express-engine';
// Import module map for lazy loading
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';
import { ROUTES } from '../routes/routes';
import { readConfig } from '../utils/spwan';
import { SSRCliOptions } from '../utils/models';

app.engine('html', ngExpressEngine({
  bootstrap: AppServerModuleNgFactory,
  providers: [
    provideModuleMap(LAZY_MODULE_MAP)
  ]
}));

app.set('view engine', 'html');
app.set('views', join(DIST_FOLDER_SERVER));

// TODO: implement data requests securely
app.get('/api/*', (req, res) => {
  res.status(404).send('data requests are not supported');
});

// Server static files from /browser
app.get('*.*', express.static(join(DIST_FOLDER)));


//Check whether rendered rotes have been defined
if (ROUTES.length == 1) {
  // If not all regular routes use the Universal engine
  app.get("*", (req, res) => {
    res.render("index", { req });
  });
}
else {
   // If yes, only defined routes will be server side rendered
  app.get(ROUTES, (req, res) => {
    res.render("index", { req });
  });
  // and the rest routes will be redirected to "/"
  app.get("*", (req, res) => {
    res.redirect('/');
  });

}


// Start up the Node server
app.listen(PORT, () => {
  console.log(`Node server listening on http://localhost:${PORT}`);
});
