import * as minimist from "minimist";
import * as express from "express";
import {
  existsSync,
  readFileSync,
  readdirSync,
  mkdirSync,
  writeFileSync
} from "fs";
import { resolve, basename, join } from "path";
import { minify } from "html-minifier";

let patterns = [];



import { ROUTES } from "../routes/routes";

import { createWindow, createDocument } from "domino";
import { ReplaySubject } from "rxjs";
import { interval } from "rxjs";
import { exec_child, readConfig, checkIgnoredRoutes, checkEnsuredRoutes } from "../utils/spwan";
import { map, switchMap } from "rxjs/operators";
import { ChromeRenderer } from "../utils/chrome";
import { SSRCommand, CommandScope, Option } from "../utils/command";
import { SSRCliOptions } from "../utils/models";
import { PageOptimizer } from "../utils/css-optimize";
import { Launchserver } from "../utils/expressserver";
import { constants } from "os";


let ssrConfig: SSRCliOptions = {
  cliOptions: {
    command:""
  },
  appOptions:{},
  configOptions:readConfig(),
};

const SSR_FOLDER = join(process.cwd(), ssrConfig.configOptions.paths.SSR_FOLDER);
const DIST_FOLDER = join(process.cwd(), ssrConfig.configOptions.paths.DIST_FOLDER);
const DIST_FOLDER_SERVER = join(process.cwd(),ssrConfig.configOptions.paths.DIST_FOLDER_SERVER);



export default class SpiderCommand extends SSRCommand {
  public readonly name = "spider";
  public readonly description = "Scrap the site for rotes";
  public readonly arguments: string[] = [];
  public static aliases = ["sp"];
  public scope = CommandScope.inProject;
  private url: string;
  private newCrome: ChromeRenderer;
  private pageOptimizer: PageOptimizer;
  private appServer: any;
  private i: number;
  private ssrOptions: SSRCliOptions;
  private initialized = false;
  public options: Option[] = [];
  public route="";
  public routesSpider: string[] = [];
  public routesDone: string[] = [];
   public renderURL = new ReplaySubject<string>(100);

  validate(options: any): boolean | Promise<boolean> {
    if (!options._[0]) {
      this.logger.error(`
        The "ng generate" command requires a
        schematic name to be specified.
        For more details, use "ng help".`);

      return false;
    }

    return true;
  }

  public async initialize(options: any) {
    if (this.initialized) {
      return;
    }

    this.newCrome = new ChromeRenderer();
    this.initialized = true;
  }
  public async run(options: SSRCliOptions) {

     this.ssrOptions = options;
     this.routesSpider.push(this.route);
    this.ssrOptions.configOptions.spider.add.forEach(x=> this.routesSpider.push(x));

    let i: number = 0;
    const routesLen = ROUTES.length;

    this.renderURL.subscribe(
     async (options: string) => {

            this.url = options;


         await this.scrapEachUrl(this.url)


      },
      error => {
        this.logger.warn(`error: at ${this.url}`  );
        let introText = `export const ROUTESSPIDER`
         writeFileSync(resolve(SSR_FOLDER  + '/routes/routes-spider.ts'),introText + "OK =" + JSON.stringify(this.routesDone));
         writeFileSync(resolve(SSR_FOLDER  + '/routes/routes-spider.nok.ts'),introText + "NOK =" + JSON.stringify(this.routesSpider));
        },
      () => {
        this.logger.info(`Finish with last url: ${this.url} \n`);
         if (this.ssrOptions.configOptions.spider.force)
        {
          let introROUTESText = `export const ROUTES = `
          writeFileSync(resolve(SSR_FOLDER  + '/routes/routes.ts'),introROUTESText + JSON.stringify(this.routesDone));

        }
        let introText = `export const ROUTESSPIDER = `
         writeFileSync(resolve(SSR_FOLDER  + '/routes/routes-spider.ts'),introText + JSON.stringify(this.routesDone));
         this.newCrome.close().then(() => console.log("Browser Instance Down"));
         process.exit();

      }
    );
    await this.Launchclient();
  }

  async Launchclient() {
    try {
      const app = express();

      let appServerNew = await Launchserver();


      const aqui = await this.newCrome.initialize();


      await appServerNew.listen(4200, async () => {
        await this.renderURL.next(this.routesSpider[0]);
      });
    } catch (err) {
      console.log(`server not started`);
    }
  }

   async scrapEachUrl(url: string) {


    let ssrConfig: SSRCliOptions = {
      cliOptions: {
        command:""
      },
      appOptions:{},
      configOptions:readConfig(),
    };



      this.newCrome
        .render({ url: "http://localhost:4200" + url })
        .then(html => {
          this.routesDone.push(url);

          const document = createDocument(html);
          var body = document.querySelector("body");
          var aref = body.querySelectorAll("[href]");

          for (let index = 0; index < aref.length; index++) {
            let attr = aref.item(index).getAttribute("href");

             if ( this.routesDone.indexOf(attr)== -1 && attr.substr(0 , 1) === '/' && (checkIgnoredRoutes(ssrConfig.configOptions.spider.ignore,attr) ||
            checkEnsuredRoutes(ssrConfig.configOptions.spider.whitelist,attr))
           )
            {
                  this.routesSpider.push(attr);
            }
          }



          do
          {

          if (this.routesDone.indexOf(this.routesSpider[0])!=-1)
            {  this.routesSpider.splice(0,1) }


          }
          while (this.routesSpider.length!=0 && this.routesDone.indexOf(this.routesSpider[0])!=-1
           );


         //   console.log(routesSpider[0].substr(1,2));

          if (this.routesSpider.length==0)
          {
              this.renderURL.complete();

          }
          else{
            this.logger.warn('SCRAPPING  ' +   this.routesSpider[0] )
            this.renderURL.next(this.routesSpider[0] )
          }





        })
        .catch(error => {
          console.log(error);

        });
    }
  }


