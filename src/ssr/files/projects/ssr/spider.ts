// These are importnaant and needed before anything else
import "zone.js/dist/zone-node";
import "reflect-metadata";

import { renderModuleFactory } from "@angular/platform-server";
import { enableProdMode } from "@angular/core";

import { Request, Response } from "express";
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

// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

// Express server

import { ROUTES } from "./routes";
//const ROUTES = ['', '/es/tienda-cosmetica-natural']
import { createWindow, createDocument } from "domino";
import { ReplaySubject } from "rxjs";

let route = "";
//route = ""///es/wellness-y-bienestar-natural/cuidados-de-hammam";
//const ROUTESX = matcharray(/\/tienda-cosmetica-natural/,ROUTES);
const SSR_FOLDER = join(process.cwd(), 'projects/ssr');
const DIST_FOLDER = join(process.cwd(), 'dist/<%= projectName %>');
const DIST_FOLDER_SERVER = join(process.cwd(), 'dist/<%= projectName %>-server');
const SRC_FOLDER = join(process.cwd(), "src");
// Our index.html we'll use as our template
const indexTemplate = readFileSync(
  join(DIST_FOLDER_SERVER , "index.html")
).toString();

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const {
  AppServerModuleNgFactory,
  LAZY_MODULE_MAP
} = require("../../dist/<%= projectName %>-server/main");

const {
  provideModuleMap
} = require("@nguniversal/module-map-ngfactory-loader");

const routesSpider: string[] = [];
const routesDone: string[] = [];
routesSpider.push(route);

let url;
let i: number = 0;
const routesLen = ROUTES.length;
const renderURL = new ReplaySubject<string>(100);

renderURL.subscribe(
  (url: string) => {
        this.url = url;
      renderEachUrl(url)
  },
  error => {
    console.log(`error: at ${this.url}`  );
    let introText = `export const ROUTES-SPIDER`
     writeFileSync(resolve(SSR_FOLDER  + '/routes-spider.ts'),introText + "-OK =" + JSON.stringify(routesSpider));
     writeFileSync(resolve(SSR_FOLDER  + '/routes-spider.nok.ts'),introText + "-NOK =" + JSON.stringify(routesDone));
    },
  () => {
    console.log(`finish last url: ${this.url}`);
    let introText = `export const ROUTES-SPIDER = `
     writeFileSync(resolve(SSR_FOLDER  + '/routes-spider.ts'),introText + JSON.stringify(routesSpider));


  }
);

function renderEachUrl(url): void {

    renderModuleFactory(AppServerModuleNgFactory, {
        document: indexTemplate,
        url: url,
        extraProviders: [provideModuleMap(LAZY_MODULE_MAP)]
      })
        .then(html => {
          routesDone.push(url);
          writeFileSync(resolve(DIST_FOLDER  + '/check.html'),html);
           
          var document = createDocument(html);
          var body = document.querySelector("body");
          var h1 = body.querySelectorAll("[href]");
      
          for (let index = 0; index < h1.length; index++) {
            let attr = h1.item(index).getAttribute("href");
      
            let exclude = ['/es/wellness-y-bienestar-natural-veganos',
            '/es/regalo-bienestar-spa-gift-vouchers/','/es/reservas']
           let exdludeIn=  exclude
            .map(x=>  attr.indexOf(x))
            .filter(y=> y==-1).length
           
            console.log(exdludeIn,'length',attr);


            if (attr.substr(0, 4) == "/es/" 
             && routesDone.indexOf(attr)== -1 

            && exclude
            .map(x=>  attr.indexOf(x))
            .filter(y=> y==-1).length==3
              // && attr.indexOf("wellness-y-bienestar-natural-veganos") == -1
              // && attr.indexOf("/es/regalo-bienestar-spa-gift-vouchers/") == -1
              // && attr.indexOf("/es/reservas") == -1
          ) 
            {
              routesSpider.push(attr);
            }
          }
          

         
          do
          {
          
          if (routesDone.indexOf(routesSpider[0])!=-1)
            {  routesSpider.splice(0,1) }
          console.log(routesSpider.length)
         
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

renderURL.next(routesSpider[0]);

