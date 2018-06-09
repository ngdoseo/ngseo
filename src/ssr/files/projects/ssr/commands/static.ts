import {
  existsSync,
  readFileSync,
  readdirSync,
  mkdirSync,
  writeFileSync
} from "fs";
import * as express from "express";
import { resolve, basename, join } from "path";
import { minify } from "html-minifier";

let patterns = [];

import { createWindow, createDocument } from "domino";
import { ReplaySubject } from "rxjs";
import { interval } from "rxjs";
import {
  exec_child,
  checkIgnoredRoutes,
  checkEnsuredRoutes,
  readConfig
} from "../utils/spwan";
import { map, switchMap } from "rxjs/operators";
import { ROUTES } from "../routes/routes";
import { ChromeRenderer } from "../utils/chrome";
import { Launchserver } from "../utils/expressserver";
import { optimizeGroupPlayer } from "@angular/animations/browser/src/render/shared";
import { PageOptimizer } from "../utils/css-optimize";
import { promise } from "protractor";
import { SSRCliOptions } from "../utils/models";
import { SSRCommand, CommandScope, Option } from "../utils/command";


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
// Our index.html we'll use as our template

interface spiderOptions {
  ignore: string[];
  whitelist: string[];
  add: string[];
}

const renderURL = new ReplaySubject<string>(100);

export default class StaticCommand extends SSRCommand {
  public readonly name = "static";
  public readonly description = "Creaton fo static site";
  public readonly arguments: string[] = [];
  public static aliases = ["st"];
  public scope = CommandScope.inProject;
  private url: string;
  private newCrome: ChromeRenderer;
  private pageOptimizer: PageOptimizer;

  private i: number;
  private ssrOptions: SSRCliOptions;
  private initialized = false;
  public appServerNew: express.Application;
  public options: Option[] = [];
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
    this.pageOptimizer = new PageOptimizer();

    this.initialized = true;
  }

  public async run(options: SSRCliOptions) {
    this.ssrOptions = options;

    process.stderr.write("Preparing the rendering of the Routes\n");
    process.stderr.write(
      this.ssrOptions.configOptions.defaults.platform.toString()
    );
    let spiderConfig = this.ssrOptions.configOptions.spider;

    let route = "";
    const routesSpider: string[] = [];
    const routesDone: string[] = [];

    this.i = 0;

    renderURL.subscribe(
      (options: string) => {
        this.url = options;

        this.browserRenderEachUrl(this.url);
      },
      error => {
        console.log(`error: at ${this.url}`);
      },
      async () => {
        this.logger.info(`finish last url: ${this.url}`);
        this.newCrome.close().then(() => this.logger.info("Browser Instance Down"));
    
       
      
        process.exit();
      }
    );

    await this.renderRoutes();
  }

  async renderRoutes() {
 
    if (this.ssrOptions.configOptions.static.optimizecss) {
      await this.pageOptimizer.initialize();
    }

 
  
    //process.stderr.write(this.ssrOptions.configOptions.defaults.platform,'y ssssss');

  
    await this.Launchclient();
   
  }

  async Launchclient() {
    try {
    

      this.appServerNew = await Launchserver();
   

      const newCromeAwait = await this.newCrome.initialize();
   

      await this.appServerNew.listen(4200, async () => {
      await renderURL.next(ROUTES[0]);
      });
    } catch (err) {
      this.logger.warn(`server not started`);
    }
  }

  async browserRenderEachUrl(route: string): Promise<void> {
    try {
      let html = await this.newCrome.render({
        url: "http://localhost:4200" + route
      });


       this.logger.info(`Rendering: ${route}`);
       this.logger.info(`Rendering: ${html.length}`);

      if (this.ssrOptions.configOptions.static.optimizecss) {
        html = await this.pageOptimizer.optimizeCss(html);
      }
      if (this.ssrOptions.configOptions.static.minifyhtml) {
        html  = await this.pageOptimizer.minifyHtml(html);
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
      console.log(route);

      writeFileSync(resolve(DIST_FOLDER + route + "/" + "index.html"), html);

      this.i++;

      if (ROUTES.length == this.i) {
        renderURL.complete();
      } else {
        renderURL.next(ROUTES[this.i]);
      }
    } catch (e) {
      this.logger.info("Error!", e);
    }
  }
}
