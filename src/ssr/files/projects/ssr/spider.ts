
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
import { exec_child, checkIgnoredRoutes, checkEnsuredRoutes, readConfig, configOptions, } from "./utils/spwan";
import { map, switchMap } from 'rxjs/operators';
import { ROUTES } from "./routes/routes";

interface spiderOptions {
  ignore:string[],
  whitelist:string[],
  add:string[],
}

let options = {}

//let config:configOptions = readConfig()
let spiderConfig:spiderOptions = readConfig().spider;

let route = "";
const SSR_FOLDER = join(process.cwd(), 'projects/ssr');
const DIST_FOLDER = join(process.cwd(), 'dist/angular.io-example');
const DIST_FOLDER_SERVER = join(process.cwd(), 'dist/angular.io-example-server');
const SRC_FOLDER = join(process.cwd(), "src");
// Our index.html we'll use as our template
const indexTemplate = readFileSync(
  join(SRC_FOLDER , "index.html")
).toString();

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const {
  AppServerModuleNgFactory,
  LAZY_MODULE_MAP
} = require("../../dist/angular.io-example-server/main");

const {
  provideModuleMap
} = require("@nguniversal/module-map-ngfactory-loader");

const routesSpider: string[] = [];
const routesDone: string[] = [];

routesSpider.push(route);
spiderConfig.add.forEach(x=> routesSpider.push(x));

console.log(spiderConfig.add);
console.log(routesSpider);

let url;
let i: number = 0;
const routesLen = ROUTES.length;
const renderURL = new ReplaySubject<string[]>(100);

renderURL.subscribe(
  (options: string[]) => {
    
        this.url = options[0];

       
        renderEachUrl([this.url,options[1]])
  

  },
  error => {
    console.log(`error: at ${this.url}`  );
    let introText = `export const ROUTESSPIDER`
     writeFileSync(resolve(SSR_FOLDER  + '/routes-spider.ts'),introText + "OK =" + JSON.stringify(routesDone));
     writeFileSync(resolve(SSR_FOLDER  + '/routes-spider.nok.ts'),introText + "NOK =" + JSON.stringify(routesSpider));
    },
  () => {
    console.log(`finish last url: ${this.url}`);
    let introText = `export const ROUTESSPIDER = `
     writeFileSync(resolve(SSR_FOLDER  + '/routes-spider.ts'),introText + JSON.stringify(routesDone));


  }
);

function renderEachUrl(url:string[]): void {

    renderModuleFactory(AppServerModuleNgFactory, {
        document: indexTemplate,
        url: url[0],
        extraProviders: [provideModuleMap(LAZY_MODULE_MAP)]
      })
        .then(html => {
          routesDone.push(url[0]);

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

            renderURL.next([routesSpider[0],url[1]])
          }





        })
        .catch(error => {

        });

}



  exec_child('ng',['run', 'angular.io-example:server'])
  .subscribe(x=>  renderURL.next([routesSpider[0],'server']) );


