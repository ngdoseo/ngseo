
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

import { ROUTES } from "./routes/routes";
//const ROUTES = ['', '/es/tienda-cosmetica-natural']
import { createWindow, createDocument } from "domino";
import { ReplaySubject } from "rxjs";
import { interval } from 'rxjs';
import { exec_child } from "./utils/spwan";
import { map, switchMap } from 'rxjs/operators';
import { ChromeRenderer } from "./utils/chrome";

let options = {}

let newCrome = new ChromeRenderer();

let route = "";
//route = ""///es/wellness-y-bienestar-natural/cuidados-de-hammam";
//const ROUTESX = matcharray(/\/tienda-cosmetica-natural/,ROUTES);
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

let url;
let i: number = 0;
const routesLen = ROUTES.length;
const renderURL = new ReplaySubject<string[]>(100);

renderURL.subscribe(
  (options: string[]) => {
    console.log('he llegado aqui');
        this.url = options[0];

      if (options[1]=='server')
      {
        renderEachUrl([this.url,options[1]])
      }
      else
      {
        scrapEachUrl([this.url,options[1]])
      }

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




            if ( routesDone.indexOf(attr)== -1

            // && exclude
            // .map(x=>  attr.indexOf(x))
            // .filter(y=> y==-1).length==3
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

function scrapEachUrl(url:string[]): void {



newCrome.render({ url:"http://localhost:4200/" + url[0]  })
.then(html => {
        routesDone.push(url[0]);
      

        var document = createDocument(html);
        var body = document.querySelector("body");

        var h1 = body.querySelectorAll("[href]");

        for (let index = 0; index < h1.length; index++) {
          let attr = h1.item(index).getAttribute("href");




          if ( routesDone.indexOf(attr)== -1

          // && exclude
          // .map(x=>  attr.indexOf(x))
          // .filter(y=> y==-1).length==3
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
        console.log(error);
        console.log('soy un error');
      });

}



interface Options  {
  server:boolean,
  client:boolean,
 }

const argv = minimist(process.argv.slice(2), {
  boolean: ['client','server'],
 });

 const argvOptions = argv;

 let newObject= {}
 Object.keys(argv).filter(x=> x=='server'|| x=='client').forEach(x=> newObject[x]=argv[x])


 if (newObject['server']==true)
 {
  console.log('renderind ssr');
  exec_child('ng',['run', 'angular.io-example:server'])
  .subscribe(x=>  renderURL.next([routesSpider[0],'server']) );


 }

 else
 {

  // interval(1000).pipe(
  //   map(x=>
  //  request({
  //    uri: `http://localhost:4200/`,
  //    })
  //   .then( y=> {
  //       return 'ok'})
  //   .error(err=> {

  //     return 'nook'})
  //   )


  //  ).subscribe(y=> console.log(y))
 // renderURL.next([routesSpider[0],'client']);
  exec_child('ng',['build'])
  .subscribe(x=>  {
    console.log('Launching Local HOST SERVING THE APP');
    const app = express();

    const PORT = process.env.PORT || 4200;
    const DIST_FOLDER = join(process.cwd(), 'dist/angular.io-example');
    app.get('*.*', express.static(join(DIST_FOLDER)));
    app.get('*', function(req, res) {
      res.sendFile(join(DIST_FOLDER,'index.html')) // load the single view file (angular will handle the page changes on the front-end)
    });


// Start up the Node server
app.listen(PORT, () => {
  console.log(`Node server listening on http://localhost:${PORT}`);
  newCrome.initialyze()
  .then(()=> {
  renderURL.next([routesSpider[0],'client']);
  })
  .catch(err=> {console.log('browser not initialyze');
  console.log(err);

})
});


  })



 }
;


