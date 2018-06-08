import 'zone.js/dist/zone-node';
import 'reflect-metadata';

import { enableProdMode } from '@angular/core';


import { logging } from "@angular-devkit/core";
import { initializeLogging } from "../ssr-cli";
import { readConfig } from "../utils/spwan";
import { SSRCliOptions } from "../utils/models";

import { ReplaySubject } from "rxjs";
import { ROUTES } from "../routes/routes";
import { renderModuleFactory } from "@angular/platform-server";
import { readFileSync, existsSync, mkdirSync, writeFileSync } from "fs";
import { join, resolve } from "path";
import { PageOptimizer } from '../utils/css-optimize';

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

const {
  provideModuleMap
} = require("@nguniversal/module-map-ngfactory-loader");
const SSR_FOLDER = join(process.cwd(), ssrConfig.configOptions.paths.SSR_FOLDER);
const DIST_FOLDER = join(process.cwd(), ssrConfig.configOptions.paths.DIST_FOLDER);
const DIST_FOLDER_SERVER = join(process.cwd(),ssrConfig.configOptions.paths.DIST_FOLDER_SERVER);


enableProdMode();


let pageOptimizer = new PageOptimizer();
pageOptimizer.initialize();

const renderServer = new ReplaySubject<string>(100);

const indexTemplate = readFileSync(join(DIST_FOLDER, "index.html")).toString();
let i = 0;

renderServer.subscribe(
  (options: string) => {
    let url = options;

   renderEachUrl(url);
  },
  error => {
    console.log(`error: at ${error}`);
    process.stdout.write('mi error')
  },
  () => {
    console.log(`finish last url: `);
    process.stdout.write('fini que no')
     //  process.exit();
  }
);


async function renderRoutes() {
  process.stderr.write('2');
  // if (false) {
  //   await this.pageOptimizer.initialize();
  // }
   process.stderr.write('justo antes');

       renderServer.next(ROUTES[0]);


}

async function renderEachUrl(route: string): Promise<void> {


  process.stderr.write(route);

  renderModuleFactory(AppServerModuleNgFactory, {
    document: indexTemplate,
    url: route,
    extraProviders: [provideModuleMap(LAZY_MODULE_MAP)]
  })
    .then(async html => {
  process.stderr.write(route);

  if(ssrConfig.configOptions.static.optimizecss==true)
  {
    html = await pageOptimizer.optimizeCss(html)
  }
  if(ssrConfig.configOptions.static.minifyhtml==true)
  {
    html = await pageOptimizer.minifyHtml(html)
  }
  let routesSplit = route.split("/");
  let checkRoute = DIST_FOLDER;
  let filename = route
    .split("/")
    .join("-")
    .substr(1, route.split("/").join("-").length - 1);

  for (var index = 0; index <= routesSplit.length - 1; index++) {
    if (!existsSync(checkRoute + "/" + routesSplit[index])) {
      mkdirSync(checkRoute + "/" + routesSplit[index]);
    }

    checkRoute = checkRoute + "/" + routesSplit[index];
    var element = [index];
  }
  process.stdout.write(route.length.toString());
  if(route.length==0)
  {
    writeFileSync(
      resolve(DIST_FOLDER  + "/index.html"),
      html
    );
  }
  else
  {
    writeFileSync(
      resolve(DIST_FOLDER + route + "/" + "index.html"),
      html
    );
  }
  i++;

  if (ROUTES.length == i) {
    renderServer.complete();
  } else {
    renderServer.next(ROUTES[i]);
  }
  // try {
  //   const htmlOpti = html//await this.pageOptimizer.optimizeCss(html);

  //   writeFileSync(
  //     resolve(DIST_FOLDER + route + "/" + "index.html"),
  //     htmlOpti
  //   );
  //   console.log(`Rendering: ${route} `);
  // } catch (e) {
  //   console.log("Error in optimizing", e);
  // }
})
}

renderRoutes()
.then(x=> console.log(x))
.catch(err=> console.log(err));

