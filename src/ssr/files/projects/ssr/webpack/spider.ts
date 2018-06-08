
// These are importnaant and needed before anything else
import "zone.js/dist/zone-node";
import "reflect-metadata";

import { renderModuleFactory } from "@angular/platform-server";
import { enableProdMode } from "@angular/core";
import * as minimist from 'minimist';

import * as express from 'express';

//import { platformServer, renderModule, renderModuleFactory } from '@angular/platform-server';

import {
  existsSync,
  readFileSync,
  readdirSync,
  mkdirSync,
  writeFileSync
} from "fs";
import { resolve, basename, join } from "path";
import { minify } from "html-minifier";

let patterns = []


// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

// Express server


//const ROUTES = ['', '/es/tienda-cosmetica-natural']
import { createWindow, createDocument } from "domino";
import { ReplaySubject } from "rxjs";
import { interval } from 'rxjs';
import { exec_child, checkIgnoredRoutes, checkEnsuredRoutes, readConfig } from '../utils/spwan';
import { map, switchMap } from 'rxjs/operators';
import { ROUTES } from "../routes/routes";
import { SSRCliOptions } from "../utils/models";

interface spiderOptions {
  force:boolean,
  ignore:string[],
  whitelist:string[],
  add:string[],
}

let options = {}

//let config:configOptions = readConfig()
let spiderConfig:spiderOptions = readConfig().spider;

let route = "";


// Our index.html we'll use as our template

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
const SRC_FOLDER = join(process.cwd(), "src");
const indexTemplate = readFileSync(
  join(SRC_FOLDER , "index.html")
).toString();


const routesSpider: string[] = [];
const routesDone: string[] = [];

routesSpider.push(route);
spiderConfig.add.forEach(x=> routesSpider.push(x));

let i: number = 0;
const routesLen = ROUTES.length;
const renderURL = new ReplaySubject<string>(100);
let url = ""
renderURL.subscribe(
  (options: string) => {
        console.log(options);
       url  = options;


        renderEachUrl(url)


  },
  error => {
    console.log(`error: at ${url}`  );
    let introText = `export const ROUTESSPIDER`
     writeFileSync(resolve(SSR_FOLDER  + '/routes/routes-spider.ts'),introText + "OK =" + JSON.stringify(routesDone));
     writeFileSync(resolve(SSR_FOLDER  + '/routes/routes-spider.nok.ts'),introText + "NOK =" + JSON.stringify(routesSpider));
    },
  () => {
    console.log(`finish last url: ${url}`);

    if (spiderConfig.force)
    {
      let introROUTESText = `export const ROUTES = `
      writeFileSync(resolve(SSR_FOLDER  + '/routes/routes.ts'),introROUTESText + JSON.stringify(routesDone));

    }
    let introText = `export const ROUTESSPIDER = `
     writeFileSync(resolve(SSR_FOLDER  + '/routes/routes-spider.ts'),introText + JSON.stringify(routesDone));


  }
);

function renderEachUrl(url:string): void {

    renderModuleFactory(AppServerModuleNgFactory, {
        document: indexTemplate,
        url: url,
        extraProviders: [provideModuleMap(LAZY_MODULE_MAP)]
      })
        .then(html => {
          routesDone.push(url);

          var document = createDocument(html);
          var body = document.querySelector("body");
          var h1 = body.querySelectorAll("[href]");

          for (let index = 0; index < h1.length; index++) {
            let attr = h1.item(index).getAttribute("href");


            if ( routesDone.indexOf(attr)== -1 && (checkIgnoredRoutes(spiderConfig.ignore,attr) ||
            checkEnsuredRoutes(spiderConfig.whitelist,attr))
           )
            {
                          routesSpider.push(attr);
            }
          }



          do
          {

          if (routesDone.indexOf(routesSpider[0])!=-1)
            {  routesSpider.splice(0,1) }


          }
          while (routesSpider.length!=0 && routesDone.indexOf(routesSpider[0])!=-1
           );


         //   console.log(routesSpider[0].substr(1,2));

          if (routesSpider.length==0)
          {
              renderURL.complete();

          }
          else{

            renderURL.next(routesSpider[0])
          }





        })
        .catch(error => {

        });

}

renderURL.next(routesSpider[0])




